# VRS Replace - REST API

The frontend communicates directly with the backed API by calling any URL’s in combination with some parameters. Results are normally send back as JSON resultset.

My enviroment has an assigned IP 192.168.80.16


## /status
Delivers informations about the actual system state.
| Input: | Type: |  |
| :--- | :--- | :--- |
| NONE |  |  |
| **Output:** |  |  |
| timestamp | string | Timestamp with the format dd.MM.yyyy HH24:mm:ss |
| sdmount | bool | SD Card mounted |
| version | double | The software version |
| sd | bool  | SD Interface exists |
| nbtimers | int | Number of defined timers |
| heap | int | Size of current available heap memory (bytes) |


## /log
Delivers the last 10 system-logentries
| Input: | Type: |  |
| :--- | :--- | :--- |
| NONE |  |  |
| **Output:** | Array[10] |  |
| id | int | Increasing INT-Value |
| priocode | int | Priority of this entry |
| date | int | Datestamp Format:yyyyMMdd |
| time | int | Timestamp Format:H24mmss !Leading zero is termiated! |
| code | int | Message Code → Struct LogStatusCode |
| message | string | Asociated Message Example: code=201 / message=5!morgens Translated: Timer with id=5 and name=morgens had been stopped |


## /downloadtemperaturelog
Download logfile with temperature values. Logfile exists in two different formats (small and full).
| Input: | Type: |  |
| :--- | :--- | :--- |
| logfile | int | Date for the logfile to download. Format: yyyyMMdd |
| type | string | small / full |
| **Output:** | Start HTTP Download |  |
| NONE |  |  |

### CSV Document small
| Column: | Type: |  |
| :--- | :--- | :--- |
| 1 | int | Temperature sensor / 0=Kol1; 1=Sp1; 2=Sp2 |
| 2-25 | int | Max Temperatures full hour |
| 26-49 | int | Min Temperatures full hour |

### CSV Document full
| Column: | Type: |  |
| :--- | :--- | :--- |
| 1 | int | Datestamp format yyyyMMdd |
| 2 | string | Timestamp format: HH24mmss |
| 3 | int | Id of active heattimer |
| 4 | int | Id of active solartimer |
| 5 | int | Id of active circulationtimer (Currently not used) |
| 6 | string | Name of the Tempsensor (Kol1, Sp1, Sp2) |
| 7 | int | Id of the Tempsensor |
| 8 | double | Actual temperature |
| 9 | double | Max temperature (per day) |
| 10 | double | Min temperature (per day) |


## /temperature
Retrieves the actual temperatures as JSON Array
| Input: | Type: |  |
| :--- | :--- | :--- |
| NONE |  |  |
| **Output:** | Array[3] |  |
| bez | string | Name of the Tempsensor |
| deviceid | int | Id of the sensor Kol1=0 / Sp1 = 1 / Sp2 = 2 |
| sensortype | int | Sensortype VR10 = 1 / VR11=2 |
| Ta | double | Actual temperature |
| TaAvg | double | Avg temperature (depends config sensorAvgTemperatureCalcSize) |
| TaMin | double | Temperature Min (per hour) |
| TaMax | double | Temperature Max (per hour) |
| TaMinH | double Array[24] | Array with min temperatures per hour |
| TaMaxH | double Array[24] | Array with max temperatures per hour |
| TaMinY | double Array[24] | Array with min temperatures per hour / previous day |
| TaMaxY | double Array[24] | Array with max temperatures per hour / previous day |


## /config
Returns the actual configuration values
| Input: | Type: |  |
| :--- | :--- | :--- |
| NONE |  |  |
| **Output:** |  |  |
| ssid | string | SSID of the used WiFi Network |
| password | string | Allways *** |
| ntpserver | string | IP or domain of the NTP-Server |
| lutpath | string | Folder on SD-Card for the LUT predefined values |
| logpath | string | Folder on SD-Card for the Log-Files |
| webserverpath | string | Folder on SD-Card where the WebServer retrieves JS/CSS and HTML Files |
| temperaturesrt | int | Time in ms for refreshing the tempsensors |
| temperaturelwt | int | Time in ms for writing large temperature log (see /downloadtemperaturelog) |
| temperatureswt | int | Time in ms for writing small temperature log (see /downloadtemperaturelog) |
| wificonnectionretries | int | Number of connection retries before starting in AP-Mode |
| wifireconnectinterval | int | Waittime in ms before trying next WiFi reconnect |
| maxtemperature | int | Max Temperature of the solar storage unit |
| version | string | Installed Version |
| allowcors | bool | CORS Header set |
| deliverfromsd | bool | Load HTML’s, JS and CSS from SD-Card |


## /system
Allows some system change by adding one of the following parameter to the Url.
| Input: | Type: |  |
| :--- | :--- | :--- |
| reboot | string | Reboots the system |
| ntp | string | Recals the datetime from configured NTP-Server |
| eraseconfig | string | Deletes the whole config and starts the system in AP-Mode |
| **Output:** | JSON Status |  |
| timestamp | string | DateTimestamp format dd.MM.yyyy HH24:mm:ss |
| id | int | Id of the timer. If function not relevant to timer, -1 is returned |
| status | int | 1=Ok / 2=Error |
| code | int | Statuscode see enum LogStatusCode |

Example:
```
Url: 
	http://<IP>/system?ntp → Recalls the datetime from configured NTP-Server.
Return:
	{"timestamp":"05.01.2025 16:43:37","id":-1,"status":1,"code":112}
	Status: 1 = Ok
	Code: 112 = System NTP-Time refreshed
```

## /changeconfig
Changing the existing config parameters. Changing SSID and/or Password requires a reboot of the system. 
| Input: | Type: |  |
| :--- | :--- | :--- |
| config | JSON document |  |
| **Input JSON document** |  |
| ssid | string | SSID of the used WiFi Network |
| password | string | Password for the WiFi Network |
| ntpserver | string | IP or Domain for the NTP-Server |
| temperaturesrt | int | Time in ms for refreshing the tempsensors |
| temperaturelwt | int | Time in ms for writing large temperature log (see /downloadtemperaturelog) |
| temperatureswt | int | Time in ms for writing small temperature log (see /downloadtemperaturelog) |
| wificonnectionretries | int | Number of connection retries before starting in AP-Mode |
| wifireconnectinterval | int | Waittime in ms before trying next WiFi reconnect |
| maxtemperature | int | Max Temperature of the solar storage unit |
| **Output:** | JSON Status |  |
| timestamp | string | DateTimestamp format dd.MM.yyyy HH24:mm:ss |
| id | int | Id of the timer. If function not relevant to timer, -1 is returned |
| status | int | 1=Ok / 2=Error |
| code | int | Statuscode see enum LogStatusCode |


## /timer
Returns the timer by providing a valid timer id. Return structure is similar to timerlist. If timer could not be found a status document would be send.
| Input: | Type: | Timer Program (s): | Relais: |  |
| :--- | :--- | :--- | :--- | :--- |
| id | int | All | All | ID of the timer |
| **Output:** | JSON Document |  |  |  | 
| pos | string | All | All |  |
| id | int | All | All | Unique id of the timer.  |
| bez | string | All | All | Given Name of this timer |
| gpiopin | int | All | All | ESP Pin used for relais |
| relais | int | All |  | Assigned relais to this timer 1=Heat, 2=Solar, 3=Circulation |
| time_on | int | 1,2 | 1 | Starttime format H24mmss |
| time_off | int | 1,2 | 1 | Endtime format H24mmss |
| weekdays | int Array[7] | 2 | 1 | Weekdays when the timer should be active. |
| running_period | int |  | 2 | Time in ms timer should run (gpio=high) |
| waiting_period | int |  | 2 | Time in ms timer should wait before switiching to run (gpio=low) |
| timer_program | int |  | 1 | Type of this Timer 1=Daily, 2=Weekdays, 3=Per request, 4=Dynamic |
| temperature_on | int |  | 2 | Kol1 Temperature for strating this timer |
| temperature_off | int | 1,2,3 | 1,2 | Temperature for stopping this timer |
| tempsensor | int | All | All | Relevant sensor for measruing target temperature None = 0, Sp1 = 1, Sp2 = 2, Avg_Sp1_Sp2 = 3, Kol1 = 4 |
| temperature_difference | int |  | 2 | Temperature difference Kol1 ↔ tempsensor, for starting solar pump |
| hysteresis | int | 1,2 | 1 | Temperature difference for running Heat-Timer before restarting warm water heating. |
| active | bool | All | All | Activated = True, Deactivated = False |
| state | bool | All | All | Running state Running = true |
| timerstatetype | int | All | All | Current Timerstate 1 = On, 2 = Off, 3 = Wait |
| runnings | int | All | All | How often this timer had been running |
| waitings | int | All | All | How often this timer are set to wait state |
| laststartdate | int | All | All | Last startdate of this timer format: yyyyMMdd |
| laststarttime | int | All | All | Last starttime of this timer format: H24mmss |
| publishhomekit  | bool | 3 | 1 | Should this timer published to homekit (future) |
| avgtempincreasepermin | int | 1,2,3 | 1,2 | Average temperature increasement per minute for this timer (future) |


## /timerchange
Returns the timer by providing a valid timer id. Return structure is similar to timerlist. If timer could not be found a status document would be send.
| Input: | Type: | Timer Program (s): | Relais: |  |
| :--- | :--- | :--- | :--- | :--- |
| timer | JSON Document | All | All | |
| **Input JSON Document** |  |  |  |  | 
| id | int | All | All | Unique id of the timer. -1 = Create new timer |
| bez | string | All | All | Given Name of this timer |
| gpiopin | int | All | All | ESP Pin used for relais |
| relais | int | All |  | Assigned relais to this timer 1=Heat, 2=Solar, 3=Circulation |
| time_on | int | 1,2 | 1 | Starttime format H24mmss |
| time_off | int | 1,2 | 1 | Endtime format H24mmss |
| weekdays | int Array[7] | 2 | 1 | Weekdays when the timer should be active. |
| running_period | int |  | 2 | Time in ms timer should run (gpio=high) |
| waiting_period | int |  | 2 | Time in ms timer should wait before switiching to run (gpio=low) |
| timer_program | int |  | 1 | Type of this Timer 1=Daily, 2=Weekdays, 3=Per request, 4=Dynamic |
| temperature_on | int |  | 2 | Kol1 Temperature for strating this timer |
| temperature_off | int | 1,2,3 | 1,2 | Temperature for stopping this timer |
| tempsensor | int | All | All | Relevant sensor for measruing target temperature None = 0, Sp1 = 1, Sp2 = 2, Avg_Sp1_Sp2 = 3, Kol1 = 4 |
| temperature_difference | int |  | 2 | Temperature difference Kol1 ↔ tempsensor, for starting solar pump |
| hysteresis | int | 1,2 | 1 | Temperature difference for running Heat-Timer before restarting warm water heating. |
| active | bool | All | All | Activated = True, Deactivated = False |
| **Output:** | JSON Status |  |
| timestamp | string | | | DateTimestamp format dd.MM.yyyy HH24:mm:ss |
| id | int | | | Id of the timer. If function not relevant to timer, -1 is returned |
| status | int | | | 1=Ok / 2=Error |
| code | int | | | Statuscode see enum LogStatusCode |

## /timerdelete
Deletes exiting timer(s) by providing the
| Input: | Type: |  |
| :--- | :--- | :--- |
| timers | JSON Array | JSON Array with timer id(s) to delete |
| **Output:** | JSON Status |  |
| timestamp | string | DateTimestamp format dd.MM.yyyy HH24:mm:ss |
| id | int | Id of the timer. If function not relevant to timer, -1 is returned |
| status | int | 1=Ok / 2=Error |
| code | int | Statuscode see enum LogStatusCode |


## /timerdeleteall
Deletes all existing timers. Before deletion all timers will be stopped and deactivated.
| Input: | Type: |  |
| :--- | :--- | :--- |
| NONE |  |  |
| **Output:** | JSON Status |  |
| timestamp | string | DateTimestamp format dd.MM.yyyy HH24:mm:ss |
| id | int | Id of the timer. If function not relevant to timer, -1 is returned |
| status | int | 1=Ok / 2=Error |
| code | int | Statuscode see enum LogStatusCode |


## /timerlist
Returns a list with the existing timers.
| Input: | Type: | Timer Program (s): | Relais: |  |
| :--- | :--- | :--- | :--- | :--- |
| NONE |  |  |  |  |
| **Output:** | JSON Array |  |  |  | 
| pos | string | All | All |  |
| id | int | All | All | Unique id of the timer.  |
| bez | string | All | All | Given Name of this timer |
| gpiopin | int | All | All | ESP Pin used for relais |
| relais | int | All |  | Assigned relais to this timer 1=Heat, 2=Solar, 3=Circulation |
| time_on | int | 1,2 | 1 | Starttime format H24mmss |
| time_off | int | 1,2 | 1 | Endtime format H24mmss |
| weekdays | int Array[7] | 2 | 1 | Weekdays when the timer should be active. |
| running_period | int |  | 2 | Time in ms timer should run (gpio=high) |
| waiting_period | int |  | 2 | Time in ms timer should wait before switiching to run (gpio=low) |
| timer_program | int |  | 1 | Type of this Timer 1=Daily, 2=Weekdays, 3=Per request, 4=Dynamic |
| temperature_on | int |  | 2 | Kol1 Temperature for strating this timer |
| temperature_off | int | 1,2,3 | 1,2 | Temperature for stopping this timer |
| tempsensor | int | All | All | Relevant sensor for measruing target temperature None = 0, Sp1 = 1, Sp2 = 2, Avg_Sp1_Sp2 = 3, Kol1 = 4 |
| temperature_difference | int |  | 2 | Temperature difference Kol1 ↔ tempsensor, for starting solar pump |
| hysteresis | int | 1,2 | 1 | Temperature difference for running Heat-Timer before restarting warm water heating. |
| active | bool | All | All | Activated = True, Deactivated = False |
| state | bool | All | All | Running state Running = true |
| timerstatetype | int | All | All | Current Timerstate 1 = On, 2 = Off, 3 = Wait |
| runnings | int | All | All | How often this timer had been running |
| waitings | int | All | All | How often this timer are set to wait state |
| laststartdate | int | All | All | Last startdate of this timer format: yyyyMMdd |
| laststarttime | int | All | All | Last starttime of this timer format: H24mmss |
| publishhomekit  | bool | 3 | 1 | Should this timer published to homekit (future) |
| avgtempincreasepermin | int | 1,2,3 | 1,2 | Average temperature increasement per minute for this timer (future) |


## /timerstart
Starts the timer by providing the timer id.
| Input: | Type: |  |
| :--- | :--- | :--- |
| id | int | Id of the timer to start |
| **Output:** | JSON Status |  |
| timestamp | string | DateTimestamp format dd.MM.yyyy HH24:mm:ss |
| id | int | Id of the timer. If function not relevant to timer, -1 is returned |
| status | int | 1=Ok / 2=Error |
| code | int | Statuscode see enum LogStatusCode |


## /timerstop
Stops the timer by providing the timer id.
| Input: | Type: |  |
| :--- | :--- | :--- |
| id | int | Id of the timer to stop |
| **Output:** | JSON Status |  |
| timestamp | string | DateTimestamp format dd.MM.yyyy HH24:mm:ss |
| id | int | Id of the timer. If function not relevant to timer, -1 is returned |
| status | int | 1=Ok / 2=Error |
| code | int | Statuscode see enum LogStatusCode |


## /testrelay
Test relais by setting the relevant gpio high or low.
| Input: | Type: |  |
| :--- | :--- | :--- |
| gpio | int | GPIO Pin for high/low activation. Current GPIO 16 = HEAT, GPIO 17 = SOLAR_PUMP |
| onoff | int | On = 1 / Off = 0 |
| **Output:** | JSON Status |  |
| timestamp | string | DateTimestamp format dd.MM.yyyy HH24:mm:ss |
| id | int | Id of the timer. If function not relevant to timer, -1 is returned |
| status | int | 1=Ok / 2=Error |
| code | int | Statuscode see enum LogStatusCode |
 







