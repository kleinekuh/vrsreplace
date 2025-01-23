# VRS Replace
This „simple“ project (circuit & software) is a replacement for my old Vaillant VRS auroMATIC 560 thermal solar control.

![main index html](/doc/readme_md_1.png)

## !Warning / Diclaimer!
The circuit makes use of high voltage (240V). If you are not firm what this mean, dont do that and ask somebody for help.

The whole system is designed running behind your own firewall. On January 2025 there is no security layer or any auth mechansimen implemented. Anybody with access to your network/system is able changing timerprograms or uploading new firmware.

If you use this project inside an apartment building keep in mind that the DSGVO could be relevant.

I spend a lot of time measuring right „ADC to Resistor“ values before i got the information that the actual used temperature sensors (VR10/11) are susceptible by environmental influences. The heating engineers at the time (year 2008) forgot using a shielded cable. This is really funny if the sensor cables placed near to a high voltage once.

I am not responsible for any damages or a correct working.

## Why this project?
* Usage from my iPad
* One click warmwater heating
* Store temperature log on SD-Card
* Keep the existing tempsensors (VR 10 / VR 11)
* REST
* Don’t want to spend a lot of money. My heating engineer asked for such functionality around 1500 bucks. Further I had to drop my old BlackBerry and order a new mobile. Cheaper solutions require changing temperature sensors which implies rental of a scaffold for reaching the roof.
* Make things a little bit easier
* Every cubic meter of gas saved is good for the environment

## Solved issues / problems
* ESP – ADC’s in combination with resistor based temperature sensors → See „Usage /Installation“
* ESPAsyncWebServer → Replaced by PsychicHttp

## Usage / Installation:
1. Create the following folders on your SD-Card (FAT32):
„/webserver“ (if you want to load html, js and css from SD-Card)
„/log“
„/sensordata“

2. System operates with predefine LUT-Values. Everbody who allready tried calculating resistor values would known that ESP’s have some room for improvement. For that reason you should genrate your own LUT Value Table(s). You can use the solution from „e-thinkers“ (https://github.com/e-tinkers/esp32-adc-calibrate) or a more precisely solution from „Kveri“ (https://github.com/Kveri/esp32-adc-calibrate). The outputs must be converted to a row based „integer“ table. Eeach row representing the caculated int value. Make sure the ouput contains 
4096 rows. If not, add a 0 as first line and no headers.

3. Copy your generated lut file to your sd card inside the folder „/sensordata“. A single file for each pin is required. Naming convention „lut<PIN>.txt“. You can use my provided files „lut36.txt“, „lut39.txt“ and „lut34.txt“ but i believe an own generated file is more precise.

4. Copy pregenerated sensorfiles vrs10.txt and vrs11.txt into the same „/sensordata“ folder.
Remark:
Both files are average values. This values had been measured on 8 different ESP’s with a physical resistance decade. Resistor values are based by the vendor documentation for my old VRS auroMATIC 560 (guide „Für den Betreiber/für den Fachhandwerker Bedienungs- und Installationsanleitung auroMATIC 560“ page 26).

5. Copy the *.html, mainall.js.gz and main.css.gz files into folder „/webserver“. Only required if you want to serve these files from your SD-Card.
Remark:
The ESP’s webserver are not realy able dealing with a bunch of files. For that case i put all the relevant content like icons, external JS Libs and external defined CSS formatings into one single file and did a gzip compression afterwards. For perfomance reasons these content had been placed inside *.h files for direct delivering it without file reading. Keep in mind if you want to do any changes on the HTML-Side. ;-)

6. Bring the bin(s) to your ESP or compile it by yourself.
Homekit libraries already included. This means that the partition scheme has to be changed. For that case you need „minmal SPIFFS (1.9MB APP with OTA/190KB SPIFFS)“

Installation with ESP32 FLASH DOWNLOAD TOOL (used version v3.9.8)

![Flashtool start dialog](/doc/readme_md_4.png)

![Flashtool main dialog](/doc/readme_md_5.png)

| Bin-File | Address |
| :--- | :--- |
| VRS-Replace.ino.bootloader.bin | 0x1000 |
| VRS-Replace.ino.partitions.bin | 0x8000 |
| VRS-Replace.ino.bin | 0x10000 |

7. System should now started in AP Mode with the ssid VRS-Replace. Password „12345678“

## Configuration / Adminsitration
* Documentation „Configuration & Administration“
* Documentation „REST“

## Circuit / Layout
![circuit layout](/doc/readme_md_2.png)

## Used Parts
| Number | Part |
| --- | :--- |
| 1 | ESP32 DevKit C (see picture) |
| 1 | SD Card Module |
| 1 | 0,96‘‘ I2C Display (not required but nice) |
| 2 | Relais Boards |
| 2 | Screw Terminal (3 Connectors) |
| 4 | Screw Terminal (2 Connectors) |
| 1 | Varistor |
| 1 | Themal Fuse 72°C |
| 1 | Fuse Slow 250mA |
| 1 | Fuse Holder |
| 1 | 10uF capacitor |
| 1 | 22uF capacitor |
| 3 | 100nF capacitors |
| 3 | 100uF capacitors |
| 2 | 2,7KOhm resistors |
| 1 | 10KOhm resistor |
| 1 | HLK-PM01 AC DC 220V on board power supply |


Layout of used ESP:
![layout used esp](/doc/readme_md_3.png)

## Additional Software
VRS Replace uses the following OpenSource components:
* HTMX
https://htmx.org/
https://github.com/bigskysoftware/htmx

* svg-gauge
https://github.com/naikus/svg-gauge

* uPlot
https://github.com/leeoniya/uPlot

* PsychicHttp
https://github.com/hoeken/PsychicHttp

## License
Sourcecode, Documentation and Circuit-Plan are under GPL V3.

## Thanks
Big thanks to my neighbor Lorenz. He brought me to the idea using a linear interpolation for calculating missing temp values. Without his input i would still discussing this topic with his father, a mathematician.
To my partner. Everboy knows that hairwashing without warmwater isn’t funny.

## Comments
The source code is deliberate undocumented. I am not a friend of AI generated code. Any questions → Ask!
