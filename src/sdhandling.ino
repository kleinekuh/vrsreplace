
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

void setupSDCard(){
  SPI.begin(SD_SCLK, SD_MISO, SD_MOSI, SD_CS);
  checkSD();
}

bool checkSD(){
  if(!runtime.sdmount && !runtime.sdready){
    if(!SD.begin(SD_CS)){
      runtime.sdready = false;
      runtime.sdmount = false;
    }else{
      runtime.sdready = false;
      runtime.sdmount = true;
    }
  }
  if(runtime.sdmount){
    runtime.sdCardType = SD.cardType();
    runtime.sdTotalBytes= SD.totalBytes();
    if(runtime.sdCardType == CARD_NONE || (runtime.sdTotalBytes==0)){
      runtime.sdready = false;
    }else if(!runtime.sdready){
      runtime.sdready = true;
    }
  }
  return runtime.sdready;
}

int getNumberOfLutEntries(const char *path) {
  if(!runtime.sdready) return -1;
  File file = SD.open(path);
  if (!file || file.isDirectory()) {
    publishLogMessage(C_LOGFILE, NULL, -1, RC_ERROR, NO_LUT_FILE,  path);
    return -1;
  }

  int i=0;
  while (file.available()) {
    file.readStringUntil('\n');
    i++;
  }
  file.close();
  return i;
}

void readLutFileToIntArray(const char *path, int* iarray) {
  if(!runtime.sdready) return;
  File file = SD.open(path);
  if (!file || file.isDirectory()) {
    publishLogMessage(C_LOGFILE, NULL, -1, RC_ERROR, NO_LUT_FILE,  path);
    return;
  }
  DEBUG_F("\nreadLutFileToIntArray %s", path);

  int i=0;
  while (file.available()) {
    String line = file.readStringUntil('\n');
    iarray[i]=line.toInt();
    i++;
  }
  file.close();
}

void reloadConfig(){
  if (!checkSD()) {
    return;
  }

  if(!runtime.sdready){
    return;
  }
  readConfig();
}

void readConfig(){
  if(!runtime.sdready) return;
  File file = SD.open("/config.bin", FILE_READ);
  if(!file) return;
  const size_t bytesRead = file.read((byte *)&config, sizeof(VRSReplaceConfig));
  file.close();
}

bool writeConfig(){
  if(!runtime.sdready) return false;
  const char* configFile = "/config.bin";
  if(SD.exists(configFile)){
    SD.remove(configFile);
  }

  File file = SD.open(configFile, FILE_WRITE);
  if(!file) return false;
  file.write((byte *)&config, sizeof(VRSReplaceConfig)); 
  file.close();
  return true;
}  

