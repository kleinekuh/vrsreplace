
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

bool metricsTemplate(Print &output, const char *param){

  if(strcmp(param, "NAME") == 0) output.print(config.dnsname);
  else if(strcmp(param, "VERSION") == 0) output.print(VRS_VERSION);
  else if(strcmp(param, "ARCH") == 0) output.print(ESP.getChipModel());
  else if(strcmp(param, "MAC") == 0) output.print(WiFi.macAddress().c_str());

  else if(strcmp(param, "UPTIME") == 0) output.print((double)esp_timer_get_time() / 1000000, 0);
  
  else if(strcmp(param, "HEAP") == 0) output.print((long)ESP.getHeapSize());
  else if(strcmp(param, "FREEHEAP") == 0) output.print((long)ESP.getFreeHeap());
  else if(strcmp(param, "MAXHEAP") == 0) output.print((long)ESP.getMaxAllocHeap());
  else if(strcmp(param, "MINHEAP") == 0) output.print((long)ESP.getMinFreeHeap());
  
  else if(strcmp(param, "RSSI") == 0) output.print((long)WiFi.RSSI());
  else if(strcmp(param, "BSSID") == 0) output.print(WiFi.BSSIDstr().c_str());
  
  else return false;
  return true;
}


esp_err_t metrics(int internal_page_size, const uint8_t* internal_page, PP_HTTP_TYPE http_type, PP_PAGE_TYPE page_type, PsychicRequest* request){
  DEBUG_F("\nmetrics");
  
  String ct = "text/plain";
  PsychicStreamResponse response(request, ct);
  response.beginSend();

  TemplatePrinter printer(response, metricsTemplate);
  
  printer.print("# HELP vrsreplace_info Informations about the running VRS Replace system\n");
  printer.print("# TYPE vrsreplace_info gauge\n");
  printer.print("vrsreplace_info{name=\"%NAME%\",arch=\"%ARCH%\",mac=\"%MAC%\",version=\"%VERSION%\"} 1\n");

  printer.print("# HELP vrsreplace_uptime Uptime in seconds\n");
  printer.print("# TYPE vrsreplace_uptime counter\n");
  printer.print("# UNIT seconds\n");
  printer.print("vrsreplace_uptime %UPTIME%\n");
  
  printer.print("# HELP vrsreplace_heap_size System memory size\n");
  printer.print("# TYPE vrsreplace_heap_size gauge\n");
  printer.print("vrsreplace_heap_size %HEAP%\n");

  printer.print("# HELP vrsreplace_free_heap_size System free memory\n");
  printer.print("# TYPE vrsreplace_free_heap_size gauge\n");
  printer.print("vrsreplace_free_heap_size %FREEHEAP%\n");
  
  printer.print("# HELP vrsreplace__biggest_heap_block Biggest free heap block\n");
  printer.print("# TYPE vrsreplace_biggest_heap_block gauge\n");
  printer.print("vrsreplace_biggest_heap_block %MAXHEAP%\n");

  printer.print("# HELP %NAME%_heap_min_free Minimum free memory since boot\n");
  printer.print("# TYPE %NAME%_heap_min_free gauge\n");
  printer.print("vrsreplace_heap_min_free %MINHEAP%\n");

  printer.print("# HELP %NAME%_wifi_rssi WiFi RSSI\n");
  printer.print("# TYPE %NAME%_wifi_rssi gauge\n");
  printer.print("vrsreplace_wifi_rssi %RSSI%\n");

  printer.print("# HELP vrsreplace_wifi_station WiFi Station info\n");
  printer.print("# TYPE vrsreplace_wifi_station gauge\n");
  printer.print("vrsreplace_wifi_station{bssid=\"%BSSID%\"} 1\n");


  printer.print("# HELP vrsreplace_temperature Actual temperature meassured from the temperature sensors\n");
  printer.print("# TYPE vrsreplace_temperature gauge\n");
  printer.print("# UNIT vrsreplace_temperature celsius\n");
  int nbOfTempSensors = getNumberOfTempsensors();
  for(int i=0;i<nbOfTempSensors;i++){
    TemperatureSensor sensor = temperaturesensors[i];
    String temp = "vrsreplace_temperature{";
    temp = temp + "bez=\"" + sensor.bez + "\"} " + sensor.Ta +"\n"; 
    printer.print(temp.c_str());
  } 


  int nbOfTimers = runtime.nbTimers;
  if(nbOfTimers>0){
    printer.print("# HELP vrsreplace_timer All timers with der actual state\n");
    printer.print("# TYPE vrsreplace_timer gauge\n");
    for(int i=0;i<nbOfTimers;i++){
      String temp = "vrsreplace_timer{";
      temp = temp + "id=\""+timers[i].id+"\",bez=\"" + timers[i].bez + "\",relaistype=\""+timers[i].relaistype+"\",timerprogam=\""+timers[i].timer_program_type+"\",tempsensor=\""+timers[i].tempmeasurementtype+"\"} " + timers[i].timerstatetype+"\n"; 
      printer.print(temp.c_str());
    }
  }
  printer.flush();
  return response.endSend();

}