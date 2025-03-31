
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

#define mqtt_system "%dnsname%"
#define mqtt_status "%dnsname%/status"
#define mqtt_lastmessage "%dnsname%/message"
#define mqtt_sensor "%dnsname%/sensor/%sensor%"
#define mqtt_timer "%dnsname%/timer/%timer%"
#define mqtt_timer_cmd "%dnsname%/timer/%timer%/cmd"

esp_mqtt_client_config_t mqtt_cfg;
esp_mqtt_client_handle_t mqtt_client;


static const int topicsLength=60;
char t_mqtt_p_system[topicsLength]="\0";
char t_mqtt_p_status[topicsLength]="\0";
char t_mqtt_p_lastmessage[topicsLength]="\0";

int t_mqtt_p_sensor_topics_size=0;
char** t_mqtt_p_sensor_topics;

int t_mqtt_p_timer_topics_size=0;
char** t_mqtt_p_timer_topics;
char** t_mqtt_p_timer_cmd_topics;

void rebuildTopics(){

  strcpy(t_mqtt_p_system, mqtt_system);
  replace_str(t_mqtt_p_system, "%dnsname%", config.dnsname, 0);

  strcpy(t_mqtt_p_status, mqtt_status);
  replace_str(t_mqtt_p_status, "%dnsname%", config.dnsname, 0);

  strcpy(t_mqtt_p_lastmessage, mqtt_lastmessage);
  replace_str(t_mqtt_p_lastmessage, "%dnsname%", config.dnsname, 0);

  rebuildSensorTopics();
  rebuildTimerTopics();
 
}

void initMQTT(){
  esp_err_t err;
  mqtt_cfg.session.keepalive = 2;
	mqtt_client = esp_mqtt_client_init (&mqtt_cfg);
  err = esp_mqtt_client_register_event(mqtt_client, (esp_mqtt_event_id_t)ESP_EVENT_ANY_ID, mqtt_event_handler, NULL);
  err = esp_mqtt_client_start(mqtt_client);
  if(err==ESP_OK){
    runtime.mqttinited = true;
    rebuildTopics();
    DEBUG_F("\ninitMQTT. Inited = %d %s\n", err, esp_err_to_name (err));
    publishLogMessage(C_WS | C_WS_STATUS | C_WS_LOG | C_LOGFILE, NULL, -1, RC_OK, MQTT_INIT, NULL);
  }else{
    DEBUG_F("\ninitMQTT. Error = %d %s\n", err, esp_err_to_name (err));
    publishLogMessage(C_WS | C_WS_STATUS | C_WS_LOG | C_LOGFILE, NULL, -1, RC_ERROR, MQTT_INIT_ERROR, esp_err_to_name (err));
  }
  
}

void rebuildSensorTopics(){
  if(t_mqtt_p_sensor_topics_size>0) free(t_mqtt_p_sensor_topics);

  t_mqtt_p_sensor_topics_size = getNumberOfTempsensors();
  t_mqtt_p_sensor_topics = (char**)malloc(t_mqtt_p_sensor_topics_size * sizeof(char*));
  for (int i = 0; i < t_mqtt_p_sensor_topics_size; i++){
    t_mqtt_p_sensor_topics[i] = (char*)malloc(topicsLength * sizeof(char));
    strcpy(t_mqtt_p_sensor_topics[i], mqtt_sensor);
    replace_str(t_mqtt_p_sensor_topics[i], "%dnsname%",  config.dnsname, 0);
    replace_str(t_mqtt_p_sensor_topics[i], "%sensor%", (char*)temperaturesensors[i].bez.c_str(), 0);
  }
}

void rebuildTimerTopics(){

  if(t_mqtt_p_timer_topics_size>0){
    if(runtime.mqttactive){
      for(int i=0;i<t_mqtt_p_timer_topics_size;i++){
         esp_mqtt_client_unsubscribe(mqtt_client, t_mqtt_p_timer_cmd_topics[i]);
      }
    }
    free(t_mqtt_p_timer_topics);  
    free(t_mqtt_p_timer_cmd_topics);  
  }
  t_mqtt_p_timer_topics_size = runtime.nbTimers;
  
  t_mqtt_p_timer_topics = (char**)malloc(t_mqtt_p_timer_topics_size * sizeof(char*));
  t_mqtt_p_timer_cmd_topics = (char**)malloc(t_mqtt_p_timer_topics_size * sizeof(char*));
  for (int i = 0; i < t_mqtt_p_timer_topics_size; i++){

    t_mqtt_p_timer_topics[i] = (char*)malloc(topicsLength * sizeof(char));
    t_mqtt_p_timer_cmd_topics[i] = (char*)malloc(topicsLength * sizeof(char));

    strcpy(t_mqtt_p_timer_topics[i], mqtt_timer);
    strcpy(t_mqtt_p_timer_cmd_topics[i], mqtt_timer_cmd);

    replace_str(t_mqtt_p_timer_topics[i], "%dnsname%",  config.dnsname, 0);
    replace_str(t_mqtt_p_timer_cmd_topics[i], "%dnsname%",  config.dnsname, 0);

    char id[5];
    itoa(timers[i].id, id, 10);
    replace_str(t_mqtt_p_timer_topics[i], "%timer%", (char*)id, 0);
    replace_str(t_mqtt_p_timer_cmd_topics[i], "%timer%", (char*)id, 0);

  }
  if(runtime.mqttactive){
    for(int i=0;i<t_mqtt_p_timer_topics_size;i++){
      esp_mqtt_client_subscribe(mqtt_client, t_mqtt_p_timer_cmd_topics[i], 0);
    }
  } 
} 

void startMQTT(){
  if(!runtime.mqttinited){
    initMQTT();
  }
  if(runtime.mqttinited){
    esp_err_t err;
    err = esp_mqtt_client_set_uri(mqtt_client, config.mqttserver);
    DEBUG_F("\nstartMQTT. Client set uri = %d %s", err, esp_err_to_name (err));
    if(err!=ESP_OK){
      publishLogMessage(C_WS | C_WS_STATUS | C_WS_LOG | C_LOGFILE, NULL, -1, RC_ERROR, MQTT_ERROR, esp_err_to_name (err));
      runtime.mqttactive = false;
      return;
    }
    err = esp_mqtt_client_start(mqtt_client);
    DEBUG_F("\nstartMQTT. Client start Error = %d %s", err, esp_err_to_name (err));
    if(err!=ESP_OK){
      publishLogMessage(C_WS | C_WS_STATUS | C_WS_LOG | C_LOGFILE, NULL, -1, RC_ERROR, MQTT_ERROR, esp_err_to_name (err));
    }else{
      publishLogMessage(C_WS | C_WS_STATUS | C_WS_LOG | C_LOGFILE, NULL, -1, RC_OK, MQTT_STARTED, config.mqttserver);
    }
  }
}

void stopMQTT(){
  if(!runtime.mqttinited) return;
  esp_err_t err;
  esp_mqtt_client_publish(mqtt_client, t_mqtt_p_system, "offline", 0, 0, 0); 
  err = esp_mqtt_client_disconnect(mqtt_client);
  err = esp_mqtt_client_stop(mqtt_client);
  runtime.mqttinited = false;
  runtime.mqttactive = false;
  DEBUG_F("\nstopMQTT. Error = %d %s", err, esp_err_to_name (err));
  if(err!=ESP_OK){
    publishLogMessage(C_WS | C_WS_STATUS | C_WS_LOG | C_LOGFILE, NULL, -1, RC_ERROR, MQTT_ERROR, esp_err_to_name (err));
  }else{
    publishLogMessage(C_WS | C_WS_STATUS | C_WS_LOG | C_LOGFILE, NULL, -1, RC_OK, MQTT_STOPPED, NULL);
  }
}

void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data){

  esp_mqtt_event_handle_t event = (esp_mqtt_event_handle_t)event_data;
  esp_mqtt_client_handle_t client = event->client;
  int msg_id;
  switch ((esp_mqtt_event_id_t)event_id) {
    case MQTT_EVENT_CONNECTED:
      DEBUG_F("\nMQTT_EVENT_CONNECTED");
      esp_mqtt_client_publish(client, t_mqtt_p_system, "online", 0, 0, 0);
      
      for(int i=0;i<t_mqtt_p_timer_topics_size;i++){
         esp_mqtt_client_subscribe(mqtt_client, t_mqtt_p_timer_cmd_topics[i], 0);
      }
      runtime.mqttactive = true;
      runtime.previousMQTTMillis = 0;
    break;
    case MQTT_EVENT_DISCONNECTED:
      DEBUG_F("\nMQTT_EVENT_DISCONNECTED");
      runtime.mqttactive = false;
    break;

    case MQTT_EVENT_SUBSCRIBED: break;
    case MQTT_EVENT_UNSUBSCRIBED: break;
    case MQTT_EVENT_PUBLISHED: break;
    case MQTT_EVENT_DATA:
      for(int i=0;i<t_mqtt_p_timer_topics_size;i++){
        if(strncmp(t_mqtt_p_timer_cmd_topics[i], event->topic, strlen(t_mqtt_p_timer_cmd_topics[i])) == 0){
          DEBUG_F("\nMQTT_EVENT_DATA");
          DEBUG_F("\nTOPIC=%.*s", event->topic_len, event->topic);
          String temp = getValue(event->topic, '/',2);
          int timerId = atoi(temp.c_str());
          char cmd[event->data_len+1] = "\0";
          strncpy(cmd, event->data, event->data_len);
          processMQTTTimerCmd(timerId, cmd);
        }
      }
    break;
    case MQTT_EVENT_ERROR:
      DEBUG_F("\nMQTT_EVENT_ERROR");
      if (event->error_handle->error_type == MQTT_ERROR_TYPE_TCP_TRANSPORT) {
        DEBUG_F("\nreported from esp-tls", event->error_handle->esp_tls_last_esp_err);
        DEBUG_F("\nreported from tls stack", event->error_handle->esp_tls_stack_err);
        DEBUG_F("\ncaptured as transport's socket errno",  event->error_handle->esp_transport_sock_errno);
        DEBUG_F("\nLast errno string (%s)", strerror(event->error_handle->esp_transport_sock_errno));
      }
    break;
    case MQTT_EVENT_BEFORE_CONNECT:
      DEBUG_F("\nMQTT_EVENT_BEFORE_CONNECT");
      setMQTTLastWill();
    break;
    default:
      DEBUG_F("\nOther event id:%d", event->event_id);
    break;
  }
}

void sendMQTTMessages(){
  sendMQTTStatus();
  sendMQTTTemperatures();
  sendMQTTTimers();
}

void sendMQTTLastMessage(const char* message){
  DEBUG_F("\nLastMessage %s", message);
  if(runtime.mqttactive) {
    esp_mqtt_client_publish(mqtt_client, t_mqtt_p_lastmessage, message, 0, 0, false);
  } 
}

void sendMQTTStatus(){
  esp_mqtt_client_publish(mqtt_client, t_mqtt_p_status, getJSONStatus().c_str(), 0, 0, false);
}
 
void sendMQTTTemperatures(){
  char temperature[7];
  for(int i=0;i<t_mqtt_p_sensor_topics_size;i++){
    sprintf(temperature, "%.2f", temperaturesensors[i].Ta);
    esp_mqtt_client_publish(mqtt_client, t_mqtt_p_sensor_topics[i], temperature, 0, 0, false);
  }
} 
 
void sendMQTTTimers(){
  for (int i = 0; i < t_mqtt_p_timer_topics_size; i++) {
    char rc[100];
    if(timers[i].active) sprintf(rc, "{\"bez\":\"%s\",\"relaistype\":%d,\"timerstatetype\":%d,\"active\":true}", timers[i].bez, timers[i].relaistype, timers[i].timerstatetype );
    else sprintf(rc, "{\"bez\":\"%s\",\"relaistype\":%d,\"timerstatetype\":%d,\"active\":false}", timers[i].bez, timers[i].relaistype, timers[i].timerstatetype );
    esp_mqtt_client_publish(mqtt_client, t_mqtt_p_timer_topics[i], (char*)rc, 0, 0, false);
  }
} 

void setMQTTLastWill(){
  esp_err_t err;
  mqtt_cfg.session.last_will.topic = t_mqtt_p_system;
  mqtt_cfg.session.last_will.msg = "offline";
  mqtt_cfg.session.last_will.msg_len = 7;
  mqtt_cfg.session.last_will.qos = 0;
  mqtt_cfg.session.last_will.retain = false;
  err = esp_mqtt_set_config(mqtt_client, &mqtt_cfg);
  DEBUG_F("\MQTT Event before connect. Error = %d %s", err, esp_err_to_name (err));
}

void processMQTTTimerCmd(int timerId, const char* cmd){
  DEBUG_F("\nprocessMQTTTimerCmd %d - %s", timerId, cmd);
  if(strcmp(cmd, "start")==0){
    DEBUG_F("\nprocessMQTTTimerCmd start");
    startRelaisTimer(timerId);
  }else if(strcmp(cmd, "stop")==0){
    DEBUG_F("\nprocessMQTTTimerCmd stop");
    stopRelaisTimer(timerId);
  }else if(strcmp(cmd, "activate")==0){
    DEBUG_F("\nprocessMQTTTimerCmd activate");
    int timerPos = getTimerPosFromId(timerId);
    if(!timers[timerPos].active){
      timers[timerPos].active = true;
      writeTimers();
      if(timers[timerPos].relaistype == HEAT){
        publishLogMessage(C_LOGFILE | C_MQTT | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER, NULL, timers[timerPos].id, RC_OK, TIMER_HEAT_CHANGED,  (String(timers[timerPos].id)+"|"+timers[timerPos].bez +"|" + timers[timerPos].relaistype).c_str());
      }else{
        publishLogMessage(C_LOGFILE | C_MQTT | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER, NULL, timers[timerPos].id, RC_OK, TIMER_SPUMP_CHANGED,  (String(timers[timerPos].id)+"|"+timers[timerPos].bez +"|" + timers[timerPos].relaistype).c_str());
      }
    } 
  }else if(strcmp(cmd, "deactivate")==0){
    DEBUG_F("\nprocessMQTTTimerCmd deactivate");
    int timerPos = getTimerPosFromId(timerId);
    if(timerPos!=-1){
      if(timers[timerPos].active){
        stopRelaisTimer(timerId);
        timers[timerPos].active = false;
        writeTimers();
        if(timers[timerPos].relaistype == HEAT){
          publishLogMessage(C_LOGFILE | C_MQTT | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER, NULL, timers[timerPos].id, RC_OK, TIMER_HEAT_CHANGED,  (String(timers[timerPos].id)+"|"+timers[timerPos].bez +"|" + timers[timerPos].relaistype).c_str());
        }else{
          publishLogMessage(C_LOGFILE | C_MQTT | C_WS | C_WS_STATUS | C_WS_LOG | C_WS_TIMER, NULL, timers[timerPos].id, RC_OK, TIMER_SPUMP_CHANGED,  (String(timers[timerPos].id)+"|"+timers[timerPos].bez +"|" + timers[timerPos].relaistype).c_str());
        }
      } 
    }
  }
}



