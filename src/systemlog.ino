
unsigned long long szstatuslog = sizeof(StatusLog);


void initSystemLog(){
  runtime.lastLogId = getLastLogId();
  runtime.lastLogId++;
}

void writeLogStatus(String fileName, LogStatusCode code, PrioCode priocode, const char* message){
  char datebuf[9];
  char timebuf[7];

  if(!checkSD()) return;
  getDateTime(datebuf, timebuf);
  File file = SD.open(fileName, FILE_APPEND);
  if(!file){
    DEBUG_F("LogFile not ready %s\n", fileName);
    return;
  }

  StatusLog logstatus;
  logstatus.id = runtime.lastLogId++;
  logstatus.priocode = priocode;
  logstatus.date = atoi(datebuf);
  logstatus.time =  atoi(timebuf);
  logstatus.code = code;
  
  if(message!=NULL) strcpy(logstatus.message, message);
  file.write((byte *)&logstatus, sizeof(logstatus));  
  file.flush();
  file.close();
}

int getNumberOfRecords(PrioCode priocode, bool equalonly){

  File file = SD.open((String(config.logPath) + "/log.txt").c_str(), FILE_READ);
  size_t nbRecords = file.size() / szstatuslog;
  int nbofrows=0;
  if(priocode == ALL){
    nbofrows = nbRecords;
  }else{
    int counter=0;
    size_t bytesRead;
    StatusLog logstatus; 
    while(file.available()){
      counter++;
      bytesRead = file.read((byte *)&logstatus, szstatuslog);
      if((!equalonly && logstatus.priocode <= priocode) || (equalonly && logstatus.priocode == priocode )){
        nbofrows++;
      }
    }
  }
  file.close();
  return nbofrows;
}

void deleteLogFile(){
  if(!runtime.sdready) return;
  SD.remove((String(config.logPath) + "/log.txt").c_str());
  return;
}

int getLastLogId(){

  if(!runtime.sdready) return -1;
  File file = SD.open((String(config.logPath) + "/log.txt").c_str(), FILE_READ);
  if(!file) return -1;

  size_t nbRecords = file.size() / szstatuslog;
  file.seek((nbRecords - 1) * szstatuslog);

  size_t bytesRead;
  StatusLog logStatus; 
  int rc=0;
  while(file.available()){
    bytesRead = file.read((byte *)&logStatus, szstatuslog);
    rc = logStatus.id;
  }
  file.close();
  return rc;
 
}

int getRowsFromTo(StatusLog *logstatus, PrioCode priocode, int posend, int limit, bool equalonly){

  if(!runtime.sdready) return -1;
  File file = SD.open((String(config.logPath) + "/log.txt").c_str(), FILE_READ);
  if(!file) return -1;
  
  StatusLog logline;
  size_t bytesRead;
  int rc=0, i=0;
  bool stop=false;
  while(file.available() && !stop){
    bytesRead = file.read((byte *)&logline, szstatuslog);
    if((!equalonly && logline.priocode <= priocode) || (equalonly && logline.priocode == priocode )){
      logstatus[i] = logline;
      i++;
      rc++;
      if(i>=limit)i=0;
      if(rc>=posend) stop=true;
    }
  }
 
  qsort( logstatus, limit, sizeof(StatusLog), compareStatusLog );
  
  file.close();
  return i;

}

void printLogLine(StatusLog logstatus){
  DEBUG_F("\n %d %d %d %d %s", logstatus.id, logstatus.code, logstatus.date, logstatus.time, logstatus.message);
}

int compareStatusLog( const void* a, const void* b){
   StatusLog log_a = * ( (StatusLog*) a );
   StatusLog log_b = * ( (StatusLog*) b );
   return (log_a.id > log_b.id) - (log_a.id < log_b.id);
}

