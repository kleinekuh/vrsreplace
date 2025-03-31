
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

#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>

#include <PsychicHttp.h>
#include <TemplatePrinter.h>
#include <Update.h>

#include <U8g2lib.h>
#include <Wire.h>

#include "FS.h"
#include "SD.h"
#include "SPI.h"
#include "time.h"
#include "mqtt_client.h"


#include "config_html_gz.h"
#include "index_html_gz.h"
#include "main_css_gz.h"
#include "mainall_js_gz.h"
#include "timerformheating_html_gz.h"
#include "timerformsolarpump_html_gz.h"
#include "update_html_gz.h"


#define CONFIG_HTTPD_MAX_REQ_HDR_LEN 1024

#define VRS_VERSION "0.9.8"
#define CONVERSIONS_PER_PIN 100

#define GPIO_HEAT 16
#define GPIO_SOLAR_PUMP 17
#define GPIO_CIRCULATION_PUMP 18

#define SD_MOSI     23
#define SD_MISO     19
#define SD_SCLK     18
#define SD_CS       5


//#define DEBUGGING

#ifdef DEBUGGING
#define DEBUG_B(...) Serial.begin(__VA_ARGS__)
#define DEBUG_P(...) Serial.println(__VA_ARGS__)
#define DEBUG_C(...) Serial.print(__VA_ARGS__)
#define DEBUG_F(...) Serial.printf( __VA_ARGS__ )
#else
#define DEBUG_B(...)
#define DEBUG_P(...)
#define DEBUG_C(...)
#define DEBUG_F(...)
#endif

enum SystemStateType{
  INIT,
  FIRMWARE_CHANGE,
  RUNNING,
  REBOOT,
  ERROR,
  CONFIG,
  MQTT_CHANGE
};

enum PP_HTTP_TYPE{
  PP_GET,
  PP_POST,
  PP_GET_POST,
  PP_UPLOAD
};

enum PP_PAGE_TYPE{
  PP_JSON,
  PP_HTML,
  PP_HTML_GZ,
  PP_JS_GZ,
  PP_CSS_GZ
};

typedef struct{
  int temperatureSRT = 10000; // Refresh Time for TemperatureSensors
  int temperatureLWT = 10000; // Write Time for Temperature Log (large)
  int temperatureSWT = 60000; // Write Time for Temperature Log (small)
  int sensorAvgTemperatureCalcSize=10;
  int maxtemperature = 120; 
  char lutPath[25] = "/sensordata";
  char logPath[25] = "/log";
  char webServerPath[25] = "/webserver";
  char ssid[25] = "";
  char password[25] = "";
  char ntpserver[25] = "de.pool.ntp.org";
  int wificonnectionretries=10;
  bool wificonfigured=false;
  unsigned long wifireconnectinterval = 60000;
  bool allowcors = false;
  char dnsname[25] = "vrsreplace";
  bool deliverfromsd = false;
  bool mqttactive = false;
  char mqttserver[50] = "";
  unsigned long mqttsendinterval = 5000;
  char language[3] = "en";
  char timezone[50] = "4---CET-1CEST,M3.5.0,M10.5.0/3";
} VRSReplaceConfig;
VRSReplaceConfig config;

typedef struct{
  uint32_t previousSRTMillis=0;
  uint32_t previousLWTMillis=0;
  uint32_t previousSWTMillis=0;
  uint32_t previousMQTTMillis=0;

  volatile int nbTimers=0;
  volatile int lastLogId=0;
  volatile int datestamp=0;
  volatile int acthour=0;
  volatile bool sdmount=false;
  volatile bool sdready=false;
  volatile bool adc_conversion_started = false;
  volatile bool adc_coversion_done = false;
  volatile bool lutloaded=false;
  volatile bool mqttinited=false;
  volatile bool mqttactive=false;
  uint8_t sdCardType;
  uint64_t sdTotalBytes;
  unsigned long wifipreviousMillis = 0;
  int wificonnectionretries = 0;
  SystemStateType systemState = INIT;
  IPAddress actIP;
} VRSRunntime;
VRSRunntime runtime;

enum RCStatus{
  RC_OK = 1,
  RC_ERROR = 2
}; 

enum VRSensorType {
  VR10 = 1,
  VR11 = 2
};

enum RelaisType {
  HEAT = 1,
  SPUMP = 2,
  CPUMP = 3
};

enum TemperatureMeasurementType {
  TNONE = 0,
  SP1 = 1,
  SP2 = 2,
  AVG_SP1_SP2 = 3,
  KOL1 = 4
};

enum TimerProgramType {
  DAILY = 1,
  WEEKDAYS = 2,
  PER_REQUEST = 3,
  DYNAMIC = 4
};

enum TimerStateType {
  ON = 1,
  OFF = 2,
  WAIT = 3,
};


enum LogStatusCode{

  NOCODE = 0,

  SETUP_START = 100,
  NEW_DAY = 101,
  SYSTEM_ERROR = 110,
  SYSTEM_RESTARTED = 111,
  SYSTEM_NTP_REFRESHED = 112,
  SYSTEM_FIRMWARE_CHANGED = 113,
  SYSTEM_FIRMWARE_ERROR = 114,

  SYSTEM_ADC_DEINIT_OK = 115,
  SYSTEM_ADC_DEINIT_ERROR = 116,

  SYSTEM_CONFIG_CHANGED = 117,
  SYSTEM_CONFIG_CHANGED_RESTART = 118,
  SYSTEM_CONFIG_ERASED = 119,
  SYSTEM_CONFIG_NOT_SAVED = 120,

  NO_LUT_FILE = 121,
  NO_SDCARD = 122,

  SYSTEM_NO_WIFI = 125,
  SYSTEM_RECONNECT_WIFI = 126,
  SYSTEM_WIFI_AP_CONFIG = 127,

  TEST_GPIO_NOID = 130,
  TEST_GPIO_START = 131,
  TEST_GPIO_STOP = 132,

  TIME_SET = 180,
  TIME_NOT_SET = 181,
  TIME_SET_TIMEZONE = 182,

  TIMER_STARTED =	200,
  TIMER_STOPPED =	201,
  TIMER_WAIT = 202,
  TIMER_RESUME = 203,
  TIMERS_REMOVED =204,
  TIMERS_NOT_REMOVED = 205,
  TIMER_DELETED = 206,
  TIMER_HEAT_ADDED = 207,
  TIMER_SPUMP_ADDED = 208,
  TIMER_CPUMP_ADDED = 209,
  TIMER_HEAT_CHANGED = 210,
  TIMER_SPUMP_CHANGED = 211,
  TIMER_CPUMP_CHANGED = 212,
  
  WS_START_TIMER_NO_ID =	300,
  WS_START_TIMER_ID_NOT_FOUND =	301,
  WS_START_TIMER_ID_STARTED =	302,
  WS_START_TIMER_RELAIS_STARTED =	303,
  WS_START_TIMER_DEACTIVATED = 304,
  WS_START_TIMER_OK =	305,
  WS_STOP_TIMER_NO_ID =	306,
  WS_STOP_TIMER_OK = 307,
  WS_STOP_TIMER_NOT_RUNNING =	308,
  WS_TIMERS_DELETE_NO_ID = 309,
  WS_TIMERS_DELETE_GENERAL_ERROR = 310,
  WS_TIMERS_DELETE_OK =	311,
  WS_GET_TIMER_NO_ID = 312,
  WS_GET_TIMER_ID_NOT_FOUND = 313,
  WS_CHANGE_TIMER_NO_TIMER = 314,
  WS_CHANGE_TIMER_GENERAL_ERROR = 315,
  WS_CHANGE_TIMER_ADDED = 316,
  WS_CHANGE_TIMER_CHANGED = 317,

  WS_CLIENT_CONNECTED	= 340,
  WS_CLIENT_DISCONNECTED = 341,

  WS_FIRMWARE_UPDATE_START = 350,
  WS_FIRMWARE_UPDATE_ERROR = 351,
  WS_FIRMWARE_UPDATE_OK = 352,

  WS_CHANGE_SETUP_ERROR = 360,
  WS_CHANGE_SETUP_NO_CONFIG = 361,

  MQTT_STARTED = 370,
  MQTT_STOPPED = 371,
  MQTT_ERROR = 372,
  MQTT_INIT = 373,
  MQTT_INIT_ERROR = 374

};

enum PrioCode{
  ALL = 0,
  SYSTEM = 1,
  PRIO_HIGH = 10,
  PRIO_LESS = 12,
  PRIO_LOW = 20,
};

enum MESSAGE_PUBLISH{
    C_WS              = 1U << 0U,
    C_MQTT            = 1U << 1U,
    C_LOGFILE         = 1U << 2U,
    C_HTTP            = 1U << 3U,
    C_WS_STATUS       = 1U << 4U, 
    C_WS_TIMER        = 1U << 5U, 
    C_WS_LOG          = 1U << 6U, 
    C_WS_TEMPERATURE  = 1U << 7U,
};

// Struct for Timers / Relais
typedef struct{
  int id;                                               // Internal unique ID, used for sorting and processing
  char bez[30];                                         // Given Name of this Timer
  int gpiopin;                                          // Which ESP Pin is addressed for the Relais
  RelaisType relaistype;                                // Type of the Relais (HEAT, SPUMP -> SolarPump, CPUMP -> CirculationPump / actuall not implemented )
  int time_on;                                          // Start Time Format HH24MMSS (Relaistype HEAT)
  int time_off;                                         // End Time Format HH24MMSS (Relaistype HEAT)
  int weekdays[7];                                      // Day of Week for the Timer  (Relaistype HEAT)
  int running_period;                                   // Duration (in sec) how long the Relais is HIGH (Relaistype SPUMP)
  int waiting_period;                                   // Duration (in sec) how long the Relais is LOW (Relaistype SPUMP) -> timerstatetype = WAIT
  TimerProgramType timer_program_type;                  // Timer Programtype DAILY, WEEKDAYS, PER_REQUEST, DYNAMIC (not implemented) (Relaistype HEAT)
  int temperature_on;                                   // Start Temperature HEAT
  int temperature_off;                                  // End Temperature HEAT, SPUMP
  TemperatureMeasurementType tempmeasurementtype;       // How the temperature is meassured for this Timer (SP1, SP2 or AVG)
  int temperature_difference;                           // Temperature Differece between temp sensor KOL1 and tempmeasurementtype (Relaistype SPUMP)
  int hysteresis;                                       // Hysteresis temperature for restart HEAT Timer again, if time_off not reached
  bool active;                                          // Timer Active or Inactive
  TimerStateType timerstatetype;                        // Actual running state (ON = Relais High, Off = Relais Low, Wait = Relais Low)
  int datestamp;                                        // Datestamp. Is changing in combination with timerstatetype YYYYMMSS (volatile)
  int timestamp;                                        // Timestamp. Same as datestamp HH24MMSS (volatile)
  int runtime;                                          // How many seconds the timer has operated
  int waittime;                                         // How many seconds the timer had been in wait state
  int runnings;                                         // Number of runnings
  int waitings;                                         // Number of waitings
  int laststartdate;                                    // Last startdate YYYYYMMSS
  int laststarttime;                                    // Last starttime HH24MMSS
  int nextstarttime;                                    // Timer next starttime (for spump)
  int nextstoptime;                                     // Timer next stoptime (for spump)
  double nextstarttemp;                                 // Timer next start temperature (for hysteresis)
  double nextstoptemp;                                  // Timer next stop temperature (for hysteresis)
  bool publishhomekit;                                  // Timer visible on Homekit
  int avgtempincreasepermin;                            // Average Temperature increase per min.
} RelaisTimer;


// Struct for predefined VR-Sensor Temp calculation
typedef struct {
  VRSensorType sensorType;
  double TaMin;
  double TaMax;
  int numberofvalues;
  int** values;
} VRPreValue;
VRPreValue vrprevalues[2];

// Struct for TemperatureSensor Masurement
typedef struct {
  String bez;
  int deviceId;
  int gpiopin;
  VRSensorType sensorType;
  TemperatureMeasurementType tempmeasurementtype;
  double Ta;    // Der aktuelle Temperatur Wert
  double TaAvg; // Der kalkulierte Temperatur Mittelwert
  double TaMax; // Max Wert
  double TaMin; // Min Wert
  int counter;  // Wie oft wurde der Werte bereits ermittelt, Verwendet fuer Avg
  double TaS;   // Aufsummierter Werte fuer Avg
  int* lut = (int*)malloc(4096 * sizeof(int));
} TemperatureSensor;
TemperatureSensor temperaturesensors[3];

typedef struct{
  int deviceid;
  String bez;
  double TaMax[24] = {0};
  double TaMin[24] = {0};
  double TaMaxY[24] = {0};
  double TaMinY[24] = {0};
} TemperaturePerHour;
TemperaturePerHour temperatureperhours[3];

typedef struct{
  int id;
  PrioCode priocode;
  int date;
  int time;
  LogStatusCode code;
  char message[100]={'\0'};
} StatusLog;

struct tm tm;
bool timeset=false;

const char* apssid     = "VRS-Replace";
const char* appassword = "12345678";

RelaisTimer* timers;

void setup() {

  heap_caps_malloc_extmem_enable(512);

  Serial.begin(115200);
  setupSDCard();

 
  u8g2_prepare();
  displayBoot(config.ssid, 0);

  readConfig();
  initSystemLog();
  
  WiFi.setHostname(config.dnsname);
  WiFi.setAutoReconnect(false);
  WiFi.persistent(false);
  
  if(!config.wificonfigured){
    WiFi.softAP(apssid, appassword);
    delay(500);
    runtime.actIP = WiFi.softAPIP();
    DEBUG_F("\nStarting AP Mode: %s", runtime.actIP.toString(false).c_str());
    publishLogMessage(C_LOGFILE, NULL, -1, RC_OK, SYSTEM_WIFI_AP_CONFIG, runtime.actIP.toString(false).c_str());
    runtime.systemState = CONFIG;
  }else{
    int x=0;
    WiFi.begin(config.ssid, config.password);
    while (WiFi.status() != WL_CONNECTED && x<config.wificonnectionretries) {
      delay(1000);
      x++;
      displayBoot(config.ssid, x);
      DEBUG_F("\nNo Connection: %s %d", config.ssid, x);
    }
    if(!WiFi.isConnected()){
      config.wificonfigured = false;
      writeConfig();
      delay(1000);
      runtime.systemState = CONFIG;
      ESP.restart();
      return; 
    }else{
      runtime.actIP = WiFi.localIP();
      DEBUG_F("\nStarting ST Mode: %s", runtime.actIP.toString().c_str());
      timeset = initTime();
      if(timeset)runtime.acthour = getHour();
      runtime.systemState = RUNNING;
    }
  }

  addServerFunctions();

  if(runtime.systemState==RUNNING){
    reloadTimers();
    initTemperatureSensors();
    initTempsensorLog();
    publishLogMessage(C_LOGFILE, NULL, -1, RC_OK, SETUP_START, runtime.actIP.toString(false).c_str());

    pinMode(GPIO_HEAT, OUTPUT);
    pinMode(GPIO_SOLAR_PUMP, OUTPUT);
    
    if(config.mqttactive){
      initMQTT();
      startMQTT(); 
    } 
  }

  runtime.previousSRTMillis = millis();
  runtime.previousLWTMillis = runtime.previousSRTMillis;
  runtime.previousSWTMillis = runtime.previousSRTMillis;

}

void loop() {
  unsigned long currentMillis = millis();

  
  switch(runtime.systemState){
    
    case INIT: break;
    case FIRMWARE_CHANGE: 
      if(runtime.adc_conversion_started){
        stopAllTimers();
        if(!deinitTemperatureSensors()){
          publishLogMessage(C_LOGFILE, NULL, -1, RC_ERROR, SYSTEM_ADC_DEINIT_ERROR, NULL);
        }else{
          publishLogMessage(C_LOGFILE, NULL, -1, RC_OK, SYSTEM_ADC_DEINIT_OK, NULL);
        }
      }
      stopMQTT();
    break;
    case RUNNING:
      if(runtime.datestamp==0) runtime.datestamp = dateStamp();
      else if(runtime.datestamp != dateStamp()){
        publishLogMessage(C_LOGFILE, NULL, -1, RC_OK, NEW_DAY, NULL);
        runtime.systemState = REBOOT;
        break;
      }
      if(!checkSD()){
        stopAllTimers();
      }else{
        if (runtime.adc_coversion_done == true) {
          processTemperature();
          runtime.adc_coversion_done = false;
        }
        processTimers();
        if(currentMillis - runtime.previousLWTMillis >= config.temperatureLWT){
          writeTemperatureLog();
          runtime.previousLWTMillis = currentMillis;
        }
        if(currentMillis - runtime.previousSRTMillis >= config.temperatureSRT){
          publishLogMessage(C_WS | C_WS_STATUS | C_WS_TEMPERATURE , NULL, -1, RC_OK, NOCODE, NULL);
          runtime.previousSRTMillis = currentMillis;
        }
        if(currentMillis - runtime.previousSWTMillis >= config.temperatureSWT){
          writeHourlyTemperatureLog();
          runtime.previousSWTMillis = currentMillis;
        }
        if(runtime.mqttactive && currentMillis - runtime.previousMQTTMillis >= config.mqttsendinterval){
          sendMQTTMessages();
          runtime.previousMQTTMillis = currentMillis;
        }
        displayRunning();
      }
      
    break;
    case MQTT_CHANGE:
      if(config.mqttactive){
        startMQTT();
      }else{
        stopMQTT();
      }
      DEBUG_F("\nMQTT Change %d", config.mqttactive);
      runtime.systemState = RUNNING;
    break;
    case REBOOT: 
      displayReboot();
      delay(2000);
      stopAllTimers();
      if (runtime.adc_coversion_done == true) {
          processTemperature();
      }
      writeHourlyTemperatureLog();
      writeTemperatureLog();
      deinitTemperatureSensors();
      delay(1000);
      ESP.restart();
    break;
    case ERROR: 
      displayError();
      break;
    case CONFIG: 
      displayConfig();
    break;
     
  }

  if (runtime.systemState == RUNNING)checkWifi();
  delay(1000);
}
