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


