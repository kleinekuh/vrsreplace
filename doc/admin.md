# VRS-Replace Configuration / Administration

Without any configuration the system would start in AP-mode. Your WiFi-device (mobile, tablet, pc) should show a network named „VRS-Replace“. After connecting with the password „12345678“ you can reach the configuration page by entering the IP: http://192.168.4.1 inside your browser.

![Config dialog](/doc/admin_md_1.png)

This menu could also be reached hiting the button "Setup"

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
| HTML von SD |  | If acivated the webserver delivers HTML’s, JS and CSS directly from SD-Card. This files have to be exist before. |

After entering correct parameters, hit „Speichern“ and restart „Neustart“. If WiFi connection will not work, the system will coming back in AP-mode after (Verbindungsversuche * Wartezeit(ms)).

With correct connection credentials the system would now connect to your WiFi and you are able adding timer programs for solar and warm water heating. The IP depends on your WiFi DHCP setup. If display is used the assigned IP would be shown.

![Config dialog](/doc/admin_md_2.png)

## Timer for solarpump
Hiting "+Solar" will opening a dialog for a new solar pump timer program:

![Config dialog](/doc/admin_md_3.png)

Parameters | Description |
| :--- | :--- |
| Name: | Name of this timer |
| Laufzeit (s): | Time in seconds how long the timer should run |
| Wartezeit (s): | Time in seconds how long the timer should wait |
| Einschalttemperatur (℃): | Which temperature (Kol1) should be reached, before activating this timer. |
| Auschalttemperatur (℃): | Target temperature before stopping the timer. Temperature is based on „Temperatur Sensor“ selection. |
| Temperaturdifferenz (℃): | Temperature difference Kol1 ↔ „Temperatur Sensor“ for starting the solar pump. If temperature is lower then the given value and target is not reached, timer goes into wait mode. |
| Temperatur Sensor: | Relevant sensor for measruing target temperature Sp1, Sp2 or Mittelwert. |
| Aktiv: | Timer program activ or not. |



