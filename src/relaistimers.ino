
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

RelaisTimer* backuptimers;
void reloadTimers(){
   if (!checkSD()) {
    return;
   }

  if(!runtime.sdready){
    runtime.nbTimers=0;
    return;
  }
  runtime.nbTimers = numberOfTimers();
  if(runtime.nbTimers>0){
    free(timers);
    timers = (RelaisTimer*)malloc(runtime.nbTimers * sizeof(RelaisTimer));
    readTimers();
    if(config.mqttactive){
      rebuildTimerTopics();
    }
  } 
}

RelaisTimer initNewTimer(int gpiopin, RelaisType relaistype){
  RelaisTimer timer;
  timer.id= lastTimerID()+1;
  memset(timer.bez, 0, sizeof(timer.bez));
  timer.gpiopin=gpiopin;
  timer.relaistype=relaistype;
  timer.time_on=-1;
  timer.time_off=-1;
  for(int i=0;i<7;i++)timer.weekdays[i]=0;
  timer.running_period=-1;
  timer.waiting_period=-1;
  timer.timer_program_type = PER_REQUEST;
  timer.temperature_on=-1;
  timer.temperature_off=-1;
  timer.tempmeasurementtype = AVG_SP1_SP2;
  timer.temperature_difference=-1;
  timer.hysteresis=-1;
  timer.active=false;
  timer.timerstatetype = OFF;
  timer.datestamp = 0;
  timer.timestamp = 0;
  timer.runtime = 0;
  timer.waittime = 0;
  timer.runnings = 0;
  timer.waitings = 0;
  timer.laststartdate = 0;
  timer.laststarttime = 0;
  timer.nextstarttime = 0;
  timer.nextstoptime = 0;
  timer.nextstarttemp = 0;
  timer.nextstoptemp = 0;
  timer.publishhomekit = false;
  timer.avgtempincreasepermin = -1;
  return timer;
}

int processHeatFromJson(JsonDocument doc){
  RelaisTimer timer;

  int id=doc["id"];
  int pos=-1;
  if(id!=-1){
    pos = getTimerPosFromId(id);
    if(pos==-1) id=-1;
  }
  
  if(id==-1){
    timer = initNewTimer(GPIO_HEAT, doc["relais"]);
  }else{
    timer = timers[pos];
  }

  timer.timer_program_type=doc["timer_program"];
  String temp = doc["bez"];
  int len = temp.length()+1;
  if(len > sizeof(timer.bez))len=sizeof(timer.bez);
  temp.toCharArray(timer.bez, len);
  switch(timer.timer_program_type){
    case DAILY:
      for(int i=0;i<7;i++)timer.weekdays[i]=0;
      timer.time_on = doc["time_on"];
      timer.time_off = doc["time_off"];
      timer.hysteresis=doc["hysteresis"];
    break;
    case WEEKDAYS:
      for(int i=0;i<7;i++)timer.weekdays[i] = doc["weekdays"][i];
      timer.time_on = doc["time_on"];
      timer.time_off = doc["time_off"];
      timer.hysteresis=doc["hysteresis"];
    break;
    case PER_REQUEST:
      for(int i=0;i<7;i++)timer.weekdays[i]=0;
      timer.time_on = -1;
      timer.time_off = -1;
      timer.hysteresis = -1;
    break;
  }

  timer.temperature_off=doc["temperature_off"];
  timer.tempmeasurementtype=doc["tempsensor"];
  timer.active = doc["active"];
  
  if(id==-1){
    writeTimers(timer);
    id=timer.id;
    publishLogMessage(C_LOGFILE | C_WS | C_MQTT | C_WS_STATUS | C_WS_TIMER | C_WS_LOG, NULL, id, RC_OK, TIMER_HEAT_ADDED, (String(id)+"|"+timer.bez).c_str());
  }else{
    timers[pos] = timer;
    writeTimers();
    publishLogMessage(C_LOGFILE | C_WS | C_MQTT | C_WS_STATUS | C_WS_TIMER | C_WS_LOG, NULL, id, RC_OK, TIMER_HEAT_CHANGED, (String(id)+"|"+timer.bez).c_str());
  } 
  return id;
}

int processSPumpFromJson(JsonDocument doc){
  RelaisTimer timer;
  int id=doc["id"];
  int pos=-1;
  if(id!=-1){
    pos = getTimerPosFromId(id);
    if(pos==-1) id=-1;
  }
  if(id==-1){
    timer = initNewTimer(GPIO_SOLAR_PUMP, doc["relais"]);
  }else{
    timer = timers[pos];
  }
  String temp = doc["bez"];
  int len = temp.length()+1;
  if(len > sizeof(timer.bez))len=sizeof(timer.bez);
  temp.toCharArray(timer.bez, len);  
  timer.running_period=doc["running_period"];
  timer.waiting_period=doc["waiting_period"];
  timer.temperature_on=doc["temperature_on"];
  timer.temperature_off=doc["temperature_off"];
  timer.temperature_difference=doc["temperature_difference"];
  timer.tempmeasurementtype=doc["tempsensor"];
  timer.active = doc["active"];
  if(id==-1){
    writeTimers(timer);
    id=timer.id;
    publishLogMessage(C_LOGFILE | C_WS | C_MQTT | C_WS_STATUS | C_WS_TIMER | C_WS_LOG, NULL, id, RC_OK, TIMER_SPUMP_ADDED, (String(id)+"|"+timer.bez).c_str());
  }else{
    timers[pos] = timer;
    writeTimers();
    publishLogMessage(C_LOGFILE | C_WS | C_MQTT | C_WS_STATUS | C_WS_TIMER | C_WS_LOG, NULL, id, RC_OK, TIMER_SPUMP_CHANGED, (String(id)+"|"+timer.bez).c_str());
  }
  return id;
}

int numberOfTimers(){
  if(!runtime.sdready) return 0;
  File file = SD.open("/timers.bin", FILE_READ);
  if(!file) return 0;
  int rc=0;
  size_t bytesRead;
  RelaisTimer relstruct; 
  while(file.available()){
    bytesRead = file.read((byte *)&relstruct, sizeof(relstruct));
    rc++;
  }
  file.close();
  return rc;
}

int lastTimerID(){
  if(!runtime.sdready) return -1;
  File file = SD.open("/timers.bin", FILE_READ);
  if(!file){
    return -1;
  } 
  int rc=0;
  size_t bytesRead;
  RelaisTimer relstruct; 
  while(file.available()){
    bytesRead = file.read((byte *)&relstruct, sizeof(relstruct));
    rc++;
  }
  file.close();
  if(rc>0){
    rc = relstruct.id;
  }
  return rc;
}

int getTimerPosFromId(int id){
  if(runtime.nbTimers==0 || timers==NULL) return -1;
  for(int i=0;i<runtime.nbTimers;i++){
    if(timers[i].id==id) return i;
  }
  return -1;
}

int getActiveTimerByRelaisType(RelaisType relaistype){
  if(!hasActiveRelaisType(relaistype)) return -1;
  for(int i=0;i<runtime.nbTimers;i++){
    if(timers[i].relaistype == relaistype && timers[i].timerstatetype != OFF){
      return timers[i].id;
    }
  }
  return -1;
}

int getNumberOfActiveTimers(){
  int rc=0;
  for(int i=0;i<runtime.nbTimers;i++){
    if(isRelaisTimerActive(timers[i].id)) rc++;
  }
  return rc;
}

bool isRelaisTimerActive(int id){
  int i = getTimerPosFromId(id);
  if(i==-1) return false;
  if(timers[i].id == id && timers[i].timerstatetype != OFF) return true;
  return false;
}

bool hasActiveRelaisType(RelaisType relaisType){
  for(int i=0;i<runtime.nbTimers;i++){
    if(timers[i].timerstatetype != OFF && timers[i].relaistype == relaisType) return true;
  }
  return false;
}

bool startRelaisTimer(int id){
  int i = getTimerPosFromId(id);
  if(i==-1) return false;
  if(!hasActiveRelaisType(timers[i].relaistype) && timers[i].timerstatetype == OFF && timers[i].active && !isTemperatureReached(timers[i])){
    timers[i].timerstatetype = ON;
    timers[i].runnings++;
    timers[i].datestamp = dateStamp();
    timers[i].timestamp = timeStamp();
    timers[i].laststartdate = timers[i].datestamp;
    timers[i].laststarttime = timers[i].timestamp;

    timers[i].nextstoptime = timeStamp(timers[i].running_period/1000);
    if(!digitalRead(timers[i].gpiopin)){
      digitalWrite(timers[i].gpiopin, HIGH);
      writeTimers();
      publishLogMessage(C_LOGFILE | C_MQTT | C_WS | C_WS_STATUS | C_WS_TIMER | C_WS_LOG | C_WS_TEMPERATURE, NULL, id, RC_OK, TIMER_STARTED, (String(id)+"|"+timers[i].bez).c_str());
    }
    return true;
  } 
  return false;
}

bool stopRelaisTimer(int id){
  int i = getTimerPosFromId(id);
  if(i==-1 || !isRelaisTimerActive(id)) return false;

  timers[i].timerstatetype = OFF;
  timers[i].datestamp = dateStamp();
  timers[i].timestamp = timeStamp();

  if(digitalRead(timers[i].gpiopin)){
    digitalWrite(timers[i].gpiopin, LOW);
  }
  writeTimers();
  publishLogMessage(C_LOGFILE | C_MQTT | C_WS | C_WS_STATUS | C_WS_TIMER | C_WS_LOG | C_WS_TEMPERATURE, NULL, id, RC_OK, TIMER_STOPPED, (String(id)+"|"+timers[i].bez).c_str());
  return true;
}

void waitRelaisTimer(int id){
  int i = getTimerPosFromId(id);
  if(i==-1) return;
  timers[i].waitings++;
  timers[i].timerstatetype = WAIT;
  timers[i].datestamp = dateStamp();
  timers[i].timestamp = timeStamp();

  timers[i].nextstarttemp = (timers[i].temperature_off -timers[i].hysteresis);
  timers[i].nextstarttime = timeStamp(timers[i].waiting_period/1000);

  if(digitalRead(timers[i].gpiopin)){
    digitalWrite(timers[i].gpiopin, LOW);
  }
  publishLogMessage(C_WS | C_WS_STATUS | C_WS_TIMER | C_WS_TEMPERATURE , NULL, -1, RC_OK, NOCODE, NULL);
  return;
}

void restartRelaisTimer(int id){
  int i = getTimerPosFromId(id);
  if(i!=-1 && hasActiveRelaisType(timers[i].relaistype) && timers[i].timerstatetype == WAIT && timers[i].active && !isTemperatureReached(timers[i])){
    timers[i].timerstatetype = ON;
    timers[i].runnings++;
    timers[i].datestamp = dateStamp();
    timers[i].timestamp = timeStamp();

    timers[i].laststartdate = timers[i].datestamp;
    timers[i].laststarttime = timers[i].timestamp;

    timers[i].nextstoptime = timeStamp(timers[i].running_period/1000);

    if(!digitalRead(timers[i].gpiopin)){
      digitalWrite(timers[i].gpiopin, HIGH);
    }
    publishLogMessage(C_WS | C_WS_STATUS | C_WS_TIMER | C_WS_TEMPERATURE , NULL, -1, RC_OK, NOCODE, NULL);
  } 
  return;
}

void readTimers(){
  if(!runtime.sdready) return;
  RelaisTimer relstruct;
  File file = SD.open("/timers.bin", FILE_READ);
  if(!file) return;
  for(int i=0;i<runtime.nbTimers;i++){
    const size_t bytesRead = file.read((byte *)&relstruct, sizeof(relstruct));
    timers[i] = relstruct;
  }
  file.close();
}

bool writeTimers(){
  return writeTimers(initNewTimer(-1, HEAT));
}

bool writeTimers(RelaisTimer timerToAdd){
  if(!runtime.sdready) return false;
  File file = SD.open("/timers.bin", FILE_WRITE);
  if(!file){
    return false;
  } 

  if(runtime.nbTimers>0){
    if(backuptimers!=NULL) free(backuptimers);
    backuptimers = (RelaisTimer*)malloc(runtime.nbTimers * sizeof(RelaisTimer));
  }
  
  int j=0;
  for(int i=0;i<runtime.nbTimers;i++){
    if(timers[i].time_on==-1 && timers[i].time_off==-1 && timers[i].temperature_off==-1 && timers[i].temperature_on==-1){
      if(isRelaisTimerActive(timers[i].id)){
        stopRelaisTimer(timers[i].id);
      }
      publishLogMessage(C_LOGFILE | C_MQTT, NULL, timers[i].id, RC_OK, TIMER_DELETED,  (String(timers[i].id)+"|"+timers[i].bez +"|" + timers[i].relaistype).c_str());
    }else{
      if(timers[i].timerstatetype != OFF && timers[i].active == false){
        stopRelaisTimer(timers[i].id);
      }
      backuptimers[j++] = timers[i];
      clearRelaisTimerRunningValues(&timers[i], 0);
      file.write((byte *)&timers[i], sizeof(timers[i]));  
    }
  }
  if(timerToAdd.gpiopin!=-1){
    if(timerToAdd.time_on!=-1 || timerToAdd.time_off!=-1 || timerToAdd.temperature_off!=-1 || timerToAdd.temperature_on!=-1){
      file.write((byte *)&timerToAdd, sizeof(timerToAdd));  
    }
  }

  file.flush();
  file.close();
  reloadTimers();

  // MergeTimers
  for(int i=0;i<runtime.nbTimers;i++){
    for(int k=0;k<j;k++){
      if(backuptimers[k].id == timers[i].id){
        timers[i].timerstatetype = backuptimers[k].timerstatetype;
        timers[i].timestamp = backuptimers[k].timestamp;
        timers[i].datestamp = backuptimers[k].datestamp;
        timers[i].nextstarttime = backuptimers[k].nextstarttime;
        timers[i].nextstoptime = backuptimers[k].nextstoptime;
        timers[i].nextstarttemp = backuptimers[k].nextstarttemp;
        timers[i].nextstoptemp = backuptimers[k].nextstoptemp;
        timers[i].laststartdate = backuptimers[k].laststartdate;
        timers[i].laststarttime = backuptimers[k].laststarttime;
      }
    }
  }
  return true;
}

void printRelaisTimer(RelaisTimer timer){
  Serial.print("id:");
  Serial.println(timer.id);
  Serial.print("bez:");
  Serial.println(timer.bez);
  Serial.print("gpio:");
  Serial.println(timer.gpiopin);
  Serial.print("RelaisType:");
  Serial.println(timer.relaistype);
  Serial.print("TempMeasureType:");
  Serial.println(timer.tempmeasurementtype);
  Serial.print("Active:");
  Serial.println(timer.active);
  //Serial.print("RelaisState:");
  //Serial.println(timer.relaisstate);
  Serial.print("starttime:");
  Serial.println(timer.time_on);
  Serial.print("endtime:");
  Serial.println(timer.time_off);
  Serial.print("weekdays:");
  for(int i=0;i<7;i++)Serial.print(timer.weekdays[i]);
  Serial.println();
  Serial.print("Running Period:");
  Serial.println(timer.running_period);
  Serial.print("Waiting Period:");
  Serial.println(timer.waiting_period);
  Serial.print("temperature_on:");
  Serial.println(timer.temperature_on);
  Serial.print("temperature_off:");
  Serial.println(timer.temperature_off);
  Serial.print("timer_program:");
  Serial.println(timer.timer_program_type);
  Serial.print("temperature_difference:");
  Serial.println(timer.temperature_difference);
  Serial.print("hysteresis:");
  Serial.println(timer.hysteresis);
 
  Serial.print("timerstatetype:");
  Serial.println(timer.timerstatetype);
  Serial.print("timestamp:");
  Serial.println(timer.timestamp);
  Serial.print("runtime:");
  Serial.println(timer.runtime);
  Serial.print("waittime:");
  Serial.println(timer.waittime);
  Serial.print("runnings:");
  Serial.println(timer.runnings);
  Serial.print("nextstarttime:");
  Serial.println(timer.nextstarttime);
  Serial.print("nextstoptime:");
  Serial.println(timer.nextstoptime);
  Serial.print("nextstarttemp:");
  Serial.println(timer.nextstarttemp);
  Serial.print("nextstoptemp:");
  Serial.println(timer.nextstoptemp);

  Serial.println("-------");
}

void purgeAllTimers(){
  if(!runtime.sdready) return;
  
  for(int i=0;i<runtime.nbTimers;i++){
    if(isRelaisTimerActive(timers[i].id)){
      stopRelaisTimer(timers[i].id);
    }
  }
  if(SD.remove("/timers.bin")){
    publishLogMessage(C_LOGFILE, NULL, -1, RC_OK, TIMERS_REMOVED,  NULL);
  } else {
    publishLogMessage(C_LOGFILE, NULL, -1, RC_ERROR, TIMERS_NOT_REMOVED,  NULL);
  }
  reloadTimers();
  publishLogMessage(C_WS | C_MQTT | C_WS_STATUS | C_WS_TIMER | C_WS_LOG , NULL, -1, RC_OK, NOCODE, NULL);
}

void clearRelaisTimerRunningValues(RelaisTimer *relaistimer, int value){
  relaistimer->timerstatetype = OFF;
  relaistimer->datestamp = value;
  relaistimer->timestamp = value;
  relaistimer->nextstarttime = value;
  relaistimer->nextstoptime = value;
  relaistimer->nextstarttemp = value;
  relaistimer->nextstoptemp = value;
}

void processTimers(){
  for(int i=0;i<runtime.nbTimers;i++){
    RelaisTimer relaistimer = timers[i];
    if(relaistimer.timerstatetype==OFF && !hasActiveRelaisType(relaistimer.relaistype) && relaistimer.active){
      switch(relaistimer.relaistype){
        case HEAT: 
          if(relaistimer.timer_program_type != PER_REQUEST && mustHeatStart(relaistimer)) startRelaisTimer(relaistimer.id);
          break;
        case SPUMP:
          if(mustSPumpStart(relaistimer)) startRelaisTimer(relaistimer.id);
          break;
      }
    }else if(relaistimer.timerstatetype==ON ){
      switch(relaistimer.relaistype){
        case HEAT: 
          switch(relaistimer.timer_program_type){
            case PER_REQUEST: 
              if(mustHeatStop(relaistimer)) stopRelaisTimer(relaistimer.id);
              break;
            case DAILY:
            case WEEKDAYS:
              if(mustHeatWait(relaistimer)) waitRelaisTimer(relaistimer.id);
              else if(mustHeatStop(relaistimer)) stopRelaisTimer(relaistimer.id);
              break;
          }
          break;
        case SPUMP:
          if(mustSPumpStop(relaistimer)) stopRelaisTimer(relaistimer.id);
          else if(mustSPumpWait(relaistimer)) waitRelaisTimer(relaistimer.id);
          break;
      }
    }else if(relaistimer.timerstatetype==WAIT ){
      switch(relaistimer.relaistype){
        case HEAT: 
          switch(relaistimer.timer_program_type){
            case PER_REQUEST: 
              stopRelaisTimer(relaistimer.id);
              break;
            case DAILY:
            case WEEKDAYS:
              if(mustHeatResume(relaistimer)) restartRelaisTimer(relaistimer.id);
              else if(mustHeatStop(relaistimer)) stopRelaisTimer(relaistimer.id);
              break;
          }
          break;
        case SPUMP:
          if(mustSPumpResume(relaistimer)) restartRelaisTimer(relaistimer.id);
          else if(mustSPumpStop(relaistimer)) stopRelaisTimer(relaistimer.id);
          
          break;
      }
    }
  }
}

void stopAllTimers(){
  
  for(int i=0;i<runtime.nbTimers;i++){
    stopRelaisTimer(timers[i].id);
  }
  digitalWrite(GPIO_HEAT, LOW);
  digitalWrite(GPIO_SOLAR_PUMP, LOW);

}

bool mustHeatStop(RelaisTimer relaistimer){

  int actdatestamp = dateStamp();
  int acttimestamp = timeStamp();
  bool tempreached = isTemperatureReached(relaistimer);

  if(relaistimer.timerstatetype != WAIT && tempreached) return true;
  if(relaistimer.time_off !=-1 && acttimestamp >= relaistimer.time_off) return true;
  if(acttimestamp <= relaistimer.time_on) return true;

  if(relaistimer.timer_program_type == WEEKDAYS){
    int dayofweek = dayOfWeek();
    if(dayofweek<=0 || dayofweek >7 || relaistimer.weekdays[dayofweek-1] == 0) return true;
  }
  return false;
}

bool mustHeatStart(RelaisTimer relaistimer){
  int actdatestamp = dateStamp();
  int acttimestamp = timeStamp();
  bool tempreached = isTemperatureReached(relaistimer);
  if(isTemperatureReached(relaistimer)) return false;
  if(relaistimer.laststartdate == actdatestamp) return false;

  if(acttimestamp < relaistimer.time_on) return false;
  if(acttimestamp > relaistimer.time_off && relaistimer.time_off != -1 ) return false;

  if(relaistimer.timer_program_type == WEEKDAYS){
    int dayofweek = dayOfWeek();
    if(dayofweek<=0 || dayofweek >7) return false;
    if(relaistimer.weekdays[dayofweek-1] == 0) return false;
  }
  return true;

}

bool mustHeatWait(RelaisTimer relaistimer){
  int actdatestamp = dateStamp();
  int acttimestamp = timeStamp();
  bool tempreached = isTemperatureReached(relaistimer);

  if(relaistimer.hysteresis<=0) return false;
  if(relaistimer.time_off == -1) return false;
  if(!tempreached) return false;

  return true;
}

bool mustHeatResume(RelaisTimer relaistimer){
  int actdatestamp = dateStamp();
  int acttimestamp = timeStamp();
  bool tempreached = isTemperatureReached(relaistimer);

  if(relaistimer.hysteresis<=0) return true;
  if(relaistimer.time_off == -1) return true;

  double temperature = getTemperatureByTempmeasurementtype(relaistimer.tempmeasurementtype);
  if(relaistimer.nextstarttemp >= temperature){
    return true;
  } 
  return false;
}

bool mustSPumpStop(RelaisTimer relaistimer){
  double koltemp = getTemperatureByTempmeasurementtype(KOL1);
  if(koltemp >= config.maxtemperature) return true;
  //double koltemp = getAvgTemperatureByTempmeasurementtype(KOL1);
  double temperature=calcTemperatureByTempmeasurementtype(relaistimer.tempmeasurementtype);
  bool tempreached = isTemperatureReached(relaistimer);
  if(koltemp<=temperature) return true;
  if(!tempreached) return false;

  return true;
}

bool mustSPumpStart(RelaisTimer relaistimer){

  double koltemp = getTemperatureByTempmeasurementtype(KOL1);
  //double koltemp = getAvgTemperatureByTempmeasurementtype(KOL1);
  if(koltemp < relaistimer.temperature_on) return false;
  if(koltemp >= config.maxtemperature) return false;

  double temperature=calcTemperatureByTempmeasurementtype(relaistimer.tempmeasurementtype);
  if(koltemp-temperature < relaistimer.temperature_difference) return false;
  
  bool tempreached = isTemperatureReached(relaistimer);
  if(tempreached) return false;
  return true;
}

bool mustSPumpWait(RelaisTimer relaistimer){
  int acttimestamp = timeStamp();
  if(acttimestamp > relaistimer.nextstoptime) return true;
  return false;
}

bool mustSPumpResume(RelaisTimer relaistimer){
  int acttimestamp = timeStamp();
  double koltemp = getTemperatureByTempmeasurementtype(KOL1);
  //double koltemp = getAvgTemperatureByTempmeasurementtype(KOL1);
  double temperature=calcTemperatureByTempmeasurementtype(relaistimer.tempmeasurementtype);

  if(acttimestamp < relaistimer.nextstarttime) return false;
  if(koltemp-temperature < relaistimer.temperature_difference) return false;

  return true;
}




