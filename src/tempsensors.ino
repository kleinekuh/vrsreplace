
/**********************************************************************
*	Copyright (C) 2025  Martin Lange
*	This file is part of VRS Replace. OpenSource thermal solar control
*
*	This program is free software: you can redistribute it and/or modify
*	it under the terms of the GNU General Public License as published by
*	the Free Software Foundation, either version 3 of the License, or
*	(at your option) any later version.
*
*	This program is distributed in the hope that it will be useful,
*	but WITHOUT ANY WARRANTY; without even the implied warranty of
*	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*	GNU General Public License for more details.
*
*	You should have received a copy of the GNU General Public License
*	along with this program.  If not, see <https://www.gnu.org/licenses/>.
*	https://github.com/kleinekuh/vrsreplace
**********************************************************************/

/*
Version 0.9.8
*/

uint8_t vrprevalues_count;
uint8_t tempsensors_count;
uint8_t *adc_pins;
uint8_t adc_pins_count;
adc_continuous_data_t* result = NULL;

void ARDUINO_ISR_ATTR adcComplete() {
  runtime.adc_coversion_done = true;
}

void initTemperatureSensors(){
  
  vrprevalues[0] = initVRPreValue(VR10, 0, 120, String(config.lutPath) + "/vrs10.txt");
  vrprevalues[1] = initVRPreValue(VR11, -20, 130, String(config.lutPath) + "/vrs11.txt");
  vrprevalues_count = sizeof(vrprevalues)/sizeof(vrprevalues[0]);

  temperaturesensors[0] = buildSensor(1, "Kol1", 36, VR11, KOL1, String(config.lutPath) + "/lut36.txt");
  temperaturesensors[1] = buildSensor(2, "Sp1", 39, VR10, SP1, String(config.lutPath) + "/lut39.txt");
  temperaturesensors[2] = buildSensor(3, "Sp2", 34, VR10, SP2, String(config.lutPath) + "/lut34.txt");

  tempsensors_count = sizeof(temperaturesensors)/sizeof(temperaturesensors[0]);
  adc_pins_count = tempsensors_count;
  adc_pins = (uint8_t*)malloc(adc_pins_count * sizeof(uint8_t));
  for(int i=0;i<adc_pins_count;i++) adc_pins[i] = temperaturesensors[i].gpiopin;

  analogContinuousSetWidth(12);
  analogContinuousSetAtten(ADC_11db);
  analogContinuous(adc_pins, adc_pins_count, CONVERSIONS_PER_PIN, 800000, &adcComplete);

  analogContinuousStart();
  runtime.adc_conversion_started = true;
}

bool deinitTemperatureSensors(){
  if(!runtime.adc_conversion_started) return true;
  if(!analogContinuousStop()) return false;
  delay(100);
  if(!analogContinuousDeinit()) return false;
  runtime.adc_conversion_started = false;
  return true;
}

TemperatureSensor buildSensor(int deviceId, String bez, int gpiopin, VRSensorType sensorType, TemperatureMeasurementType tempmeasurementtype, String lutName) {
  TemperatureSensor rc;
  rc.bez = bez;
  rc.deviceId = deviceId;
  rc.gpiopin = gpiopin;
  rc.sensorType = sensorType;
  rc.tempmeasurementtype = tempmeasurementtype;
  rc.Ta = 0.0;
  rc.TaMax = 0.0;
  rc.TaMin = 0.0;
  rc.counter=-1;
  rc.TaS = 0.0;
  readLutFileToIntArray(lutName.c_str(), rc.lut);
  pinMode(rc.gpiopin, INPUT);

  return rc;
}

VRPreValue initVRPreValue(VRSensorType sensorType, double TaMin, double TaMax, String lutName){

  VRPreValue vrprevalue;
  vrprevalue.sensorType = sensorType;
  vrprevalue.TaMin = TaMin;
  vrprevalue.TaMax = TaMax;
  vrprevalue.numberofvalues = getNumberOfLutEntries(lutName.c_str());

  int* temparray = (int*)malloc(vrprevalue.numberofvalues * sizeof(int));
  readLutFileToIntArray(lutName.c_str(), temparray);
  
  vrprevalue.numberofvalues = vrprevalue.numberofvalues/2;
  vrprevalue.values = (int**)malloc(vrprevalue.numberofvalues * sizeof(int));
  for (int i = 0; i < vrprevalue.numberofvalues; i++) vrprevalue.values[i] = (int*)malloc(2 * sizeof(int));

  int j=0;
  for(int i=0;i<vrprevalue.numberofvalues;i++){
      vrprevalue.values[i][0] = temparray[j++];
      vrprevalue.values[i][1] = temparray[j++];
  }
  free(temparray);
  return vrprevalue;
}

double calcTempFromPreValues(int value, VRPreValue vrprevalue){
  int x1, x2;
  int y1, y2;
  if(value==0) return vrprevalue.values[vrprevalue.numberofvalues-1][1];

  for(int i=0;i<vrprevalue.numberofvalues;i++){
    //DEBUG_F("%d %d %d\n", value, vrprevalue.values[i][0], vrprevalue.values[i][1]);
    if(value==vrprevalue.values[i][0]) {
      return vrprevalue.values[i][1];
    }
    if(value>vrprevalue.values[i][0]){
      x2=vrprevalue.values[i][0];
      y2=vrprevalue.values[i][1];
      if(i>0){
        x1=vrprevalue.values[i-1][0];
        y1=vrprevalue.values[i-1][1];
      }else{
        return vrprevalue.values[0][1];
      }
      i=1000;
    }
  }
  //DEBUG_F("x2=%d, y2=%d, x1=%d, y1=%d\n", x2, y2, x1, y1);
  double d1 = ((double)(y2-y1))/((double)(x2-x1));
  double calcTemp = y1+(d1*(value-x1));
  //DEBUG_F("calcTemp %lf %lf\n", d1, calcTemp);
  return calcTemp;
}

void processTemperature(){
  if (analogContinuousRead(&result, 0)) {
      analogContinuousStop();

      int hour = getHour();

      for (int i = 0; i < adc_pins_count; i++) {
        int adc = result[i].avg_read_raw;
        int pin = result[i].pin;

        int tempsensor_pos = getTemperaturSensorPosFromPin(pin);
        int vrdefvalue_pos = -1;
        if(tempsensor_pos!=-1){
          vrdefvalue_pos = getVRPreValuesPosFromVRSensorType(temperaturesensors[tempsensor_pos].sensorType);
        }
        if(vrdefvalue_pos!=-1){
          adc = temperaturesensors[tempsensor_pos].lut[adc];
          double calcTemp = calcTempFromPreValues(adc, vrprevalues[vrdefvalue_pos]); 
          if(calcTemp<=-20 || calcTemp>=130) calcTemp=0;
          if(calcTemp <= vrprevalues[vrdefvalue_pos].TaMin || calcTemp >= vrprevalues[vrdefvalue_pos].TaMax){
            calcTemperature(calcTemp, tempsensor_pos, hour, false);
          }else{
            calcTemperature(calcTemp, tempsensor_pos, hour, true);
          }
        }
      }
      runtime.acthour=hour;
      analogContinuousStart();
  }
}

void calcTemperature(double temperature, int pos, int hour, bool storeminmax){
  
  if(temperaturesensors[pos].counter==-1){
    temperaturesensors[pos].Ta = temperature;
    temperaturesensors[pos].TaS = temperature;
    temperaturesensors[pos].TaAvg = temperature;
    temperaturesensors[pos].counter=0;
    temperaturesensors[pos].TaMin = 130;
    temperaturesensors[pos].TaMax = -20;
  }

  if(temperaturesensors[pos].counter>=config.sensorAvgTemperatureCalcSize){
    temperaturesensors[pos].TaAvg = (temperaturesensors[pos].TaS / temperaturesensors[pos].counter);
    temperaturesensors[pos].TaS = 0.0;
    temperaturesensors[pos].counter=0.0;
  }

  temperaturesensors[pos].TaS = temperaturesensors[pos].TaS + temperature;
  temperaturesensors[pos].counter++;

  temperaturesensors[pos].Ta = temperature;
  if(storeminmax){
    if(hour!=runtime.acthour){
      temperaturesensors[pos].TaMax=temperature;
      temperaturesensors[pos].TaMin=temperature;
      temperatureperhours[pos].TaMax[hour] = temperature;
      temperatureperhours[pos].TaMin[hour] = temperature;
    }else{
      if(temperature > temperaturesensors[pos].TaMax)  temperaturesensors[pos].TaMax=temperature;
      if(temperature < temperaturesensors[pos].TaMin)  temperaturesensors[pos].TaMin=temperature;
      if(temperature > temperatureperhours[pos].TaMax[hour]) temperatureperhours[pos].TaMax[hour] = temperature;
      if(temperature < temperatureperhours[pos].TaMin[hour]) temperatureperhours[pos].TaMin[hour] = temperature;
    }
  }

}

int getTemperaturSensorPosFromPin(int pin){
  for(int i=0;i<tempsensors_count;i++){
    if(temperaturesensors[i].gpiopin==pin) return i;
  }
  return -1;
}

int getVRPreValuesPosFromVRSensorType(VRSensorType sensorType){
 for(int i=0;i<vrprevalues_count;i++){
    if(vrprevalues[i].sensorType==sensorType) return i;
  }
  return -1;
}

double calcTemperatureByTempmeasurementtype(TemperatureMeasurementType tempmeasurementtype){
  double rc = 0;
  if(tempmeasurementtype==AVG_SP1_SP2){
    rc = getTemperatureByTempmeasurementtype(SP1);
    rc = rc + getTemperatureByTempmeasurementtype(SP2);
    rc = rc / 2;
  }else{
    rc = getTemperatureByTempmeasurementtype(tempmeasurementtype);
  }
  return rc;
}

double getTemperatureByTempmeasurementtype(TemperatureMeasurementType tempmeasurementtype){
  double rc = 0;
  for(int i=0;i<tempsensors_count;i++){
    if(tempmeasurementtype==temperaturesensors[i].tempmeasurementtype){
      return temperaturesensors[i].Ta;
    }else if(tempmeasurementtype==temperaturesensors[i].tempmeasurementtype){
      return temperaturesensors[i].Ta;
    }
  }
  return rc;
}

double getaAvgTemperatureByTempmeasurementtype(TemperatureMeasurementType tempmeasurementtype){
  double rc = 0;
  for(int i=0;i<tempsensors_count;i++){
    if(tempmeasurementtype==temperaturesensors[i].tempmeasurementtype){
      return temperaturesensors[i].TaAvg;
    }else if(tempmeasurementtype==temperaturesensors[i].tempmeasurementtype){
      return temperaturesensors[i].TaAvg;
    }
  }
  return rc;
}

bool isTemperatureReached(RelaisTimer relaistimer){
  double temperature=calcTemperatureByTempmeasurementtype(relaistimer.tempmeasurementtype);
  if(temperature > relaistimer.temperature_off) return true;
  return false;
}

int getNumberOfTempsensors(){
  return tempsensors_count;
}






