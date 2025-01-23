

unsigned long wifireconnectionwaittime = 0;
int wifireconntioncounter = 0;


boolean initTime() {
  configTime(3600, 3600, config.ntpserver);
  for (int i = 0; i < 3; i++) {
    if (getLocalTime(&tm, 10000)) {
      writeLogStatus(String(config.logPath) + "/log.txt", TIME_SET, SYSTEM, NULL);
      return true;
    }
  }
  writeLogStatus(String(config.logPath) + "/log.txt", TIME_NOT_SET, SYSTEM, NULL);
  return false;
}


char* getLocalTime() {
  static char buf[20];                                             
  if(timeset && getLocalTime(&tm)){
    strftime(buf, sizeof(buf), "%d.%m.%Y %T", &tm);                 
  }else{
    sprintf(buf, "01.01.1970 00:00:00");
  };
  return buf;
}

char* getDisplayTime(bool withcolon) {
  static char buf[20];                                             
  if(timeset && getLocalTime(&tm)){
    if(withcolon) strftime(buf, sizeof(buf), "%d.%m.%y - %H:%M", &tm);                 
    else strftime(buf, sizeof(buf), "%d.%m.%y - %H %M", &tm);                 
  }else{
    sprintf(buf, "01.01.1970 00:00:00");
  };
  return buf;
}


int getHour(){
  static char buf[3];                                             
  if(timeset && getLocalTime(&tm)){
    strftime(buf, sizeof(buf), "%H", &tm);                 
  }else{
    sprintf(buf, "00");
  };
  return atoi(buf);
}

int getSeconds(){
  static char buf[3];                                             
  if(timeset && getLocalTime(&tm)){
    strftime(buf, sizeof(buf), "%S", &tm);                 
  }else{
    sprintf(buf, "00");
  };
  return atoi(buf);
}

int timeStamp(){
  return timeStamp(0);
}

 

int timeStamp(int offset){
  static char buf[7];  
  if(timeset && getLocalTime(&tm)){                                           
    tm.tm_sec = tm.tm_sec +offset;
    mktime(&tm);
    strftime (buf, sizeof(buf), "%H%M%S", &tm);
  }else{
    sprintf(buf, "000000");
  }
  return atoi(buf);      
}

int dateStamp(){
  static char buf[9];  
  if(timeset && getLocalTime(&tm)){                                           
    strftime (buf, sizeof(buf), "%Y%m%d", &tm);
  }else{
    sprintf(buf, "00000000");
  }
  return atoi(buf);    
}

int dateStampYesterday(){
  static char buf[9];  
  if(timeset && getLocalTime(&tm)){  
    tm.tm_mday--; 
    mktime(&tm);                                         
    strftime (buf, sizeof(buf), "%Y%m%d", &tm);
  }else{
    sprintf(buf, "00000000");
  }
  return atoi(buf);    
}


void getDateTime(char *datebuf, char *timebuf){
  if(getLocalTime(&tm)){
    strftime(datebuf, 9, "%Y%m%d", &tm); 
    strftime(timebuf, 7, "%H%M%S", &tm);                
  }else{
    sprintf(datebuf, "19700101");
    sprintf(timebuf, "235959");
  }
}


int dayOfWeek(){
  static char buf[2];  
  if(timeset && getLocalTime(&tm)){                                           
    strftime (buf, sizeof(buf), "%u", &tm);
  }else{
    sprintf(buf, "0");
  }
  return atoi(buf);      
}

bool isValidNumber(String str) {
  for (byte i = 0; i < str.length(); i++) {
    if(!isDigit(str.charAt(i))) return false;
  }
  return true;
}

String getValue(String data, const char separator, int index){
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return found>index ? data.substring(strIndex[0], strIndex[1]) : "";
}

void checkWifi(){
  if(WiFi.status() != WL_CONNECTED) {
    DEBUG_F("\nNot Connected");
    
    WiFi.disconnect();
    unsigned long currentMillis = millis();
    
    wifireconnectionwaittime = wifireconnectionwaittime + (currentMillis - runtime.wifipreviousMillis);
    if(wifireconnectionwaittime > config.wifireconnectinterval){
      DEBUG_F("\nTry Reconnect");
      if(wifireconntioncounter==0){
         writeLogStatus(String(config.logPath) + "/log.txt", SYSTEM_NO_WIFI, SYSTEM, runtime.actIP.toString().c_str());
      }
      wifireconnectionwaittime=0;
      wifireconntioncounter++;
      WiFi.begin(config.ssid, config.password);
      int x=0;
      while (WiFi.status() != WL_CONNECTED && x++<config.wificonnectionretries) {
        delay(1000);
        DEBUG_F("\nNo Connection: %s %d", config.ssid, x);
      }
      if(WiFi.status()==WL_CONNECTED){
        delay(1000);
        DEBUG_F("\nWiFi Reconnected. IP Address: %s", WiFi.localIP().toString(false));
        runtime.actIP = WiFi.localIP();
        writeLogStatus(String(config.logPath) + "/log.txt", SYSTEM_RECONNECT_WIFI, SYSTEM, runtime.actIP.toString().c_str());
        timeset = initTime();
        if(timeset)runtime.acthour = getHour();
        wifireconntioncounter = 0;
        wifireconnectionwaittime = 0;
      } 
    }
    if(wifireconntioncounter >= config.wificonnectionretries){
      config.wificonfigured = false;
      writeConfig();
      runtime.systemState = CONFIG;
      ESP.restart();
    }
    runtime.wifipreviousMillis = currentMillis;
   
  }
}



