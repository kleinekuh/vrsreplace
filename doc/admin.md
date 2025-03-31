# VRS-Replace Configuration / Administration

Without any configuration the system would start in AP-mode. Your WiFi-device (mobile, tablet, pc) should show a network named „VRS-Replace“. After connecting with the password „12345678“ you can reach the configuration page by entering the IP: http://192.168.4.1 inside your browser.

![Config dialog](/doc/admin_md_1.png)

This menu could also be reached hitting the button "Setup"

| Parameter | Change requires restart | Description |
| :--- | :--- | :--- |
| SSID: | x | SSID of the WiFi Network |
| Password: | x | Password for WiFi Network |
| NTP Server: |  | IP or domain of the NTP-Server |
| Timezone: |  | Selection of different European timezones. For Germany select: Europe/Berlin |
| Language: |  | Supported languages de (default), en |
| Connection attempts: |  | Number of connection retries before starting in AP-Mode |
| Reconnection waittime(ms): |  | Waittime in ms before trying next WiFi reconnect |
| MQTT active? |  | Activates MQTT |
| MQTT-Server: |  | The URL for the MQTT Server. "mqtt://" must be added on the URL |
| MQTT-Send intervall(ms): |  | Interval(ms) sending MQTT messages |
| Small log write(ms): |  | Time in ms for writing small temperature log (see /downloadtemperaturelog) |
| Large log write(ms): |  | Time in ms for writing large temperature log (see /downloadtemperaturelog) |
| Sensors Refresh(ms): |  | Time in ms for refreshing the temperature sensors |
| Max Temperature(°C): |  | Max Temperature of the collector sensor, before switching off |
| Logpath: |  | Folder on SD-Card for the Log-Files |
| Webserverpath: |  | Folder on SD-Card where the WebServer retrieves JS/CSS and HTML Files |
| Lutpath: |  | Folder on SD-Card for the LUT predefined values |
| Allow CORS | x | Allows CORS Headers. Important for own Webpage development. |
| HTML from SD |  | If activated the webserver delivers HTML’s, JS and CSS directly from SD-Card. This files have to be exist before. |

After entering correct parameters, hit „Save“ and restart „Restart“. If WiFi connection will not work, the system will coming back in AP-mode after Connection attempts * Reconnection waittime(ms)).

With correct connection credentials the system would now connect to your WiFi and you are able adding timer programs for solar and warm water heating. The IP depends on your WiFi DHCP setup. If display is used the assigned IP would be shown.

![dialog main](/doc/admin_md_2.png)

## Timer for solarpump
Hitting "+ Solar" will opening a dialog for a new solar pump timer program:

![dialog solarpump](/doc/admin_md_3.png)

| Parameters | Description |
| :--- | :--- |
| Name: | Name of this timer |
| Duration (s): | Time in seconds how long the timer should run |
| Waiting time (s): | Time in seconds how long the timer should wait |
| Switch-on temperature (℃): | Which temperature (Kol1) should be reached, before activating this timer. |
| Switch-off temperature (℃): | Target temperature before stopping the timer. Temperature is based on Temperature sensor“ selection. |
| Temperature difference (℃): | Temperature difference Kol1 ↔ Temperature sensor“ for starting the solar pump. If temperature is lower then the given value and target is not reached, timer goes into wait mode. |
| Temperature sensor: | Relevant sensor for measuring target temperature Sp1, Sp2 or Average|
| Activ | Timer program active or not. |

## Timer for warmwater heating
Hitting "+ Hot water" will opening a dialog for a new warm water heating timer program:

![dialog heating](/doc/admin_md_4.png)

| Parameters | available inside timerprogam | Description |
| :--- | :--- | :--- |
| Name: | All | Name of this timer |
| Times: | All | Selection for different timer program: - Daily = every day - Weekdays = Only at day selection - Manualy = Running at single click |
| MO, TU, WE, TH, FR, SA, SO | Weekdays | Timer should run at this weekday(s) |
| Switch-on time: | Daily / Weekdays | Timer should start at HH24:mm |
| Switch-off time: | Daily / Weekdays | Timer should end at HH24:mm |
| Switch-off temperature (℃): | All | Target temperature before stopping the timer. Temperature is based on „Temperature sensor“ selection. |
| Hysteresis (℃): | Daily / Weekdays | If temperature but end time had not been reached, timer goes into waiting and restarts if target temperature goes under this value. |
| Temperature sensor: | All | Relevant sensor for measuring target temperature Sp1, Sp2 or Average. |
| Activ | All | Timer program active or not. |


## Section "Switching times"
Shows the created timer programs. If timer is running a red bar is shown inside the program. If bar becomes yellow timer is in waiting state.

![dialog heating](/doc/admin_md_5.png)

| Button(s) | Description |
| :--- | :--- |
| Refresh | Refreshes the list of timer programs. |
| + Solar | Adds a new program for the solar pump. |
| + Hot water | Adds a new program for warm water heating. |
| Delete | Highlighted timer programs (single click / red frame) got deleted without any warning. |

Double click or long touch on single timer will opening program for changing.


## Section "Log (last 10):"
Lists the last 10 protocol entries.

![dialog heating](/doc/admin_md_6.png)

| Button(s) | Description |
| :--- | :--- |
| Refresh | Refreshes the log entries list. |


## Section "State"
Shows actual information about the system: Version, date time, status of the SD-Card and if MQTT is on or off

![dialog heating](/doc/admin_md_7.png)

| Button(s) | Description |
| :--- | :--- |
| Setup | Opens the configuration window. |
| Update | Opens the page for updating the system. |


## Section "Current"
Shows the current temperature for each sensor.

![dialog heating](/doc/admin_md_8.png)

## Section "Daily"
Shows temperature history for today and previous day. The red line symbolizes the actual hour. The grayed part shows temperature from previous day.

![dialog heating](/doc/admin_md_9.png)









