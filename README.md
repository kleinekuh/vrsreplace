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
