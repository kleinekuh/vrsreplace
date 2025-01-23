
void initTempsensorLog(){
  readHourlyTemperatureLog(true);
}


void readHourlyTemperatureLog(bool withYesterday){
  if(!runtime.sdready) return;
  String datum = String(dateStamp());

  String fileName = String(config.logPath) + "/" + datum +"_small.csv";
  String fileNameBac = String(config.logPath) + "/" + datum +"_small_bac.csv";
  if(SD.exists(fileNameBac)){
    fileName = fileNameBac;
  }
  
  if(SD.exists(fileName)){
    File file = SD.open(fileName, FILE_READ);
    int i=0;
    while (file.available()) {
      String line = file.readStringUntil('\n');
      int x=0;      
      for(int j=1;j<25;j++){
        temperatureperhours[i].TaMax[x] = getValue(line, ',', j).toDouble();
        x++;
      }
      x=0;
      for(int j=25;j<49;j++){
        temperatureperhours[i].TaMin[x] = getValue(line, ',', j).toDouble();
        x++;
      } 
      i++;
    }
    file.close();
  } 

  if(withYesterday){
    String fileNameY = String(config.logPath) + "/" + String(dateStampYesterday()) +"_small.csv";
    if(SD.exists(fileNameY)){
      File file = SD.open(fileNameY, FILE_READ);
      int i=0;
      while (file.available()) {
        String line = file.readStringUntil('\n');
        int x=0;      
        for(int j=1;j<25;j++){
          temperatureperhours[i].TaMaxY[x] = getValue(line, ',', j).toDouble();
          x++;
        }
        x=0;
        for(int j=25;j<49;j++){
          temperatureperhours[i].TaMinY[x] = getValue(line, ',', j).toDouble();
          x++;
        } 
        i++;
      }
      file.close();
    }    
  }



}


void readHourlyTemperatureLog_Bac(){
  char datebuf[9];
  char timebuf[7];
  if(!runtime.sdready) return;
  getDateTime(datebuf, timebuf);
  String fileName = String(config.logPath) + "/" + String(datebuf) +"_small.csv";
  String fileNameBac = String(config.logPath) + "/" + String(datebuf) +"_small_bac.csv";
  if(SD.exists(fileNameBac)){
    fileName = fileNameBac;
  }
  
  if(SD.exists(fileName)){
    File file = SD.open(fileName, FILE_READ);
    int i=0;
    while (file.available()) {
      String line = file.readStringUntil('\n');
      int x=0;      
      for(int j=1;j<25;j++){
        temperatureperhours[i].TaMax[x] = getValue(line, ',', j).toDouble();
        x++;
      }
      x=0;
      for(int j=25;j<49;j++){
        temperatureperhours[i].TaMin[x] = getValue(line, ',', j).toDouble();
        x++;
      } 
      i++;
    }
    file.close();
  } 

}




void writeHourlyTemperatureLog(){
  
  char datebuf[9];
  char timebuf[7];
  if(!runtime.sdready) return;
  getDateTime(datebuf, timebuf);
  String fileName = String(config.logPath) + "/" + String(datebuf) +"_small.csv";
  String fileNameBac = String(config.logPath) + "/" + String(datebuf) +"_small_bac.csv";
  if(SD.exists(fileNameBac)){
    SD.remove(fileNameBac);  
  }
  if(SD.exists(fileName)){
    SD.rename(fileName, fileNameBac);
  } 
  File file = SD.open(fileName, FILE_WRITE);
  if(!file){
    DEBUG_F("writeHourlyTemperatureLog TemperatureLogFile not ready %s\n", fileName);
    return;
  }

  for(int i=0;i<3;i++){
    file.printf("%d", i);
    // TaMax
    for(int j=0;j<24;j++){
      file.printf(",%f", temperatureperhours[i].TaMax[j]);
    }
    // TaMin
    for(int j=0;j<24;j++){
      file.printf(",%f", temperatureperhours[i].TaMin[j]);
    }
    file.printf("\n");
  }

  file.flush();
  file.close();
  if(SD.exists(fileNameBac)){
    SD.remove(fileNameBac);  
  }


}

void writeTemperatureLog(){

  char datebuf[9];
  char timebuf[7];
  //if(!checkSD()) return;
  if(!runtime.sdready) return;
  getDateTime(datebuf, timebuf);
  String fileName = String(config.logPath) + "/" + String(datebuf) +"_full.csv";
  File file = SD.open(fileName, FILE_APPEND);
  if(!file){
    DEBUG_F("writeTemperatureLog TemperatureLogFile not ready %s\n", fileName);
    return;
  }

  int idH = getActiveTimerByRelaisType(HEAT);
  int idS = getActiveTimerByRelaisType(SPUMP);
  int idC = getActiveTimerByRelaisType(CPUMP);


  for(int i=0;i<3;i++){
    file.printf("%d,%s,", atoi(datebuf), timebuf);
    file.printf("%d,%d,%d,", idH, idS, idC);
    file.printf("%s,", temperaturesensors[i].bez);
    file.printf("%d,", temperaturesensors[i].deviceId);
    file.printf("%f,%f,%f\n", temperaturesensors[i].Ta, temperaturesensors[i].TaMax, temperaturesensors[i].TaMin);
  }
  file.flush();
  file.close();

}