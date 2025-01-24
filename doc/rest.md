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











