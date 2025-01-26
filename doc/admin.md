# VRS-Replace Configuration / Administration

Without any configuration the system would start in AP-mode. Your WiFi-device (mobile, tablet, pc) should show a network named „VRS-Replace“. After connecting with the password „12345678“ you can reach the configuration page by entering the IP: http://192.168.4.1 inside your browser.

![Config dialog](/doc/admin_md_1.png)

This menu could also be reached hitting the button "Setup"

| Parameter | Change requires restart | Description |
| :--- | :--- | :--- |
| SSID: | x | SSID of the WiFi Network |
| Passwort: | x | Password for WiFi Network |
| NTP Server: |  | IP or domain of the NTP-Server |
| Verbindungsversuche: |  | Number of connection retries before starting in AP-Mode |
| Wartezeit(ms): |  | Waittime in ms before trying next WiFi reconnect |
| Small log write(ms): |  | Time in ms for writing small temperature log (see /downloadtemperaturelog) |
| Large log write(ms): |  | Time in ms for writing large temperature log (see /downloadtemperaturelog) |
| Sensors Refresh(ms): |  | Time in ms for refreshing the tempsensors |
| Max Temperature(°C): |  | Max Temperature of the solar storage unit |
| Logpath: |  | Folder on SD-Card for the Log-Files |
| Webserverpath: |  | Folder on SD-Card where the WebServer retrieves JS/CSS and HTML Files |
| Lutpath: |  | Folder on SD-Card for the LUT predefined values |
| CORS zulassen: | x | Allows CORS Headers. Important for own Webpage development. |
| HTML von SD |  | If activated the webserver delivers HTML’s, JS and CSS directly from SD-Card. This files have to be exist before. |

After entering correct parameters, hit „Speichern“ and restart „Neustart“. If WiFi connection will not work, the system will coming back in AP-mode after (Verbindungsversuche * Wartezeit(ms)).

With correct connection credentials the system would now connect to your WiFi and you are able adding timer programs for solar and warm water heating. The IP depends on your WiFi DHCP setup. If display is used the assigned IP would be shown.

![dialog main](/doc/admin_md_2.png)

## Timer for solarpump
Hitting "+Solar" will opening a dialog for a new solar pump timer program:

![dialog solarpump](/doc/admin_md_3.png)

| Parameters | Description |
| :--- | :--- |
| Name: | Name of this timer |
| Laufzeit (s): | Time in seconds how long the timer should run |
| Wartezeit (s): | Time in seconds how long the timer should wait |
| Einschalttemperatur (℃): | Which temperature (Kol1) should be reached, before activating this timer. |
| Auschalttemperatur (℃): | Target temperature before stopping the timer. Temperature is based on „Temperatur Sensor“ selection. |
| Temperaturdifferenz (℃): | Temperature difference Kol1 ↔ „Temperatur Sensor“ for starting the solar pump. If temperature is lower then the given value and target is not reached, timer goes into wait mode. |
| Temperatur Sensor: | Relevant sensor for measuring target temperature Sp1, Sp2 or Mittelwert. |
| Aktiv: | Timer program active or not. |

## Timer for warmwater heating
Hitting "+Warmwasser" will opening a dialog for a new warm water heating timer program:

![dialog heating](/doc/admin_md_4.png)

| Parameters | available inside timerprogam | Description |
| :--- | :--- | :--- |
| Name: | All | Name of this timer |
| Zeiten: | All | Selection for different timer program: - Täglich = Daily - Wochentags = Only at day selection - Manuell = Running at single click |
| MO, DI, MI, DO, FR, SA, SO | Wochentags | Timer should run at this weekday(s) |
| Einschaltzeit: | Täglich / Wochentags | Timer should start at HH24:mm |
| Ausschaltzeit: | Täglich / Wochentags | Timer should end at HH24:mm |
| Auschalttemperatur (℃): | All | Target temperature before stopping the timer. Temperature is based on „Temperatur Sensor“ selection. |
| Hysterese (℃): | Täglich / Wochentags | If temperature but end time had not been reached, timer goes into waiting and restarts if target temperature goes under this value. |
| Temperatur Sensor: | All | Relevant sensor for measuring target temperature Sp1, Sp2 or Mittelwert. |
| Aktiv: | All | Timer program active or not. |


## Section "Schaltzeiten"
Shows the created timer programs. If timer is running a red bar is shown inside the program. If bar becomes yellow timer is in waiting state.

![dialog heating](/doc/admin_md_5.png)

| Button(s) | Description |
| :--- | :--- |
| Aktualisieren | Refreshes the list of timer programs. |
| + Solar | Adds a new program for the solar pump. |
| + Warmwasser | Adds a new program for warm water heating. |
| Löschen | Highlighted timer programs (single click / red frame) got deleted without any warning. |

Double click or long touch on single timer will opening program for changing.


## Section "Protokoll (letzten 10):"
Lists the last 10 protocol entries.

![dialog heating](/doc/admin_md_6.png)

| Button(s) | Description |
| :--- | :--- |
| Aktualisieren | Refreshes the log entries list. |


## Section "Status"
Shows actual information about the system: Version, date time and the status of the SD-Card.

![dialog heating](/doc/admin_md_7.png)

| Button(s) | Description |
| :--- | :--- |
| Setup | Opens the configuration window. |
| Update | Opens the page for updating the system. |


## Section "Aktuell"
Shows the current temperature for each sensor.

![dialog heating](/doc/admin_md_8.png)

## Section "Tagesverlauf"
Shows temperature history for today and previous day. The red line symbolizes the actual hour. The grayed part shows temperature from previous day.

![dialog heating](/doc/admin_md_9.png)









