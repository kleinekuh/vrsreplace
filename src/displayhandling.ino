
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

U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE);

void u8g2_prepare() {
  u8g2.begin();
  u8g2.setFont(u8g2_font_helvR08_tf);
  u8g2.enableUTF8Print();
  u8g2.setFontRefHeightExtendedText();
  u8g2.setDrawColor(1);
  u8g2.setFontPosTop();
  u8g2.setFontDirection(0);
}
 
void displayRunning(){
  u8g2.clearBuffer();
  setDisplayIP();
  setDisplayTemperature();
  setDisplayTime();
  setDisplayActiveTimmer();
  u8g2.sendBuffer();
} 

void displayBoot(String connectionInfo, int tries){
  u8g2.clearBuffer();
  u8g2.drawStr(0, 0, "Starting");
  u8g2.drawStr(0, 13, connectionInfo.c_str());

  char buffer[30];
  sprintf(buffer, "%d Versuch", tries);
  u8g2.drawUTF8(0, 26, buffer);
  u8g2.sendBuffer();
}
 
void displayReboot(){
  u8g2.clearBuffer();
  u8g2.drawStr(0, 0, "Restart");
  u8g2.sendBuffer();
}

void displayConfig(){
  u8g2.clearBuffer();
  setDisplayIP();
  u8g2.drawStr(0, 13, "Setup Config");
  u8g2.sendBuffer();
}

void displayError(){
  u8g2.clearBuffer();
  setDisplayIP();
  u8g2.drawStr(0, 13, "Error");
  u8g2.sendBuffer();
}

void setDisplayIP(){
  u8g2.drawStr(0, 0, runtime.actIP.toString().c_str());
}

void setDisplayTime(){
  u8g2.drawUTF8(0, 39, getDisplayTime(getSeconds()%2));
}

void setDisplayTemperature(){
  int tempKol1 = (int)(getTemperatureByTempmeasurementtype(KOL1) + 0.5);
  int tempSp1 = (int)(getTemperatureByTempmeasurementtype(SP1) + 0.5);
  int tempSp2 = (int)(getTemperatureByTempmeasurementtype(SP2) + 0.5);
  char buffer[30];
  sprintf(buffer, "Kol1: %d °C", tempKol1);
  u8g2.drawUTF8(0, 13, buffer);
  strcpy(buffer, "");
  sprintf(buffer, "Sp1: %d °C - Sp2: %d °C", tempSp1, tempSp2);
  u8g2.drawUTF8(0, 26, buffer);
}

void setDisplayActiveTimmer(){
  if(getSeconds()%2) return;
  String timerText;
  bool heatActive = false;
  bool spumpActive = false;
  bool cpumpActive = false;
  if(hasActiveRelaisType(HEAT)){
    int idTimer = getActiveTimerByRelaisType(HEAT);
    if(idTimer != -1){
      RelaisTimer activeTimer = timers[getTimerPosFromId(idTimer)];
      heatActive = true;
      timerText = String(activeTimer.bez);
    }
    
  }
  if(hasActiveRelaisType(SPUMP)){
    int idTimer = getActiveTimerByRelaisType(SPUMP);
    if(idTimer != -1){
      RelaisTimer activeTimer = timers[getTimerPosFromId(idTimer)];
      spumpActive = true;
      if(heatActive) timerText = timerText + " - " +String(activeTimer.bez);
      else timerText = String(activeTimer.bez);
    }

  }
  if(heatActive || spumpActive) u8g2.drawStr(0, 52, timerText.c_str());
}
