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
