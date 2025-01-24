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










