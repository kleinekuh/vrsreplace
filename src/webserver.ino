
PsychicHttpServer server;
PsychicWebSocketHandler ws;
PsychicUploadHandler *uploadHandler = new PsychicUploadHandler();
PsychicUploadHandler *updateHandler = new PsychicUploadHandler();
int nbOfWsClients=0;

void addServerFunctions() {

  server.config.stack_size = 6144;
  server.listen(80);

  server.on("/status", HTTP_GET, getStatus);
  server.on("/log", HTTP_GET, getLog);

  server.on("/temperature", HTTP_GET, getTemperature);
  
  server.on("/timer", HTTP_GET, getTimerById);
  server.on("/timerchange", HTTP_GET, changeTimer);
  server.on("/timerdelete", HTTP_GET, deleteTimers);
  server.on("/timerdeleteall", HTTP_GET, deleteAllTimers);
  server.on("/timerlist", HTTP_GET, getTimerList);
  server.on("/timerstart", HTTP_GET, startTimer);
  server.on("/timerstop", HTTP_GET, stopTimer);
  
  server.on("/system", HTTP_GET, setSystem);
  server.on("/config", HTTP_GET, getConfig);
  server.on("/changeconfig", HTTP_GET, changeConfig);
  server.on("/downloadtemperaturelog", HTTP_GET, downloadTemperatureLog);
  server.on("/testrelay", HTTP_GET, testRelay);
  server.on("/ws", &ws); 
  server.on("/*", HTTP_GET, processPage);

  server.onNotFound(handleNotFound);
    
  ws.onOpen([](PsychicWebSocketClient *client) {
    nbOfWsClients++;
  });

  ws.onClose([](PsychicWebSocketClient *client) {
    nbOfWsClients--;
  }); 
 
  updateHandler->onUpload([](PsychicRequest *request, const String& filename, uint64_t index, uint8_t *data, size_t len, bool last) {
    if (!index){
      runtime.systemState = FIRMWARE_CHANGE;
      DEBUG_P("\n handleUpdate");
      int x=0;
      while(x++<100){
        if(runtime.adc_conversion_started) delay(1000);
        else x=1000;
      }
      if(x<1000){
          DEBUG_P("Fehler 1000");
          processAndSendJsonRC(request, -1, RC_ERROR, WS_FIRMWARE_UPDATE_ERROR, true, NULL);
          return ESP_FAIL;
      }
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) { //start with max available size
        DEBUG_P("Fehler Update begin");
        processAndSendJsonRC(request, -1, RC_ERROR, WS_FIRMWARE_UPDATE_ERROR, true,  String(Update.getError()).c_str());
        return ESP_FAIL;
      }
    }
    if (len) {
      DEBUG_F("\nUpdate: %d",len);
      if(Update.write(data, len) != len) {
        processAndSendJsonRC(request, -1, RC_ERROR, WS_FIRMWARE_UPDATE_ERROR, true, String(Update.getError()).c_str());
        return ESP_FAIL;
      }
    }

    if (last) {
        if (Update.end(true)) { 
          DEBUG_F("Update Success: %u\nRebooting...\n", index+len);
          processAndSendJsonRC(request, -1, RC_OK, WS_FIRMWARE_UPDATE_OK, true,  NULL);
          runtime.systemState = REBOOT;
        } else {
          processAndSendJsonRC(request, -1, RC_ERROR, WS_FIRMWARE_UPDATE_ERROR, true,  String(Update.getError()).c_str());
          runtime.systemState = REBOOT;
          return ESP_FAIL;
        }
    }
    return ESP_OK;
  });
 
  uploadHandler->onUpload([](PsychicRequest *request, const String& filename, uint64_t index, uint8_t *data, size_t len, bool last) {
    File file;
    String path = String(config.webServerPath) + "/" + filename;

    Serial.printf("Writing %d/%d bytes to: %s\n", (int)index+(int)len, request->contentLength(), path.c_str());

    if (last) Serial.printf("%s is finished. Total bytes: %d\n", path.c_str(), (int)index+(int)len);

    if (!index) file = SD.open(path, FILE_WRITE);
    else file = SD.open(path, FILE_APPEND);
    if(!file) {
      Serial.println("Failed to open file");
      return ESP_FAIL;
    }

    if(!file.write(data, len)) {
      Serial.println("Write failed");
      return ESP_FAIL;
    }

    return ESP_OK;
  });

  server.on("/upload", HTTP_POST, uploadHandler); 
  server.on("/update", HTTP_POST, updateHandler); 

  if(config.allowcors){
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  server.on("/*", HTTP_OPTIONS, [](PsychicRequest* request) {
    return request->reply(200);
  });
}

esp_err_t processPage(PsychicRequest* request) {
  if(config.deliverfromsd) return processPageFromSD(request);
  else return processPageFromInternal(request);
}

esp_err_t processPageFromInternal(PsychicRequest* request) {
  
  String path = request->path();
  DEBUG_F("\nprocessPageFromInternal %s", path.c_str());
  PsychicResponse response(request);
  response.addHeader("Content-Encoding", "gzip");
  response.setContentType("text/html");

  if(path.equals("") || path.equals("/") || path.equals("/index.html")){
    response.setContent(index_html_gz, index_html_gz_len);
  }else if(path.equals("/config.html")){
    response.setContent(config_html_gz, config_html_gz_len);
  }else if(path.equals("/timerFormHeating.html")){
    response.setContent(timerFormHeating_html_gz, timerFormHeating_html_gz_len);
  }else if(path.equals("/timerFormSolarPump.html")){
    response.setContent(timerFormSolarPump_html_gz, timerFormSolarPump_html_gz_len);
  }else if(path.equals("/update.html")){
    response.setContent(update_html_gz, update_html_gz_len);
  }else if(path.equals("/mainall.js")){
    response.setContentType("text/javascript");
    response.addHeader("Cache-Control","max-age=86400");
    response.setContent(mainall_js_gz, mainall_js_gz_len);
  }else if(path.equals("/main.css")){
    response.setContentType("text/css");
    response.addHeader("Cache-Control","max-age=86400");
    response.setContent(main_css_gz, main_css_gz_len);
  }else{
    return handleNotFound(request);
  }
  return response.send();

}

esp_err_t processPageFromSD(PsychicRequest* request) {
  
  

  if (!checkSD()) {
    processAndSendJsonRC(request, -1, RC_ERROR, NO_SDCARD, false, "SD Card not ready");
    return ESP_OK;
  }

  String fileName = request->path();
  DEBUG_F("\nprocessPageFromSD %s", fileName.c_str());
  if(fileName.equals("") || fileName.equals("/")){
    return handleRoot(request);
  }
  
  String filePath = String(config.webServerPath) + "/" + fileName;
  String filePathWithGz = filePath + ".gz"; 
 
  if (SD.exists(filePathWithGz) || SD.exists(filePath)) {
    const char * mimetype;
    bool zipped = false;
    bool maxage = false;
    if (SD.exists(filePathWithGz)) {
      zipped = true;
      filePath += ".gz";
    }
    if(fileName.endsWith(".css")){
      mimetype = "text/css";
      maxage = true;
    }else if(fileName.endsWith(".js")){
      mimetype = "text/javascript";
      maxage = true;
    }else{
      mimetype = "text/html";
    }
    PsychicStreamResponse response(request, mimetype);
    if(zipped)response.addHeader("Content-Encoding", "gzip");
    if(maxage)response.addHeader("Cache-Control","max-age=86400");
    response.beginSend();
    File file = SD.open(filePath.c_str());
    response.copyFrom(file);
    file.close();
    return response.endSend();
  }else{
    return handleNotFound(request);
  }

} 

esp_err_t getConfig(PsychicRequest* request) {
  JsonDocument doc;
  String temp;
  doc["ssid"] = config.ssid;
  if(strlen(config.password)==0) doc["password"] = "";
  else doc["password"] = "********";
  doc["ntpserver"] = config.ntpserver;

  doc["lutpath"] = config.lutPath;
  doc["logpath"] = config.logPath;
  doc["webserverpath"] = config.webServerPath;

  doc["temperaturesrt"] = config.temperatureSRT;
  doc["temperaturelwt"] = config.temperatureLWT;
  doc["temperatureswt"] = config.temperatureSWT;

  doc["wificonnectionretries"] = config.wificonnectionretries;
  doc["wifireconnectinterval"] = config.wifireconnectinterval;

  doc["maxtemperature"] = config.maxtemperature;
  doc["version"] = VRS_VERSION;
  doc["allowcors"] = config.allowcors;
  doc["deliverfromsd"] = config.deliverfromsd;

  serializeJson(doc, temp);
  return streamResult(request, 200, "application/json", temp);
} 

esp_err_t changeConfig(PsychicRequest* request) {  
  String json;
  if (!request->hasParam("config")) {
    processAndSendJsonRC(request, -1, RC_ERROR, WS_CHANGE_SETUP_NO_CONFIG, false, NULL);
    return ESP_OK;
  } else {
    json = request->getParam("config")->value();
    StaticJsonDocument<500> doc;
    DeserializationError error = deserializeJson(doc, json);
    if (error) {
      processAndSendJsonRC(request, -1, RC_ERROR, WS_CHANGE_SETUP_ERROR, true, error.c_str());
      return ESP_OK;
    } else {
        //DEBUG_F("\n %s",json.c_str());

        bool configChanged = false;
        String tssid = doc["ssid"];
        String tpassword = doc["password"];
        String tntpserver = doc["ntpserver"];

        int ttemperaturesrt = doc["temperaturesrt"];
        int ttemperaturelwt =doc["temperaturelwt"];
        int ttemperatureswt =doc["temperatureswt"];
        int tmaxtemperature =doc["maxtemperature"];

        int twificonnectionretries = doc["wificonnectionretries"];
        unsigned long twifireconnectinterval = doc["wifireconnectinterval"];
        bool tallowcors = doc["allowcors"];
        bool tdeliverfromsd = doc["deliverfromsd"];


        String tlutpath = doc["lutpath"];
        String tlogpath = doc["logpath"];
        String twebserverpath = doc["webserverpath"];
        
        // Compare Input with config
        if(!tssid.equals(String(config.ssid))){
          strcpy(config.ssid, tssid.c_str());
          configChanged=true;
        }

        if(!tpassword.equals("********")){
          strcpy(config.password, tpassword.c_str());
          configChanged=true; 
        }
        
        config.wificonfigured = true;
        strcpy(config.ntpserver, tntpserver.c_str());
        strcpy(config.logPath, tlogpath.c_str());
        strcpy(config.lutPath, tlutpath.c_str());
        strcpy(config.webServerPath, twebserverpath.c_str());

        config.temperatureSRT = ttemperaturesrt;
        config.temperatureLWT = ttemperaturelwt;
        config.temperatureSWT = ttemperatureswt;
        config.maxtemperature = tmaxtemperature;

        config.wifireconnectinterval = twifireconnectinterval;
        config.wificonnectionretries = twificonnectionretries;
        
        if(config.allowcors!=tallowcors) configChanged=true;
        config.allowcors = tallowcors;
        config.deliverfromsd = tdeliverfromsd;
        
        writeConfig();

        if(configChanged){
          processAndSendJsonRC(request, -1, RC_OK, SYSTEM_CONFIG_CHANGED_RESTART, true, NULL);
          return ESP_OK;
        } else{
          processAndSendJsonRC(request, -1, RC_OK, SYSTEM_CONFIG_CHANGED, true, NULL);
          return ESP_OK;
        }
    }
  }
  return request->reply(200);
}

esp_err_t testRelay(PsychicRequest* request) {  
  int gpio = -1;
  int onoff = -1;
  if (!request->hasParam("gpio") || !isValidNumber(request->getParam("gpio")->value()) || 
      !request->hasParam("onoff") || !isValidNumber(request->getParam("onoff")->value())
      ) {
      processAndSendJsonRC(request, -1, RC_ERROR, TEST_GPIO_NOID, false, NULL);
      return ESP_OK;
  }else{
    gpio = request->getParam("gpio")->value().toInt();
    onoff= request->getParam("onoff")->value().toInt();
    if(gpio==GPIO_HEAT){
      if(onoff==1){
        digitalWrite(GPIO_HEAT, HIGH);
        processAndSendJsonRC(request, gpio, RC_OK, TEST_GPIO_START, false, NULL);
      }else if(onoff==0){
        digitalWrite(GPIO_HEAT, LOW);
        processAndSendJsonRC(request, gpio, RC_OK, TEST_GPIO_STOP, false, NULL);
      }
      return ESP_OK;
    }else if(gpio==GPIO_SOLAR_PUMP){
      if(onoff==1){
        digitalWrite(GPIO_SOLAR_PUMP, HIGH);
        processAndSendJsonRC(request, gpio, RC_OK, TEST_GPIO_START, false, NULL);
      }else if(onoff==0){
        digitalWrite(GPIO_SOLAR_PUMP, LOW);
        processAndSendJsonRC(request, gpio, RC_OK, TEST_GPIO_STOP, false, NULL);
      }

      return ESP_OK;
    }
  }
  processAndSendJsonRC(request, -1, RC_ERROR, TEST_GPIO_NOID, false, NULL);
  return ESP_OK;
} 

void notifyWSClients(RCStatus rcstatus, bool refreshStatus, bool refreshTimer, bool refreshLog, bool refreshTemperature) {
  
  if(nbOfWsClients<=0) return;
  
  JsonDocument doc;
  String temp;
  doc["timestamp"] = getLocalTime();
  doc["sdmount"] = runtime.sdmount;
  doc["sd"] = runtime.sdready;
  doc["nbtimers"] = runtime.nbTimers;
  doc["heap"] = heap_caps_get_free_size(MALLOC_CAP_8BIT);
  doc["rcstatus"] = rcstatus;
  doc["refreshstatus"] = refreshStatus;
  doc["refreshtimer"] = refreshTimer;
  doc["refreshlog"] = refreshLog;
  doc["refreshtemperature"] = refreshTemperature;
  serializeJson(doc, temp);
  ws.sendAll(temp.c_str());
  
}
 
esp_err_t downloadTemperatureLog(PsychicRequest* request) {  
  
  if (!checkSD()) {
    processAndSendJsonRC(request, -1, RC_ERROR, NO_SDCARD, false, "SD Card not ready");
    return ESP_OK;
  }

  if (request->hasParam("logfile")) {
    String logtype = "small";
    if (request->hasParam("type")) {
      logtype  = request->getParam("type")->value();  
    }

    String fileName  = request->getParam("logfile")->value() + "_"+logtype+".csv";
    String filePath = String(config.logPath)+"/"+fileName;
    if (SD.exists(filePath)) {

      PsychicFileResponse response(request, SD, filePath);
      response.addHeader("Content-Type","text/csv");
      return response.send();

    }
  }
  return handleNotFound(request); 
}

esp_err_t handleRoot(PsychicRequest* request) {  
  if (!checkSD()) {
    processAndSendJsonRC(request, -1, RC_ERROR, NO_SDCARD, false, NULL);
    return ESP_OK;
  }

  String path;
  if(runtime.systemState!=RUNNING) path = String("/") + config.webServerPath + "/config.html";
  else path = String("/") + config.webServerPath + "/index.html";

  if(!SD.exists(path)){
    return handleNotFound(request);
  }else{
    PsychicStreamResponse response(request, "text/html");
    response.beginSend();
    File file = SD.open(path.c_str());
    response.copyFrom(file);
    file.close();
    return response.endSend();
  }

} 

esp_err_t startTimer(PsychicRequest* request) {  

  int id = -1;
  int timerpos = -1;

  if (!request->hasParam("id") || !isValidNumber(request->getParam("id")->value())) {
      processAndSendJsonRC(request, -1, RC_ERROR, WS_START_TIMER_NO_ID, false, NULL);
      return ESP_OK;
  }else{
    id = request->getParam("id")->value().toInt();
    timerpos = getTimerPosFromId(id);
    if(timerpos==-1){
      processAndSendJsonRC(request, id, RC_ERROR, WS_START_TIMER_ID_NOT_FOUND, false, NULL);
      return ESP_OK;
    }else{
      if(isRelaisTimerActive(id)){
        processAndSendJsonRC(request, id, RC_ERROR, WS_START_TIMER_ID_STARTED, false, NULL);
        return ESP_OK;
      }else{
        if(hasActiveRelaisType(timers[timerpos].relaistype)){
          processAndSendJsonRC(request, -1, RC_ERROR, WS_START_TIMER_RELAIS_STARTED, false, NULL);
          return ESP_OK;
        }else if(!timers[timerpos].active){
          processAndSendJsonRC(request, id, RC_OK, WS_START_TIMER_DEACTIVATED, true, (String(id) +"|" +String(timers[timerpos].bez)).c_str());
          return ESP_OK;
        }else{
          startRelaisTimer(id);
          processAndSendJsonRC(request, id, RC_OK, WS_START_TIMER_OK, false, NULL);
          return ESP_OK;
        }
      }
    }
  }
  return ESP_OK;
} 

esp_err_t stopTimer(PsychicRequest* request) {  

  int id = -1;
  int timerpos = -1;

  if (!request->hasParam("id") || !isValidNumber(request->getParam("id")->value())) {
    processAndSendJsonRC(request, -1, RC_ERROR, WS_STOP_TIMER_NO_ID, false, NULL);
    return ESP_OK;
  }else{
    id = request->getParam("id")->value().toInt();
    timerpos = getTimerPosFromId(id);
    if(timerpos!=-1 && isRelaisTimerActive(id)){
      stopRelaisTimer(id);
      processAndSendJsonRC(request, id, RC_OK, WS_STOP_TIMER_OK, false, (String(id) +"|" +String(timers[timerpos].bez)).c_str());
      return ESP_OK;
    }else{
      processAndSendJsonRC(request, id, RC_ERROR, WS_STOP_TIMER_NOT_RUNNING, false, NULL);
      return ESP_OK;
    }
  }
  return ESP_OK;
} 

esp_err_t deleteTimers(PsychicRequest* request) {  

  int id, timerpos;
  bool doWrite = false;
  String json;
  JsonDocument rcdoc;

  if (!request->hasParam("timers")) {
    processAndSendJsonRC(request, -1, RC_ERROR, WS_TIMERS_DELETE_NO_ID, false, NULL);
    return ESP_OK;
  } else {
    json = request->getParam("timers")->value();
    StaticJsonDocument<100> doc;
    DeserializationError error = deserializeJson(doc, json);
    if (error) {
      processAndSendJsonRC(request, -1, RC_ERROR, WS_TIMERS_DELETE_GENERAL_ERROR, true, error.c_str());
      return ESP_OK;
    } else {
      for (int i = 0; i < doc["id"].size(); i++) {
        String temp = doc["id"][i];
        if (isValidNumber(temp)) {
          timerpos = getTimerPosFromId(temp.toInt());
          if (timerpos != -1) {
            timers[timerpos].time_on = -1;
            timers[timerpos].time_off = -1;
            timers[timerpos].temperature_off = -1;
            timers[timerpos].temperature_on = -1;
            doWrite = true;
          }
        }
      }
    }
  }
  if (doWrite) {
    if(writeTimers()){
      processAndSendJsonRC(request, -1, RC_OK, WS_TIMERS_DELETE_OK, false, NULL);
      notifyWSClients(RC_OK, true, true, true, false);
    } else {
      processAndSendJsonRC(request, -1, RC_ERROR, WS_TIMERS_DELETE_GENERAL_ERROR, false, NULL);
      notifyWSClients(RC_ERROR, true, true, true, false);
    } 
  }
  return ESP_OK;
}  

esp_err_t setSystem(PsychicRequest* request) {
  if (request->hasParam("reboot")) {
    processAndSendJsonRC(request, -1, RC_OK, SYSTEM_RESTARTED, true, NULL);
    notifyWSClients(RC_OK, true, true, true, false);
    runtime.systemState=REBOOT;
    return ESP_OK;
  }else if (request->hasParam("ntp")) {
    processAndSendJsonRC(request, -1, RC_OK, SYSTEM_NTP_REFRESHED, true, NULL);
    timeset = initTime();
    if(timeset){
      notifyWSClients(RC_OK, true, true, true, false);
    }else{
      notifyWSClients(RC_ERROR, true, true, true, false);
    };
    return ESP_OK;
  }else if (request->hasParam("eraseconfig")) {
    VRSReplaceConfig confignew;
    config = confignew;
    writeConfig();
    processAndSendJsonRC(request, -1, RC_OK, SYSTEM_CONFIG_ERASED, true, NULL);
    return ESP_OK;
  }

  processAndSendJsonRC(request, -1, RC_ERROR, SYSTEM_ERROR, true, NULL);
  notifyWSClients(RC_ERROR, true, false, true, true);
  return ESP_OK;
  
} 

esp_err_t getStatus(PsychicRequest* request) {
  checkSD();
  JsonDocument doc;
  String temp;
  doc["timestamp"] = getLocalTime();
  doc["sdmount"] = runtime.sdmount;
  doc["version"] = VRS_VERSION;
  doc["sd"] = runtime.sdready;
  doc["nbtimers"] = runtime.nbTimers;
  doc["heap"] = heap_caps_get_free_size(MALLOC_CAP_8BIT);
  serializeJson(doc, temp);
  //return request->reply(200, "application/json", temp.c_str());
  /*PsychicStreamResponse response(request, "application/json");
  response.beginSend();
  response.write(temp.c_str());
  return response.endSend();*/
  return streamResult(request, 200, "application/json", temp);
}
 
esp_err_t getLog(PsychicRequest* request) {

  int numberOfRecordsToReturn = 10;

  if (!checkSD()) {
    processAndSendJsonRC(request, -1, RC_ERROR, NO_SDCARD, false, NULL);
    return ESP_OK;
  }
  //String rc = R"([)";
  String rc = "[";
  File file = SD.open((String(config.logPath) + "/log.txt").c_str(), FILE_READ);

  size_t fileSize = file.size();
  if (fileSize > (sizeof(StatusLog) * numberOfRecordsToReturn)) {
    size_t nbRecords = fileSize / sizeof(StatusLog);
    file.seek((nbRecords - numberOfRecordsToReturn) * sizeof(StatusLog));
  }
  
  int i = 0;
  size_t bytesRead;
  StatusLog logstatus;
  JsonDocument doc;
  String temp;
  while (file.available()) {
    bytesRead = file.read((byte *)&logstatus, sizeof(StatusLog));

    doc["id"] = logstatus.id;
    doc["priocode"] = logstatus.priocode;
    doc["date"] = logstatus.date;
    doc["time"] = logstatus.time;
    doc["code"] = logstatus.code;
    doc["message"] = logstatus.message;
    serializeJson(doc, temp);
    //if (i > 0) rc = rc + R"(,)";
    if (i > 0) rc = rc + ",";
    rc = rc + temp;
    i++;
  }
  file.close();
  //rc = rc + R"(])";
  rc = rc + "]";
  //return request->reply(200, "application/json", rc.c_str());
  /*PsychicStreamResponse response(request, "application/json");
  response.beginSend();
  response.write(rc.c_str());
  return response.endSend();*/
  return streamResult(request, 200, "application/json", rc);
}

esp_err_t getTemperature(PsychicRequest* request) {
  String rc = "[";
  for (int i = 0; i < 3; i++) {
    TemperatureSensor sensor = temperaturesensors[i];
    TemperaturePerHour temperatureperhour = temperatureperhours[i];
    JsonDocument doc;
    String temp;
    doc["bez"] = sensor.bez;
    doc["deviceid"] = sensor.deviceId;
    doc["sensortype"] = sensor.sensorType;
    doc["Ta"] = sensor.Ta;
    doc["TaAvg"] = sensor.TaAvg;
    doc["TaMin"] = sensor.TaMin;
    doc["TaMax"] = sensor.TaMax;
    for (int j = 0; j < 24; j++) {

      doc["TaMinH"][j] = temperatureperhour.TaMin[j];
      doc["TaMaxH"][j] = temperatureperhour.TaMax[j];

      doc["TaMinHY"][j] = temperatureperhour.TaMinY[j];
      doc["TaMaxHY"][j] = temperatureperhour.TaMaxY[j];

    }
    serializeJson(doc, temp);
    if (i > 0) rc = rc + ",";
    rc = rc + temp;
  }
  rc = rc + "]";
  return streamResult(request, 200, "application/json", rc);
} 

esp_err_t getTimerById(PsychicRequest* request) {  
  int id = -1;
  int timerpos = -1;
  String temp;

  if (request->hasParam("id") && isValidNumber(request->getParam("id")->value())) {
    id = request->getParam("id")->value().toInt();
    timerpos = getTimerPosFromId(id);
    if (timerpos != -1 && timerpos < runtime.nbTimers) {
      RelaisTimer timer = timers[timerpos];
      JsonDocument doc;
      doc["pos"] = String(timerpos);
      doc["id"] = timer.id;
      doc["bez"] = timer.bez;
      doc["gpiopin"] = timer.gpiopin;
      doc["relais"] = timer.relaistype;
      doc["time_on"] = timer.time_on;
      doc["time_off"] = timer.time_off;
      for (int i = 0; i < 7; i++) doc["weekdays"][i] = timer.weekdays[i];
      doc["running_period"] = timer.running_period;
      doc["waiting_period"] = timer.waiting_period;
      doc["timer_program"] = timer.timer_program_type;
      doc["temperature_on"] = timer.temperature_on;
      doc["temperature_off"] = timer.temperature_off;
      doc["tempsensor"] = timer.tempmeasurementtype;
      doc["temperature_difference"] = timer.temperature_difference;
      doc["hysteresis"] = timer.hysteresis;
      doc["active"] = timer.active;
      doc["state"] = isRelaisTimerActive(timer.id);
      doc["timerstatetype"] = timer.timerstatetype;
      doc["runnings"] = timer.runnings;
      doc["waitings"] = timer.waitings;
      doc["laststartdate"] = timer.laststartdate;
      doc["laststarttime"] = timer.laststarttime;
      doc["publishhomekit"] = timer.publishhomekit;
      doc["avgtempincreasepermin"] = timer.avgtempincreasepermin;
      serializeJson(doc, temp);

    } else {
      processAndSendJsonRC(request, id, RC_ERROR, WS_GET_TIMER_NO_ID, false, NULL);
      return ESP_OK;
    }
  } else {
    processAndSendJsonRC(request, id, RC_ERROR, WS_GET_TIMER_ID_NOT_FOUND, false, NULL);
    return ESP_OK;
  }
  //return request->reply(200, "application/json", temp.c_str());
  return streamResult(request, 200, "application/json", temp);
}  

esp_err_t getTimerList(PsychicRequest* request) {   
  //String rc = R"([)";
  String rc = "[";
  for (int i = 0; i < runtime.nbTimers; i++) {
    RelaisTimer timer = timers[i];
    JsonDocument doc;
    String temp;
    doc["pos"] = String(i);
    doc["id"] = timer.id;
    doc["bez"] = timer.bez;
    doc["gpiopin"] = timer.gpiopin;
    doc["relais"] = timer.relaistype;
    doc["time_on"] = timer.time_on;
    doc["time_off"] = timer.time_off;
    for (int i = 0; i < 7; i++) doc["weekdays"][i] = timer.weekdays[i];
    doc["running_period"] = timer.running_period;
    doc["waiting_period"] = timer.waiting_period;
    doc["timer_program"] = timer.timer_program_type;
    doc["temperature_on"] = timer.temperature_on;
    doc["temperature_off"] = timer.temperature_off;
    doc["tempsensor"] = timer.tempmeasurementtype;
    doc["temperature_difference"] = timer.temperature_difference;
    doc["hysteresis"] = timer.hysteresis;
    doc["active"] = timer.active;
    doc["state"] = isRelaisTimerActive(timer.id);
    doc["timerstatetype"] = timer.timerstatetype;
    doc["runnings"] = timer.runnings;
    doc["waitings"] = timer.waitings;

    doc["laststartdate"] = timer.laststartdate;
    doc["laststarttime"] = timer.laststarttime;
    doc["publishhomekit"] = timer.publishhomekit;
    doc["avgtempincreasepermin"] = timer.avgtempincreasepermin;

    serializeJson(doc, temp);
    //if (i > 0) rc = rc + R"(,)";
    if (i > 0) rc = rc + ",";
    rc = rc + temp;
  }
  //rc = rc + R"(])";
  rc = rc + "]";
  //return request->reply(200, "application/json", rc.c_str());
  /*PsychicStreamResponse response(request, "application/json");
  response.beginSend();
  response.write(rc.c_str());
  return response.endSend();
  */
  return streamResult(request, 200, "application/json", rc);
  
} 
 
esp_err_t changeTimer(PsychicRequest* request) {  
  int id;
  String json;
  JsonDocument rcdoc;
  if (!checkSD()) {
    processAndSendJsonRC(request, -1, RC_ERROR, NO_SDCARD, false, NULL);
    return ESP_FAIL;
  }

  if (!request->hasParam("timer")) {
    processAndSendJsonRC(request, -1, RC_ERROR, WS_CHANGE_TIMER_NO_TIMER, false, NULL);
    return ESP_FAIL;
  } else {
    json = request->getParam("timer")->value();
    StaticJsonDocument<500> doc;
    DeserializationError error = deserializeJson(doc, json);
    if (error) {
      processAndSendJsonRC(request, -1, RC_ERROR, WS_CHANGE_TIMER_GENERAL_ERROR, true, error.c_str());
      return ESP_FAIL;
    } else {
      int relaisType = doc["relais"];
      if (relaisType == HEAT) {
        id = processHeatFromJson(doc);
      } else if (relaisType == SPUMP) {
        id = processSPumpFromJson(doc);
      }
      if (doc["id"] == -1){
        processAndSendJsonRC(request, id, RC_OK, WS_CHANGE_TIMER_ADDED, false, (String(id) +"|" +String(doc["bez"])).c_str());
      } else {
        processAndSendJsonRC(request, id, RC_OK, WS_CHANGE_TIMER_CHANGED, false,  (String(id) +"|" +String(doc["bez"])).c_str());
      } 
    }
    return ESP_OK;
  }
  return ESP_OK;
}  

esp_err_t deleteAllTimers(PsychicRequest* request) {  
  if (!checkSD()) {
    processAndSendJsonRC(request, -1, RC_ERROR, NO_SDCARD, false, NULL);
    return ESP_OK;
  }
  purgeAllTimers();
  return ESP_OK;
}

esp_err_t processAndSendJsonRC(PsychicRequest* request, int idtimer, RCStatus status,  LogStatusCode code, bool writelog, const char *message) {
  JsonDocument rcdoc;
  rcdoc["timestamp"] = getLocalTime();
  rcdoc["id"] = idtimer;
  rcdoc["status"] = status;
  rcdoc["code"] = code;
  if(message!=NULL) rcdoc["message"] = String(message);

  if(writelog){
    writeLogStatus(String(config.logPath) + "/log.txt", code, PRIO_HIGH, message);
  }

  String temp;
  serializeJson(rcdoc, temp);
  if (status == RC_ERROR) return streamResult(request, 404, "application/json", temp);
  else return streamResult(request, 202, "application/json", temp); 
} 

esp_err_t handleNotFound(PsychicRequest* request) {  

  String message = "File Not Found\n\n";
  message += "URI: ";
  message += request->uri();
  message += "\nMethod: ";
  message += (request->method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += request->queryString();
  message += "\n";
  return streamResult(request, 404, "text/plain", message);
} 

esp_err_t streamResult(PsychicRequest* request, int code, String contentType, String result) { 
  PsychicStreamResponse response(request, contentType);
  response.beginSend();
  response.setCode(code);
  response.write(result.c_str());
  return response.endSend();
}  

 