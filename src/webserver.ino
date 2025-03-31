
/**********************************************************************
*	Copyright (C) 2025  Martin Lange
*	This file is part of VRS Replace. OpenSource thermal solar control
*
*	This program is free software: you can redistribute it and/or modify
*	it under the terms of the GNU General Public License as published by
*	the Free Software Foundation, either version 3 of the License, or
*	(at your option) any later version.
*
*	This program is distributed in the hope that it will be useful,
*	but WITHOUT ANY WARRANTY; without even the implied warranty of
*	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*	GNU General Public License for more details.
*
*	You should have received a copy of the GNU General Public License
*	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*	https://github.com/kleinekuh/vrsreplace
**********************************************************************/

/*
Version 0.9.8
*/

PsychicHttpServer server;
PsychicWebSocketHandler ws;
PsychicUploadHandler *updateHandler = new PsychicUploadHandler();
PsychicUploadHandler *uploadHandler = new PsychicUploadHandler();
int nbOfWsClients = 0;

typedef esp_err_t PageProcess(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request);


typedef struct {
  int id;
  const char* path;
  bool internalonly;
  int internal_page_size;
  const uint8_t* internal_page;
  PP_HTTP_TYPE http_type;
  PP_PAGE_TYPE page_type;
  PageProcess *onRequest;
} webpagedeliver;

const webpagedeliver webpagedeliveries[] = {
  { 0, "/", false, index_html_gz_len, index_html_gz, PP_GET, PP_HTML_GZ, &processPageFromInternal},
  { 1, "/index.html", false, index_html_gz_len, index_html_gz, PP_GET, PP_HTML_GZ, &processPageFromInternal},
  { 2, "/main.css", false, main_css_gz_len, main_css_gz, PP_GET, PP_CSS_GZ, &processPageFromInternal},
  { 3, "/mainall.js", false, mainall_js_gz_len, mainall_js_gz, PP_GET, PP_JS_GZ, &processPageFromInternal},
  { 4, "/config.html", false, config_html_gz_len, config_html_gz, PP_GET, PP_HTML_GZ, &processPageFromInternal},
  { 5, "/timerFormHeating.html", false, timerformheating_html_gz_len, timerformheating_html_gz, PP_GET, PP_HTML_GZ, &processPageFromInternal},
  { 6, "/timerFormSolarPump.html", false, timerformsolarpump_html_gz_len, timerformsolarpump_html_gz, PP_GET, PP_HTML_GZ, &processPageFromInternal},
  { 7, "/update.html", false, update_html_gz_len, update_html_gz, PP_GET, PP_HTML_GZ, &processPageFromInternal},

  { 8, "/status", true, -1, NULL, PP_GET, PP_JSON, &getStatus},
  { 9, "/timerlist", true, -1, NULL, PP_GET, PP_JSON, &getTimerList},
  { 10, "/log", true, -1, NULL, PP_GET, PP_JSON, &getLog},
  { 11, "/temperature", true, -1, NULL, PP_GET, PP_JSON, &getTemperature},
  { 12, "/config", true, -1, NULL, PP_GET, PP_JSON, &getConfig},
  { 13, "/testrelay", true, -1, NULL, PP_GET, PP_JSON, &testRelay},
  { 14, "/timer", true, NULL, NULL, PP_GET, PP_JSON, &getTimerById},
  { 15, "/timerchange", true, NULL, NULL, PP_GET, PP_JSON, &changeTimer},
  { 16, "/timerdeleteall", true, NULL, NULL, PP_GET, PP_JSON, &deleteAllTimers},
  { 17, "/timerdelete", true, NULL, NULL, PP_GET, PP_JSON, &deleteTimers},
  { 18, "/timerstart", true, NULL, NULL, PP_GET, PP_JSON, &startTimer},
  { 19, "/timerstop", true, NULL, NULL, PP_GET, PP_JSON, &stopTimer},
  { 20, "/system", true, NULL, NULL, PP_GET, PP_JSON, &setSystem},
  { 21, "/downloadtemperaturelog", true, NULL, NULL, PP_GET, PP_JSON, &downloadTemperatureLog},
  { 22, "/changeconfig", true, NULL, NULL, PP_GET_POST, PP_JSON, &changeConfig},
  { 23, "/metrics", true, NULL, NULL, PP_GET, PP_JSON, &metrics}
  
};

esp_err_t processPageFromInternal(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  DEBUG_F("\nprocessPageFromInternal");
  PsychicResponse response(request);
  response.setCookie("lang", config.language);
  response.addHeader("Content-Encoding", "gzip");
  if(page_type==PP_CSS_GZ){
    response.setContentType("text/css");
    response.addHeader("Cache-Control", "max-age=86400");
  } else if(page_type == PP_JS_GZ){
    response.setContentType("text/javascript");
    response.addHeader("Cache-Control", "max-age=86400");
  }else{
    response.setContentType("text/html");
  }
  response.setContent(internal_page, internal_page_size);
  return response.send();
}

void addServerFunctions() {

  server.config.stack_size = 6144;
  server.config.max_uri_handlers = 7;
  
  if (config.allowcors) {
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "*");
  }

  DefaultHeaders::Instance().addHeader("Content-Language", config.language);
  server.listen(80);

  server.on("/ws", &ws);
  server.on("/changeconfig", HTTP_POST, processPage);
  server.on("/update", HTTP_POST, updateHandler);
  server.on("/*", HTTP_GET, processPage);
  server.onNotFound(handleNotFound);

  ws.onOpen([](PsychicWebSocketClient* client) {
    nbOfWsClients++;
  });

  ws.onClose([](PsychicWebSocketClient* client) {
    nbOfWsClients--;
  });
 
  updateHandler->onUpload([](PsychicRequest* request, const String& filename, uint64_t index, uint8_t* data, size_t len, bool last) {
    if (!index) {
      runtime.systemState = FIRMWARE_CHANGE;
      DEBUG_P("\n handleUpdate");
      int x = 0;
      while (x++ < 100) {
        if (runtime.adc_conversion_started) delay(1000);
        else x = 1000;
      }
      if (x < 1000) {
        DEBUG_P("Fehler 1000");
        publishLogMessage(C_LOGFILE | C_HTTP, request, -1, RC_ERROR, WS_FIRMWARE_UPDATE_ERROR, NULL);
        return ESP_FAIL;
      }
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) {  //start with max available size
        DEBUG_P("Fehler Update begin");
        publishLogMessage(C_LOGFILE | C_HTTP, request, -1, RC_ERROR, WS_FIRMWARE_UPDATE_ERROR, String(Update.getError()).c_str());
        return ESP_FAIL;
      }
    }
    if (len) {
      DEBUG_F("\nUpdate: %d", len);
      if (Update.write(data, len) != len) {
        publishLogMessage(C_LOGFILE | C_HTTP, request, -1, RC_ERROR, WS_FIRMWARE_UPDATE_ERROR, String(Update.getError()).c_str());
        return ESP_FAIL;
      }
    }

    if (last) {
      if (Update.end(true)) {
        DEBUG_F("Update Success: %u\nRebooting...\n", index + len);
        publishLogMessage(C_LOGFILE | C_HTTP, request, -1, RC_OK, WS_FIRMWARE_UPDATE_OK, NULL);
        runtime.systemState = REBOOT;
      } else {
        publishLogMessage(C_LOGFILE | C_HTTP, request, -1, RC_ERROR, WS_FIRMWARE_UPDATE_ERROR, String(Update.getError()).c_str());
        runtime.systemState = REBOOT;
        return ESP_FAIL;
      }
    }
    return ESP_OK;
  });

  uploadHandler->onUpload([](PsychicRequest *request, const String& filename, uint64_t index, uint8_t *data, size_t len, bool last) {
    File file;
    String path = String(config.webServerPath) + "/" + filename;

    DEBUG_F("\nWriting %d/%d bytes to: %s", (int)index+(int)len, request->contentLength(), path.c_str());

    if (last) DEBUG_F("\n%s is finished. Total bytes: %d", path.c_str(), (int)index+(int)len);

    if (!index) file = SD.open(path, FILE_WRITE);
    else file = SD.open(path, FILE_APPEND);
    if(!file) {
      DEBUG_F("\nFailed to open file");
      return ESP_FAIL;
    }

    if(!file.write(data, len)) {
      DEBUG_F("\nWrite failed");
      return ESP_FAIL;
    }

    return ESP_OK;
  });
  server.on("/upload", HTTP_POST, uploadHandler); 
  server.on("/*", HTTP_OPTIONS, [](PsychicRequest* request) {
    return request->reply(200);
  });
}

esp_err_t processPage(PsychicRequest* request) {
  int pages_size = sizeof(webpagedeliveries) / sizeof (webpagedeliveries[0]);
  for(int i=0;i<pages_size;i++){
    if(strcmp(request->path().c_str(), webpagedeliveries[i].path) == 0){
      webpagedeliver xwebpage = webpagedeliveries[i];
      if (runtime.systemState != RUNNING && xwebpage.page_type == PP_HTML_GZ){
        xwebpage = webpagedeliveries[getConfigPageIndex()];
      }
      if(config.deliverfromsd && !xwebpage.internalonly){
        processPageFromSD(request);
      }else{
        xwebpage.onRequest(xwebpage.internal_page_size, xwebpage.internal_page, xwebpage.http_type, xwebpage.page_type, request);
      }
      return ESP_OK;
    }
  }
  return handleNotFound(request);
}

esp_err_t processPageFromSD(PsychicRequest* request) {

  if (!checkSD()) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, NO_SDCARD, "SD Card not ready");
  }

  String fileName = request->path();
  DEBUG_F("\nprocessPageFromSD %s", fileName.c_str());
  if (fileName.equals("") || fileName.equals("/")) {
    fileName = "index.html";
  }

  String filePath = String(config.webServerPath) + "/" + fileName;
  String filePathWithGz = filePath + ".gz";

  if (SD.exists(filePathWithGz) || SD.exists(filePath)) {
    const char* mimetype;
    bool zipped = false;
    bool maxage = false;
    if (SD.exists(filePathWithGz)) {
      zipped = true;
      filePath += ".gz";
    }
    if (fileName.endsWith(".css")) {
      mimetype = "text/css";
      maxage = true;
    } else if (fileName.endsWith(".js")) {
      mimetype = "text/javascript";
      maxage = true;
    } else {
      mimetype = "text/html";
    }
    PsychicStreamResponse response(request, mimetype);
    response.setCookie("lang", config.language);
    if (zipped) response.addHeader("Content-Encoding", "gzip");
    if (maxage) response.addHeader("Cache-Control", "max-age=86400");
    response.beginSend();
    File file = SD.open(filePath.c_str());
    response.copyFrom(file);
    file.close();
    return response.endSend();
  } 
  return handleNotFound(request);
}

esp_err_t getConfig(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  String temp = "{";
  temp = temp + "\"ssid\":\"" + config.ssid + "\",";
  if (strlen(config.password) == 0) temp = temp + "\"password\":\"\",";
  else temp = temp + "\"password\":\"********\",";
  temp = temp + "\"ntpserver\":\"" + config.ntpserver + "\",";
  temp = temp + "\"lutpath\":\"" + config.lutPath + "\",";
  temp = temp + "\"logpath\":\"" + config.logPath + "\",";
  temp = temp + "\"webserverpath\":\"" + config.webServerPath + "\",";
  temp = temp + "\"temperaturesrt\":" + config.temperatureSRT + ",";
  temp = temp + "\"temperaturelwt\":" + config.temperatureLWT + ",";
  temp = temp + "\"temperatureswt\":" + config.temperatureSWT + ",";
  temp = temp + "\"wificonnectionretries\":" + config.wificonnectionretries + ",";
  temp = temp + "\"wifireconnectinterval\":" + config.wifireconnectinterval + ",";
  temp = temp + "\"maxtemperature\":" + config.maxtemperature + ",";
  temp = temp + "\"version\":\"" + VRS_VERSION + "\",";
  if (config.allowcors) temp = temp + "\"allowcors\":true,";
  else temp = temp + "\"allowcors\":false,";
  if (config.deliverfromsd) temp = temp + "\"deliverfromsd\":true,";
  else temp = temp + "\"deliverfromsd\":false,";
  if (config.mqttactive) temp = temp + "\"mqttactive\":true,";
  else temp = temp + "\"mqttactive\":false,";
  temp = temp + "\"mqttserver\":\"" + config.mqttserver + "\",";
  temp = temp + "\"mqttsendinterval\":" + config.mqttsendinterval + ",";
  temp = temp + "\"language\":\"" + config.language + "\",";
  temp = temp + "\"timezone\":\"" + config.timezone + "\"";
  temp = temp + "}";
  return streamResult(request, 200, "application/json", temp);
}

esp_err_t changeConfig(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  DEBUG_F("\nchangeConfig %s", request->methodStr());
  if (request->methodStr().equals("GET")) {
    return changeConfigJSON(request);
  } else {
    return changeConfigPOST(request);
  }
};

esp_err_t changeConfigPOST(PsychicRequest* request) {
  bool needsRestart = false;
  bool mqttChanged = false;
  bool ntpChanged = false;
 

  if (request->hasParam("ssid")) {
    String tssid = request->getParam("ssid")->value();
    if (!tssid.equals(String(config.ssid))) {
      strcpy(config.ssid, tssid.c_str());
      needsRestart = true;
    }
  }

  if (request->hasParam("password")) {
    String tpassword = request->getParam("password")->value();
    if (!tpassword.equals("********")) {
      strcpy(config.password, tpassword.c_str());
      needsRestart = true;
    }
  }
  config.wificonfigured = true;

  if (request->hasParam("ntpserver")) {
    String tntpserver = request->getParam("ntpserver")->value();
    if (!tntpserver.equals(String(config.ntpserver))) {
      strcpy(config.ntpserver, tntpserver.c_str());
      ntpChanged = true;
    }
  }

  if (request->hasParam("timezone")) {
    String ttimezone = request->getParam("timezone")->value();
    if (!ttimezone.equals(String(config.timezone))) {
      strcpy(config.timezone, ttimezone.c_str());
      ntpChanged = true;
    }
  }

  if (request->hasParam("language")) {
    String tlanguage = request->getParam("language")->value();
    if (!tlanguage.equals(String(config.language))) {
      strcpy(config.language, tlanguage.c_str());
    }
  }

  if (request->hasParam("wificonnectionretries") && isValidNumber(request->getParam("wificonnectionretries")->value())) {
    config.wificonnectionretries = request->getParam("wificonnectionretries")->value().toInt();
  }

  if (request->hasParam("wifireconnectinterval") && isValidNumber(request->getParam("wifireconnectinterval")->value())) {
    config.wifireconnectinterval = request->getParam("wifireconnectinterval")->value().toInt();
  }

  if (request->hasParam("mqttactive")) {
    if (!config.mqttactive) mqttChanged = true;
    config.mqttactive = true;
  } else {
    if (config.mqttactive) mqttChanged = true;
    config.mqttactive = false;
  }

  if (request->hasParam("mqttserver")) {
    String tmqttserver = request->getParam("mqttserver")->value();
    if (!tmqttserver.equals(String(config.mqttserver))) {
      strcpy(config.mqttserver, tmqttserver.c_str());
      mqttChanged = true;
    }
  }

  if (request->hasParam("mqttsendinterval") && isValidNumber(request->getParam("mqttsendinterval")->value())) {
    config.mqttsendinterval = request->getParam("mqttsendinterval")->value().toInt();
  }

  if (request->hasParam("temperatureswt") && isValidNumber(request->getParam("temperatureswt")->value())) {
    config.temperatureSWT = request->getParam("temperatureswt")->value().toInt();
  }

  if (request->hasParam("temperaturelwt") && isValidNumber(request->getParam("temperaturelwt")->value())) {
    config.temperatureLWT = request->getParam("temperaturelwt")->value().toInt();
  }

  if (request->hasParam("temperaturesrt") && isValidNumber(request->getParam("temperaturesrt")->value())) {
    config.temperatureSRT = request->getParam("temperaturesrt")->value().toInt();
  }

  if (request->hasParam("maxtemperature") && isValidNumber(request->getParam("maxtemperature")->value())) {
    config.maxtemperature = request->getParam("maxtemperature")->value().toInt();
  }

  if (request->hasParam("logpath")) {
    strcpy(config.logPath, request->getParam("logpath")->value().c_str());
  }

  if (request->hasParam("webserverpath")) {
    strcpy(config.webServerPath, request->getParam("webserverpath")->value().c_str());
  }

  if (request->hasParam("lutpath")) {
    strcpy(config.lutPath, request->getParam("lutpath")->value().c_str());
  }

  if (request->hasParam("allowcors")) {
    if (!config.allowcors) needsRestart = true;
    config.allowcors = true;
  } else {
    if (config.allowcors) needsRestart = true;
    config.allowcors = false;
  }

  if (request->hasParam("deliverfromsd")) {
    config.deliverfromsd = true;
  } else {
    config.deliverfromsd = false;
  }
  writeConfig();

  if (needsRestart) {
    return publishLogMessage(C_HTTP | C_LOGFILE, request, -1, RC_OK, SYSTEM_CONFIG_CHANGED_RESTART, NULL);
  } else{
    if (mqttChanged) runtime.systemState = MQTT_CHANGE;
    if (ntpChanged){
      timeset = initTime();
    } 
    return publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_STATUS | C_WS_TIMER | C_WS_LOG, request, -1, RC_OK, SYSTEM_CONFIG_CHANGED, NULL);
  }
  return request->reply(200);
}

esp_err_t changeConfigJSON(PsychicRequest* request) {
  if (!request->hasParam("config")) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, WS_CHANGE_SETUP_NO_CONFIG, NULL);
  } else {
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, request->getParam("config")->value().c_str());
    if (error) {
      return publishLogMessage(C_HTTP, request, -1, RC_ERROR, WS_CHANGE_SETUP_ERROR, error.c_str());
    } else {
      bool needsRestart = false;
      String tssid = doc["ssid"];
      String tpassword = doc["password"];
      String tntpserver = doc["ntpserver"];

      int ttemperaturesrt = doc["temperaturesrt"];
      int ttemperaturelwt = doc["temperaturelwt"];
      int ttemperatureswt = doc["temperatureswt"];
      int tmaxtemperature = doc["maxtemperature"];

      int twificonnectionretries = doc["wificonnectionretries"];
      unsigned long twifireconnectinterval = doc["wifireconnectinterval"];
      bool tallowcors = doc["allowcors"];
      bool tdeliverfromsd = doc["deliverfromsd"];

      String tlutpath = doc["lutpath"];
      String tlogpath = doc["logpath"];
      String twebserverpath = doc["webserverpath"];

      // Compare Input with config
      if (!tssid.equals(String(config.ssid))) {
        strcpy(config.ssid, tssid.c_str());
        needsRestart = true;
      }

      if (!tpassword.equals("********")) {
        strcpy(config.password, tpassword.c_str());
        needsRestart = true;
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

      if (config.allowcors != tallowcors) needsRestart = true;
      config.allowcors = tallowcors;
      config.deliverfromsd = tdeliverfromsd;

      writeConfig();

      if (needsRestart) {
        return publishLogMessage(C_HTTP | C_LOGFILE, request, -1, RC_ERROR, SYSTEM_CONFIG_CHANGED_RESTART, NULL);
      } else {
        return publishLogMessage(C_HTTP | C_LOGFILE, request, -1, RC_ERROR, SYSTEM_CONFIG_CHANGED, NULL);
      }
    }
  }
  return request->reply(200);
}

esp_err_t testRelay(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  int gpio = -1;
  int onoff = -1;
  if (!request->hasParam("gpio") || !isValidNumber(request->getParam("gpio")->value()) || !request->hasParam("onoff") || !isValidNumber(request->getParam("onoff")->value())) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, SYSTEM_CONFIG_CHANGED, NULL);
  } else {
    gpio = request->getParam("gpio")->value().toInt();
    onoff = request->getParam("onoff")->value().toInt();
    if (gpio == GPIO_HEAT) {
      if (onoff == 1) {
        digitalWrite(GPIO_HEAT, HIGH);
        publishLogMessage(C_HTTP, request, gpio, RC_OK, TEST_GPIO_START, NULL);
      } else if (onoff == 0) {
        digitalWrite(GPIO_HEAT, LOW);
        publishLogMessage(C_HTTP, request, gpio, RC_OK, TEST_GPIO_STOP, NULL);
      }
      return ESP_OK;
    } else if (gpio == GPIO_SOLAR_PUMP) {
      if (onoff == 1) {
        digitalWrite(GPIO_SOLAR_PUMP, HIGH);
        publishLogMessage(C_HTTP , request, gpio, RC_OK, TEST_GPIO_START, NULL);
      } else if (onoff == 0) {
        digitalWrite(GPIO_SOLAR_PUMP, LOW);
        publishLogMessage(C_HTTP, request, gpio, RC_OK, TEST_GPIO_STOP, NULL);
      }
      return ESP_OK;
    } /*else if (gpio == GPIO_CIRCULATION_PUMP) {
      if (onoff == 1) {
        digitalWrite(GPIO_CIRCULATION_PUMP, HIGH);
        processLogMessage(request, gpio, RC_OK, TEST_GPIO_START, false, false, NULL);
        return publishLogMessage(C_HTTP | C_LOGFILE, request, -1, RC_OK, SYSTEM_CONFIG_CHANGED, NULL);
      } else if (onoff == 0) {
        digitalWrite(GPIO_CIRCULATION_PUMP, LOW);
        processLogMessage(request, gpio, RC_OK, TEST_GPIO_STOP, false, false, NULL);
        return publishLogMessage(C_HTTP , request, -1, RC_OK, SYSTEM_CONFIG_CHANGED, NULL);
      }
      return ESP_OK;
    } */
  }
  return publishLogMessage(C_HTTP, request, -1, RC_ERROR, TEST_GPIO_NOID, NULL);
}

void notifyWSClients(RCStatus rcstatus, unsigned logreceiver) {

  if (nbOfWsClients <= 0) return;

  String temp;
  temp = "{";
  temp = temp + "\"timestamp\":\"" + getLocalTime() + "\",";
  if (runtime.sdmount) temp = temp + "\"sdmount\":true,";
  else temp = temp + "\"sdmount\":false,";
  if (runtime.sdready) temp = temp + "\"sd\":true,";
  else temp = temp + "\"sd\":false,";
  if (runtime.mqttactive) temp = temp + "\"mqttactive\":true,";
  else temp = temp + "\"mqttactive\":false,";
  temp = temp + "\"nbtimers\":" + runtime.nbTimers + ",";
  temp = temp + "\"nbtimersactive\":" + getNumberOfActiveTimers() + ",";
  temp = temp + "\"heap\":" + heap_caps_get_free_size(MALLOC_CAP_8BIT) + ",";

  if (rcstatus) temp = temp + "\"rcstatus\":true,";
  else temp = temp + "\"rcstatus\":false,";

  if (logreceiver & C_WS_STATUS) temp = temp + "\"refreshstatus\":true,";
  else temp = temp + "\"refreshstatus\":false,";

  if (logreceiver & C_WS_TIMER) temp = temp + "\"refreshtimer\":true,";
  else temp = temp + "\"refreshtimer\":false,";

  if (logreceiver & C_WS_LOG) temp = temp + "\"refreshlog\":true,";
  else temp = temp + "\"refreshlog\":false,";

  if (logreceiver & C_WS_TEMPERATURE) temp = temp + "\"refreshtemperature\":true";
  else temp = temp + "\"refreshtemperature\":false";

  temp = temp + "}";

  ws.sendAll(temp.c_str());
 
}

esp_err_t downloadTemperatureLog(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {

  if (!checkSD()) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, NO_SDCARD, "SD Card not ready");
  }

  if (request->hasParam("logfile")) {
    String logtype = "small";
    if (request->hasParam("type")) {
      logtype = request->getParam("type")->value();
    }

    String fileName = request->getParam("logfile")->value() + "_" + logtype + ".csv";
    String filePath = String(config.logPath) + "/" + fileName;
    if (SD.exists(filePath)) {
      PsychicFileResponse response(request, SD, filePath);
      response.addHeader("Content-Type", "text/csv");
      return response.send();
    }
  }
  return handleNotFound(request);
}

esp_err_t startTimer(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {

  int id = -1;
  int timerpos = -1;

  if (!request->hasParam("id") || !isValidNumber(request->getParam("id")->value())) {
    return publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_LOG, request, -1, RC_ERROR, WS_START_TIMER_NO_ID, NULL);
  } else {
    id = request->getParam("id")->value().toInt();
    timerpos = getTimerPosFromId(id);
    if (timerpos == -1) {
      return publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_LOG, request, id, RC_ERROR, WS_START_TIMER_ID_NOT_FOUND, NULL);
    } else {
      if (isRelaisTimerActive(id)) {
         return publishLogMessage(C_HTTP, request, id, RC_ERROR, WS_START_TIMER_ID_STARTED, NULL);
      } else {
        if (hasActiveRelaisType(timers[timerpos].relaistype)) {
          return publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_LOG, request, -1, RC_ERROR, WS_START_TIMER_RELAIS_STARTED, NULL);
        } else if (!timers[timerpos].active) {
          return publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_LOG, request, id, RC_ERROR, WS_START_TIMER_DEACTIVATED, NULL);
      } else {
          startRelaisTimer(id);
          return publishLogMessage(C_HTTP, request, id, RC_OK, WS_START_TIMER_OK, (String(id) + "|" + String(timers[timerpos].bez)).c_str());
        }
      }
    }
  }
  return ESP_OK;
}

esp_err_t stopTimer(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {

  int id = -1;
  int timerpos = -1;

  if (!request->hasParam("id") || !isValidNumber(request->getParam("id")->value())) {
    return publishLogMessage(C_HTTP  | C_LOGFILE | C_WS | C_WS_LOG, request, -1, RC_ERROR, WS_STOP_TIMER_NO_ID, NULL);
  } else {
    id = request->getParam("id")->value().toInt();
    timerpos = getTimerPosFromId(id);
    if (timerpos != -1 && isRelaisTimerActive(id)) {
      stopRelaisTimer(id);
      return publishLogMessage(C_HTTP, request, id, RC_OK, WS_STOP_TIMER_OK, (String(id) + "|" + String(timers[timerpos].bez)).c_str());
    } else {
      return publishLogMessage(C_HTTP | C_MQTT, request, id, RC_ERROR, WS_STOP_TIMER_NOT_RUNNING,  NULL);
    }
  }
  return ESP_OK;
}

esp_err_t deleteTimers(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  int timerpos;
  bool doWrite = false;
  if (!request->hasParam("timers")) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, WS_TIMERS_DELETE_NO_ID, NULL);
  } else {
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, request->getParam("timers")->value().c_str());
    if (error) {
      return publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_LOG, request, -1, RC_ERROR, WS_TIMERS_DELETE_GENERAL_ERROR, error.c_str());
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
    if (writeTimers()) {
      return publishLogMessage(C_HTTP | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER, request, -1, RC_OK, WS_TIMERS_DELETE_OK, NULL);
    } else {
      return publishLogMessage(C_HTTP | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER, request, -1, RC_ERROR, WS_TIMERS_DELETE_GENERAL_ERROR, NULL);
    }
  }
  return ESP_OK;
}

esp_err_t setSystem(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  if (request->hasParam("reboot")) {
    publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER, request, -1, RC_OK, SYSTEM_RESTARTED, NULL);
    runtime.systemState = REBOOT;
    return ESP_OK;
  } else if (request->hasParam("ntp")) {
    timeset = initTime();
    if (timeset) {
      publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER | C_MQTT, request, -1, RC_OK, SYSTEM_NTP_REFRESHED, NULL);
    } else {
      publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_STATUS | C_WS_LOG , request, -1, RC_ERROR, SYSTEM_NTP_REFRESHED, NULL);
    };
    return ESP_OK;
  } else if (request->hasParam("eraseconfig")) {
    VRSReplaceConfig confignew;
    config = confignew;
    writeConfig();
    publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_STATUS | C_WS_LOG | C_MQTT, request, -1, RC_OK, SYSTEM_CONFIG_ERASED, NULL);
    return ESP_OK;
  }
  publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_STATUS | C_WS_LOG | C_MQTT, request, -1, RC_ERROR, SYSTEM_ERROR, NULL);
  return ESP_OK;
}

esp_err_t getStatus(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  return streamResult(request, 200, "application/json", getJSONStatus().c_str());
}

esp_err_t getLog(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {

  int numberOfRecordsToReturn = 10;

  if (!checkSD()) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, NO_SDCARD, "SD Card not ready");
  }
  String temp = "[";
  File file = SD.open((String(config.logPath) + "/log.txt").c_str(), FILE_READ);

  size_t fileSize = file.size();
  if (fileSize > (sizeof(StatusLog) * numberOfRecordsToReturn)) {
    size_t nbRecords = fileSize / sizeof(StatusLog);
    file.seek((nbRecords - numberOfRecordsToReturn) * sizeof(StatusLog));
  }

  int i = 0;
  size_t bytesRead;
  StatusLog logstatus;
  while (file.available()) {
    bytesRead = file.read((byte*)&logstatus, sizeof(StatusLog));
    if (i > 0) temp = temp + ",";
    temp = temp + "{";
    temp = temp + "\"id\":" + logstatus.id + ",";
    temp = temp + "\"priocode\":" + logstatus.priocode + ",";
    temp = temp + "\"date\":" + logstatus.date + ",";
    temp = temp + "\"time\":" + logstatus.time + ",";
    temp = temp + "\"code\":" + logstatus.code + ",";
    temp = temp + "\"message\":\"" + logstatus.message + "\"";
    temp = temp + "}";
    i++;
  }
  file.close();
  temp = temp + "]";
  return streamResult(request, 200, "application/json", temp);
}

esp_err_t getTemperature(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {

  String temp = "[";
  for (int i = 0; i < 3; i++) {
    TemperatureSensor sensor = temperaturesensors[i];
    TemperaturePerHour temperatureperhour = temperatureperhours[i];
    if (i > 0) temp = temp + ",";
    temp = temp + "{";
    temp = temp + "\"bez\":\"" + sensor.bez + "\",";
    temp = temp + "\"deviceid\":" + sensor.deviceId + ",";
    temp = temp + "\"sensortype\":" + sensor.sensorType + ",";
    temp = temp + "\"Ta\":" + sensor.Ta + ",";
    temp = temp + "\"TaAvg\":" + sensor.TaAvg + ",";
    temp = temp + "\"TaMin\":" + sensor.TaMin + ",";
    temp = temp + "\"TaMax\":" + sensor.TaMax + ",";

    temp = temp + "\"TaMinH\":[";
    for (int j = 0; j < 24; j++) {
      if (j > 0) temp = temp + ",";
      temp = temp + temperatureperhour.TaMin[j];
    }
    temp = temp + "],";

    temp = temp + "\"TaMaxH\":[";
    for (int j = 0; j < 24; j++) {
      if (j > 0) temp = temp + ",";
      temp = temp + temperatureperhour.TaMax[j];
    }
    temp = temp + "],";

    temp = temp + "\"TaMinHY\":[";
    for (int j = 0; j < 24; j++) {
      if (j > 0) temp = temp + ",";
      temp = temp + temperatureperhour.TaMinY[j];
    }
    temp = temp + "],";

    temp = temp + "\"TaMaxHY\":[";
    for (int j = 0; j < 24; j++) {
      if (j > 0) temp = temp + ",";
      temp = temp + temperatureperhour.TaMaxY[j];
    }
    temp = temp + "]";
    temp = temp + "}";
  }

  temp = temp + "]";
  return streamResult(request, 200, "application/json", temp);
}

esp_err_t getTimerById(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  int id = -1;
  int timerpos = -1;
  String temp;

  if (request->hasParam("id") && isValidNumber(request->getParam("id")->value())) {
    id = request->getParam("id")->value().toInt();
    timerpos = getTimerPosFromId(id);
    if (timerpos != -1 && timerpos < runtime.nbTimers) {
      temp = temp + getJSONTimer(timerpos);
    } else {
      return publishLogMessage(C_HTTP, request, -1, RC_ERROR, WS_GET_TIMER_NO_ID, NULL);
    }
  } else {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, WS_GET_TIMER_ID_NOT_FOUND, NULL);
  }
  return streamResult(request, 200, "application/json", temp);
}

esp_err_t getTimerList(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  String temp = "[";
  for (int i = 0; i < runtime.nbTimers; i++) {
    if (i > 0) temp = temp + ",";
    temp = temp + getJSONTimer(i);
  }
  temp = temp + "]";
  return streamResult(request, 200, "application/json", temp);
}

esp_err_t changeTimer(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {

  int id;
  if (!checkSD()) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, NO_SDCARD, NULL);
  }

 
  if (!request->hasParam("timer")) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, WS_CHANGE_TIMER_NO_TIMER, NULL);
  } else {
    JsonDocument doc;
    DeserializationError error = deserializeJson(doc, request->getParam("timer")->value().c_str());
    if (error) {
      return publishLogMessage(C_HTTP | C_LOGFILE | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER, request, -1, RC_ERROR, WS_CHANGE_TIMER_GENERAL_ERROR, error.c_str());
    } else {
      int relaisType = doc["relais"];
      if (relaisType == HEAT) {
        id = processHeatFromJson(doc);
      } else if (relaisType == SPUMP) {
        id = processSPumpFromJson(doc);
      }
      if (doc["id"] == -1) {
        return publishLogMessage(C_HTTP, request, id, RC_OK, WS_CHANGE_TIMER_ADDED,  (String(id) + "|" + String(doc["bez"])).c_str());
      } else {
        return publishLogMessage(C_HTTP, request, id, RC_OK, WS_CHANGE_TIMER_CHANGED,  (String(id) + "|" + String(doc["bez"])).c_str());
      }
    } 
    return ESP_OK;
  }
  return ESP_OK;
}

esp_err_t deleteAllTimers(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request) {
  if (!checkSD()) {
    return publishLogMessage(C_HTTP, request, -1, RC_ERROR, NO_SDCARD, "SD Card not ready");
  }
  purgeAllTimers();
  return ESP_OK;
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

int getConfigPageIndex(){
  int pages_size = sizeof(webpagedeliveries) / sizeof (webpagedeliveries[0]);
  for(int i=0;i<pages_size;i++){
    if(strcmp("/config.html", webpagedeliveries[i].path) == 0){
      return i;
    }
  }
  return -1;
}


