
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

unsigned long wifireconnectionwaittime = 0;
int wifireconntioncounter = 0;

void setTimezone(){
  String timezone = getValue(config.timezone, ';', 1);
  setenv("TZ",timezone.c_str(),1); 
  tzset();
  publishLogMessage(C_LOGFILE, NULL, -1, RC_OK, TIME_SET_TIMEZONE,  timezone.c_str());
}

boolean initTime() {
  configTime(0, 0, config.ntpserver);
  for (int i = 0; i < 10; i++) {
    if (getLocalTime(&tm)) {
      setTimezone();
      publishLogMessage(C_LOGFILE, NULL, -1, RC_OK, TIME_SET, NULL);
      return true;
    }
  }
  publishLogMessage(C_LOGFILE, NULL, -1, RC_ERROR, TIME_NOT_SET,  NULL);

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
         publishLogMessage(C_LOGFILE, NULL, -1, RC_ERROR, SYSTEM_NO_WIFI,  runtime.actIP.toString().c_str());
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
        publishLogMessage(C_LOGFILE, NULL, -1, RC_OK, SYSTEM_RECONNECT_WIFI, runtime.actIP.toString().c_str());
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

String getJSONStatus(){
  checkSD();
  String temp;
  temp = "{";
  temp = temp + "\"timestamp\":\"" + getLocalTime() + "\",";
  if(runtime.sdmount)temp = temp + "\"sdmount\":true,";
  else temp = temp + "\"sdmount\":false,";
  temp = temp + "\"version\":\"" + VRS_VERSION + "\",";
  if(runtime.sdready)temp = temp + "\"sd\":true,";
  else temp = temp + "\"sd\":false,";
  if(runtime.mqttactive)temp = temp + "\"mqttactive\":true,";
  else temp = temp + "\"mqttactive\":false,";
  temp = temp + "\"nbtimers\":" + runtime.nbTimers + ",";
  temp = temp + "\"nbtimersactive\":" + getNumberOfActiveTimers()+ ",";
  temp = temp + "\"heap\":" + ESP.getFreeHeap() + "";
  temp = temp + "}";
  return temp;
}

String getJSONTimer(int timerpos){
  
  String temp = "{";
  temp = temp + "\"pos\":\"" + timerpos + "\",";
  temp = temp + "\"id\":" + timers[timerpos].id + ",";
  temp = temp + "\"bez\":\"" + timers[timerpos].bez + "\",";

  temp = temp + "\"gpiopin\":" + timers[timerpos].gpiopin + ",";
  temp = temp + "\"relais\":" + timers[timerpos].relaistype + ",";
  temp = temp + "\"time_on\":" + timers[timerpos].time_on + ",";
  temp = temp + "\"time_off\":" + timers[timerpos].time_off + ",";

  temp = temp + "\"weekdays\":[";
  for (int j = 0; j < 7; j++) {
    if(j>0)temp=temp+",";
    temp = temp + timers[timerpos].weekdays[j];
  }
  temp = temp + "],";

  temp = temp + "\"running_period\":" + timers[timerpos].running_period + ",";
  temp = temp + "\"waiting_period\":" + timers[timerpos].waiting_period + ",";
  temp = temp + "\"timer_program\":" + timers[timerpos].timer_program_type + ",";

  temp = temp + "\"temperature_on\":" + timers[timerpos].temperature_on + ",";
  temp = temp + "\"temperature_off\":" + timers[timerpos].temperature_off + ",";
  temp = temp + "\"tempsensor\":" + timers[timerpos].tempmeasurementtype + ",";
  temp = temp + "\"temperature_difference\":" + timers[timerpos].temperature_difference + ",";
  temp = temp + "\"hysteresis\":" + timers[timerpos].hysteresis + ",";

  if(timers[timerpos].active)temp = temp + "\"active\":true,";
  else temp = temp + "\"active\":false,";
  if(isRelaisTimerActive(timers[timerpos].id))temp = temp + "\"state\":true,";
  else temp = temp + "\"state\":false,";
  temp = temp + "\"timerstatetype\":" + timers[timerpos].timerstatetype + ",";
  temp = temp + "\"runnings\":" + timers[timerpos].runnings + ",";
  temp = temp + "\"waitings\":" + timers[timerpos].waitings + ",";
  temp = temp + "\"laststartdate\":" + timers[timerpos].laststartdate + ",";
  temp = temp + "\"laststarttime\":" + timers[timerpos].laststarttime + ",";
  if(timers[timerpos].publishhomekit)temp = temp + "\"publishhomekit\":true,";
  else temp = temp + "\"publishhomekit\":false,";
  temp = temp + "\"avgtempincreasepermin\":" + timers[timerpos].avgtempincreasepermin + "";
  temp = temp +"}";
  return temp;
}

String getJSONLogEntry(int idtimer, RCStatus status, LogStatusCode code, const char* message){
  String temp;
  temp = "{";
  temp = temp + "\"timestamp\":\"" + getLocalTime() + "\",";
  temp = temp + "\"id\":" + idtimer + ",";
  temp = temp + "\"status\":" + status + ",";
  temp = temp + "\"code\":" + code + "";
  if (message != NULL) temp = temp + ",\"message\":\"" + message + "\"";
  temp = temp + "}";
  return temp;
}

char *replace_str(char *str, char *orig, char *rep, int start){
  static char temp[100];
  static char buffer[100];

  temp[0] = '\0';
  buffer[0] = '\0';

  char *p;
  strcpy(temp, str + start);
  if(!(p = strstr(temp, orig))){
    return temp;
  } 

  strncpy(buffer, temp, p-temp);
  buffer[p-temp] = '\0';

  sprintf(buffer + (p - temp), "%s%s", rep, p + strlen(orig));
  sprintf(str + start, "%s", buffer);    

  return str;
}



