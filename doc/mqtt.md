# VRS Replace - MQTT

![MQTT Explorer VRS Replace topics](/doc/mqtt_md_1.png)

Readable Topics

| Topic: | Type: | Description: |
| :--- | :--- | :--- | 
| /vrsreplace | string | Current information about the general system status. This topic includes the LWT. |
| /vrsreplace/status | json | Informations from the system. Same content as from the REST service "/status" |
| /vrsreplace/sensor/[Sensor] | double | Actual measured sensor temperature (Kol1, Sp1, Sp2)  |
| /vrsreplace/timer/[Timer ID] | json | Status of the defined timers. |
| /vrsreplace/message | string | Last published log message. |


Writable Topics

| Topic: | Type: | Description: |
| :--- | :--- | :--- | 
| /vrsreplace/timer/[Timer ID]/cmd | string | All timers could be activated and deactivated by sending "activate" or "deactivate" as message. Timers with relaistype=3 (Timerprogram Manually) are able to "start" and "stop" sending the equivalent message. |




