# VRSReplace
This „simple“ project (circuit & software) is a replacement for my old Vaillant VRS auroMATIC 560 thermal solar control.

## !Warning / Diclaimer!
The circuit makes use of high voltage (240V). If you are not firm what this mean, dont do that and ask somebody for help.

The whole system is designed running behind your own firewall. On January 2025 there is no security layer or any auth mechansimen implemented. Anybody with access to your network/system is able changing timerprograms or uploading new firmware.

If you use this project inside an apartment building keep in mind that the DSGVO could be relevant.

I spend a lot of time measuring right „ADC to Resistor“ values before i got the information that the actual used temperature sensors (VR10/11) are susceptible by environmental influences. The heating engineers at the time (year 2008) forgot using a shielded cable. This is really funny if the sensor cables placed near to a high voltage once.

I am not responsible for any damages or a correct working.

## Why this project?
* Usage from my iPad
* One click warmwater heating
* Store temperature log on SD
* Keep the existing tempsensors (VR 10 / VR 11)
* REST
* Don’t want to spend a lot of money. My heating engineer asked for such functionality around 1500 bucks. Further I had to drop my old BlackBerry and order a new mobile. Cheaper solutions require changing temperature sensors which implies rental of a scaffold for reaching the roof.
* Make things a little bit easier
* Every cubic meter of gas saved is good for the environment

## Solved issues / problems
* ESP – ADC’s in combination with resistor based temperature sensors → See „Usage /Installation“
* ESPAsyncWebServer → Replaced by PsychicHttp



![main index html](/images/readme_md_1.png)


![circuit layout](/images/readme_md_2.png)


![layout used esp](/images/readme_md_3.png)