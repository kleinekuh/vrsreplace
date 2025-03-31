
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
    for(int j=0;j<24;j++){
      file.printf(",%f", temperatureperhours[i].TaMax[j]);
    }
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