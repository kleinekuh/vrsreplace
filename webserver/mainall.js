/**
 * v3All
 */

"use strict";

class LogTranslate{
	constructor(code, status, message){
		this.code = code;
		this.status = status;
		this.message = message;
	};
	
	getCode(){return this.code;}
	getStatus(){return this.status;}
	getMessage(){return this.message;}
	
}
 
class ModalBox{
	
	constructor (modalid, callback) {
		this.callback = callback;
		this.divModal;
		this.divHeader;
		this.modalid=modalid;
		this.type;
		this.headerText;
		this.contentText;
		this.init();
	}
	
	init(){
		var that = this;
		that.divModal = document.createElement("div");
		that.divModal.setAttribute("id", this.modalid);
		that.divModal.setAttribute("class", "modal");
		
		var divContent = document.createElement("div");
		divContent.setAttribute("class", "modal-content");
		that.divModal.appendChild(divContent);

		that.divHeader = document.createElement("div");
		that.divHeader.setAttribute("class", "modal-header modal_OK");
		
		
		var divSpan = document.createElement("span");
		divSpan.setAttribute("class", "close");
		divSpan.onclick = function () {
			that.closeBox();
		};
		divSpan.innerHTML = "&times;";
		that.divHeader.appendChild(divSpan);
		
		that.headerText = document.createElement("span");
		that.divHeader.appendChild(that.headerText);
		
		divContent.appendChild(that.divHeader);
		
		
		var divBody = document.createElement("div");
		divBody.setAttribute("class", "modal-body");
		that.contentText = document.createElement("p");
		divBody.appendChild(that.contentText);
		divContent.appendChild(divBody);
		
		var divFooter = document.createElement("div");
		divFooter.setAttribute("class", "modal-footer");
		
		var btnClose = document.createElement("button");
		btnClose.setAttribute("class", "button");
		btnClose.innerText ="OK";
		btnClose.onclick = function () {
			that.closeBox();
		};
		divFooter.appendChild(btnClose);
		
		divContent.appendChild(divFooter);
		window.onclick = function(event) {
  			if (event.target == that.divModal) {
    			that.closeBox(); 
  			}
		}
		document.getElementsByTagName("body")[0].appendChild(that.divModal);
	}
 
	
	setModal(error, type, headerText, contentText){
		
		if(error)this.divHeader.setAttribute("class", "modal-header modal_ERROR");
		else this.divHeader.setAttribute("class", "modal-header modal_OK");
		
		this.headerText.innerHTML = headerText;
		this.contentText.innerHTML = contentText;		
		this.type = type;
	}
	
	showBox(){
		this.divModal.style.display = "block";
		this.processCallback("OPEN"); 
	}
	closeBox(){
		this.divModal.style.display = "none";
		this.processCallback("CLOSE", this.type); 
	}
	
	processCallback(event, type){
		if(this.callback==null) return;
		this.callback(event, type);
	};
	
}
 
class Relais{
	constructor () {
		this.pos=-1;
		this.id=-1;
		this.bez;
		this.relais;
		this.time_on;
		this.time_off;
		this.weekdays=new Array(0,0,0,0,0,0,0);
		this.timer_program;
		this.temperature_off;
		this.tempsensor;
		this.hysteresis;
		this.active;
		this.temperature_on;
		this.running_period;
		this.waiting_period;
		this.temperature_difference;
		this.state;
		this.timerstatetype;
	}
	
	setPos(pos){this.pos=pos;}
	getPos(){return this.pos;}
	
	setId(id){this.id=id;}
	getId(){return this.id;}

	setBez(bez){this.bez=bez;}
	getBez(){return this.bez;}
	
	setRelais(relais){this.relais=relais;}
	getRelais(){return this.relais;}

	setTimeOn(time_on){this.time_on=time_on;}
	getTimeOn(){return this.time_on;}

	setTimeOff(time_off){this.time_off=time_off;}
	getTimeOff(){return this.time_off;}

	setTimerProgram(timer_program){this.timer_program=timer_program;}
	getTimerProgram(){return this.timer_program;}

	setTemperatureOff(temperature_off){this.temperature_off=temperature_off;}
	getTemperatureOff(){return this.temperature_off;}

	setTempsensor(tempsensor){this.tempsensor=tempsensor;}
	getTempsensor(){return this.tempsensor;}

	setHysteresis(hysteresis){this.hysteresis=hysteresis;}
	getHysteresis(){return this.hysteresis;}

	setActive(active){this.active=active;}
	getActive(){return this.active;}

	setState(state){this.state=state;}
	getState(){return this.state;}
	
	setWeekday(weekday, active){
		if(active)this.weekdays[weekday]=1;
		else this.weekdays[weekday]=0;
	}
	getWeekday(weekday){
		return this.weekdays[weekday];
	}
	
	setTemperatureOn(temperature_on){this.temperature_on=temperature_on;}
	getTemperatureOn(){return this.temperature_on;}
	
	setRunningPeriod(running_period){this.running_period=running_period;}
	getRunningPeriod(){return this.running_period;}
	
	setWaitingPeriod(waiting_period){this.waiting_period=waiting_period;}
	getWaitingPeriod(){return this.waiting_period;}
	
	setTemperatureDifference(temperature_difference){this.temperature_difference=temperature_difference;}
	getTemperatureDifference(){return this.temperature_difference;}
	
	setTimerstateType(timerstatetype){this.timerstatetype=timerstatetype;}
	getTimerstateType(){return this.timerstatetype;}
	
	setJSON(obj){
		this.setPos(obj.pos);
		this.setId(obj.id);
		this.setBez(obj.bez);
		this.setRelais(obj.relais);
		this.setActive(obj.active);	
		this.setState(obj.state);
		this.setTimerstateType(obj.timerstatetype);
		
		if(null!=obj.tempsensor)this.setTempsensor(obj.tempsensor);
		if(null!=obj.temperature_off)this.setTemperatureOff(obj.temperature_off);
		if(null!=obj.time_on)this.setTimeOn(obj.time_on);
		if(null!=obj.time_off)this.setTimeOff(obj.time_off);
		if(null!=obj.hysteresis)this.setHysteresis(obj.hysteresis);
		if(null!=obj.timer_program)this.setTimerProgram(obj.timer_program);
		if(null!=obj.weekdays){
			for(var i=0;i<7;i++)this.setWeekday(i,obj.weekdays[i]);	
		}
		if(null!=obj.running_period)this.setRunningPeriod(obj.running_period);
		if(null!=obj.waiting_period)this.setWaitingPeriod(obj.waiting_period);
		if(null!=obj.temperature_on)this.setTemperatureOn(obj.temperature_on);
		if(null!=obj.temperature_difference)this.setTemperatureDifference(obj.temperature_difference);
	}
}

class Config{
	constructor () {
		this.ssid;
  		this.password;
  		this.ntpserver;
  		this.lutpath;
  		this.logpath;
  		this.webserverpath;

  		this.temperaturesrt=-1;
  		this.temperaturelwt=-1;
  		this.temperatureswt=-1;
  		this.maxtemperature=-1;
  		
  		this.wificonnectionretries=-1;
  		this.wifireconnectinterval=-1;
  		
  		this.allowcors=false;
  	}
  	
  	setJSON(obj){
		this.setSsid(obj.ssid);
  		this.setPassword(obj.password);
  		this.setNtpserver(obj.ntpserver);
  		this.setLutpath(obj.lutpath);
  		this.setLogpath(obj.logpath);
  		this.setWebserverpath(obj.webserverpath);

  		this.setTemperaturesrt(obj.temperaturesrt);
  		this.setTemperaturelwt(obj.temperaturelwt);
  		this.setTemperatureswt(obj.temperatureswt);
  		
  		this.setMaxTemperature(obj.maxtemperature);
  		this.setWifiConnectionretries(obj.wificonnectionretries);
  		this.setWifiReconnectinterval(obj.wifireconnectinterval);
  		
  		this.setAllowcors(obj.allowcors);
  		
	}
  	
  	
  	setSsid(ssid){this.ssid =ssid;}
	getSsid(){return this.ssid;}  			
  	
  	setPassword(password){this.password =password;}
	getPassword(){return this.password;}  			

  	setNtpserver(ntpserver){this.ntpserver =ntpserver;}
	getNtpserver(){return this.ntpserver;}  			

  	setLutpath(lutpath){this.lutpath =lutpath;}
	getLutpath(){return this.lutpath;}  			

  	setLogpath(logpath){this.logpath =logpath;}
	getLogpath(){return this.logpath;}  			

  	setWebserverpath(webserverpath){this.webserverpath =webserverpath;}
	getWebserverpath(){return this.webserverpath;} 
	
  	setTemperaturesrt(temperaturesrt){this.temperaturesrt =temperaturesrt;}
	getTemperaturesrt(){return this.temperaturesrt;}  
	
	setTemperaturelwt(temperaturelwt){this.temperaturelwt =temperaturelwt;}
	getTemperaturelwt(){return this.temperaturelwt;} 
	
	setTemperatureswt(temperatureswt){this.temperatureswt =temperatureswt;}
	getTemperatureswt(){return this.temperatureswt;}   	

	setMaxTemperature(maxtemperature){this.maxtemperature =maxtemperature;}
	getMaxTemperature(){return this.maxtemperature;}   

	setWifiConnectionretries(wificonnectionretries){this.wificonnectionretries =wificonnectionretries;}
	getWifiConnectionretries(){return this.wificonnectionretries;}   
  	
  	setWifiReconnectinterval(wifireconnectinterval){this.wifireconnectinterval =wifireconnectinterval;}
	getWifiReconnectinterval(){return this.wifireconnectinterval;}
	
	setAllowcors(allowcors){this.allowcors=allowcors;}
	getAllowcors(){return this.allowcors;}   
  	
}


class ConfigForm{
	constructor (formId) {
		this.formId = formId;
		this.config = new Config();
	}
	
	refreshForm(){
		const formData = new FormData();
    	formData.append('ssid', this.config.getSsid());
    	formData.append('password', this.config.getPassword());
    	formData.append('ntpserver', this.config.getNtpserver());
    	
    	formData.append('logpath', this.config.getLogpath());
    	formData.append('webserverpath', this.config.getWebserverpath());
    	formData.append('lutpath', this.config.getLutpath());
    	
    	formData.append('temperatureswt', this.config.getTemperatureswt());
    	formData.append('temperaturelwt', this.config.getTemperaturelwt());
    	formData.append('temperaturesrt', this.config.getTemperaturesrt());
    	formData.append('maxtemperature', this.config.getMaxTemperature());
    	
    	formData.append('wificonnectionretries', this.config.getWifiConnectionretries());
    	formData.append('wifireconnectinterval', this.config.getWifiReconnectinterval());
    	
    	formData.append('allowcors', this.config.getAllowcors());
    	
    	formDeserialize(document.forms[0], formData);
	}
	
	setJSON(obj){
		this.config = new Config();
		this.config.setJSON(obj);
	}
	getJSON(){
		var formData = new FormData(document.getElementById(this.formId));
		this.config.setSsid(encodeURIComponent(formData.get("ssid")));
		this.config.setPassword(encodeURIComponent(formData.get("password")));
		this.config.setNtpserver(encodeURIComponent(formData.get("ntpserver")));
		
		this.config.setTemperatureswt(formData.get("temperatureswt"));
		this.config.setTemperaturelwt(formData.get("temperaturelwt"));
		this.config.setTemperaturesrt(formData.get("temperaturesrt"));
		this.config.setMaxTemperature(formData.get("maxtemperature"));
		
		this.config.setWifiConnectionretries(formData.get("wificonnectionretries"));
		this.config.setWifiReconnectinterval(formData.get("wifireconnectinterval"));
		
		this.config.setAllowcors(formData.get("allowcors"));
		
		var toSend = JSON.stringify(this.config);
		return toSend;
	}
	
}
	
	
class RelaisForm{
	constructor (formId, relaisType) {
		this.formId = formId;
		this.relais = new Relais();
		this.relais.setRelais(relaisType);
	}
	
	setId(id){
		this.relais.setId(id);
	}
	
	refreshForm(){
		const formData = new FormData();
    	formData.append('active', this.relais.getActive());
    	formData.append('bez', this.relais.getBez());
    	formData.append('tempsensor', this.relais.getTempsensor());
    	formData.append('temperature_off', this.relais.getTemperatureOff());

		if(this.relais.getRelais()==1){ // Heating
			formData.append('timer_program', this.relais.getTimerProgram());
			formData.append('time_on', "");
			formData.append('time_off', "");
			formData.append('hysteresis', "");
			for(var i=0;i<7;i++)formData.append(('d'+i), false);
			
			if(this.relais.getTimerProgram()==2){
				for(var i=0;i<7;i++){
					if(this.relais.getWeekday(i)==1){
						formData.append(('d'+i), true);	
					}else{
						formData.append(('d'+i), false);
					}
				}
			}
			if(this.relais.getTimerProgram()!=3){
				formData.append('time_on', getFormatedTime(this.relais.getTimeOn()));
				formData.append('time_off', getFormatedTime(this.relais.getTimeOff()));
				formData.append('hysteresis', this.relais.getHysteresis());
			}
		}else if(this.relais.getRelais()==2){ // SolarPump
			formData.append('running_period', getSecondsFromMilliseconds(this.relais.getRunningPeriod()));
			formData.append('waiting_period', getSecondsFromMilliseconds(this.relais.getWaitingPeriod()));
			formData.append('temperature_on', this.relais.getTemperatureOn());
			formData.append('temperature_difference', this.relais.getTemperatureDifference());
		}
    	formDeserialize(document.forms[0], formData);
	}
	
	setJSON(obj){
		this.relais = new Relais();
		this.relais.setId(obj.id);
		this.relais.setJSON(obj);
	}
	
	getJSON(){
		var formData = new FormData(document.getElementById(this.formId));
		this.relais.setBez(formData.get("bez"));
		if(formData.get("active")!=null)this.relais.setActive(true);
		else this.relais.setActive(false);
		this.relais.setTempsensor(parseInt(formData.get("tempsensor")));
		this.relais.setTemperatureOff(parseInt(formData.get("temperature_off")));
		
		if(this.relais.getRelais()==1){ // Build Heating
			this.relais.setTimeOn(-1);
			this.relais.setTimeOff(-1);
			this.relais.setHysteresis(-1);
			this.relais.setTimerProgram(parseInt(formData.get("timer_program")));
			if(this.relais.getTimerProgram()==2){
				for(var i=0;i<7;i++){
					if(formData.get("d"+i)!=null)this.relais.setWeekday(i, true);
					else this.relais.setWeekday(i, false);
				}
			}
			if(this.relais.getTimerProgram()!=3){ // Values not for PerRequest
				this.relais.setTimeOn(getUnformatedTime(formData.get("time_on")));
				this.relais.setTimeOff(getUnformatedTime(formData.get("time_off")));
				this.relais.setHysteresis(parseInt(parseInt(formData.get("hysteresis"))));
			}
		}else if(this.relais.getRelais()==2){ // Build SolarPump
			this.relais.setRunningPeriod(getMillisecondsFromSeconds(formData.get("running_period")));
			this.relais.setWaitingPeriod(getMillisecondsFromSeconds(formData.get("waiting_period")));
			this.relais.setTemperatureOn(parseInt(formData.get("temperature_on")));
			this.relais.setTemperatureDifference(parseInt(formData.get("temperature_difference")));
		}
		var toSend = JSON.stringify(this.relais);
		return toSend;
	}
}


class RelaisList{

	constructor (divId, callback) {
		this.divId = divId;
		this.callback = callback;
		this.arrRelais = new Array();
		this.timerInterval;
	}
	
	addRelais(relais){
		//if(!this.relaisExists(relais))
		this.arrRelais.push(relais);
	}
	
	clearAll(){
		this.arrRelais = new Array();
		document.getElementById(this.divId).innerHTML = '';
	}
	
	relaisExists(relais){
		//var rc=false;
		for(var i=0;i<this.arrRelais.length;i++){
			if(relais.getActive() == this.arrRelais[i].getActive()){
				if(relais.getRelais() == this.arrRelais[i].getRelais()){
					if(relais.getRelais() == 1){
						if(relais.getTimeOn()==this.arrRelais[i].getTimeOn() &&
						relais.getTimeOff()==this.arrRelais[i].getTimeOff()) rc = true;
					}else if(relais.getRelais() == 2){
						if(relais.getTemperatureOff()==this.arrRelais[i].getTemperatureOff()) rc = true;
					}
				}
			}
		}
		return false;
	}
	
	refreshDiv(){
		var that = this;
		document.getElementById(that.divId).innerHTML = '';
		that.arrRelais.sort( this.compareRelaisList );
		
		for(var i=0;i<that.arrRelais.length;i++){
			var timer = that.arrRelais[i];
			
			var divToAdd=null;
			if(timer.getRelais()==1){
				if(timer.getTimerProgram()==1){
					divToAdd = that.buildTimerHD_Div(timer);
				}else if(timer.getTimerProgram()==2){
					divToAdd = that.buildTimerHW_Div(timer);
				}else if(timer.getTimerProgram()==3){
					divToAdd = that.buildTimerHP_Div(timer);
				}
			}else if(timer.getRelais()==2){
				divToAdd = this.buildTimerP_Div(timer);
			}
			
			if(divToAdd!=null){
				var divTimer = document.createElement("div");
				divTimer.setAttribute("id", "timer"+timer.getId());
				divTimer.innerHTML = divToAdd;
				const id = timer.getId();
				const relais = timer.getRelais();
				divTimer.ondblclick = function(){
					that.processCallback("OPEN", id, relais);
				};
				
				divTimer.onclick = function(e){
					that.processCallback("CLICK", id, relais);
				};
				
				divTimer.ontouchstart = function() {
				    that.timer(300, id, relais);
				};
				
				divTimer.ontouchend = function() {
					clearTimeout(that.timerInterval);
				};				
				
				document.getElementById(that.divId).appendChild(divTimer);
				if(document.getElementById('start'+id) != null){
					if(timer.getActive()){
						document.getElementById('start'+id).onclick = function () {
							that.processCallback("START", id);
						};
					}
				}
				if(document.getElementById('stop'+id) != null){
					if(timer.getActive()){
						document.getElementById('stop'+id).onclick = function () {
							that.processCallback("STOP", id);
						};
					}
				}
			}
		}
	}
	
	timer(interval, id, relais) {
	    interval--;
	    var that = this;
	    if (interval >= 0) {
    	    this.timerInterval = setTimeout(function() {
				that.timer(interval, id, relais);
			});
    	} else {
    		that.processCallback("OPEN", id, relais);
    	}

	}
	
	buildTimerHD_Div(relais){ // Heating daily
	 	var timer = "";
		var active="";
		if(!relais.getActive())active="inactive";
 		timer = timer+ "<div class=\"panel heat\" id="+relais.getId()+">";
		timer = timer+ "<div class=\"content-div\"> ";
		if(relais.getState()){
			if(relais.getTimerstateType() == 1)timer = timer+ "<div class=\"processActive\"></div> ";
			else if(relais.getTimerstateType() == 3)timer = timer+ "<div class=\"processWait\"></div> ";
		}
		timer = timer+ "</div>";
		
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_heating icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext "+active+" \" ><span>"+relais.getBez()+"</span></div>";
		timer = timer+ "</div>";
		timer = timer+ "<div class=\"content-spacer\"></div>";
		
		
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"table-body-cell icon_clock_start icon\"></div>";
		timer = timer+ "<div class=\"table-body-cell defaulttext\"><span>"+getFormatedTime(relais.getTimeOn())+"</span></div>";
		timer = timer+ "</div>";
	
		timer = timer+ "<div class=\"content-div\">";  
		timer = timer+ "<div class=\"table-body-cell icon_clock_end icon\"></div>";
		timer = timer+ "<div class=\"table-body-cell defaulttext\"><span>"+getFormatedTime(relais.getTimeOff())+"</span></div>";
		timer = timer+ "</div>";
		
		timer = timer+ "<div class=\"content-bottom\">";
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_temp icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext\"><span>"+relais.getTemperatureOff()+"&deg; - "+getFormatedTempSensors(relais.getTempsensor())+"</span></div>";
		timer = timer+ "</div>";
		timer = timer+ "</div>";
		
		timer = timer+ "</div>";
		return timer;
	}
	
	buildTimerHW_Div(relais){ // Heating weekdays
		var timer = "";
		var active="";
		
		if(!relais.getActive())active="inactive";
 		timer = timer+ "<div class=\"panel heat\" id="+relais.getId()+">";
		timer = timer+ "<div class=\"content-div\"> ";
		if(relais.getState()){
			if(relais.getTimerstateType() == 1)timer = timer+ "<div class=\"processActive\"></div> ";
			else if(relais.getTimerstateType() == 3)timer = timer+ "<div class=\"processWait\"></div> ";
		}
		timer = timer+ "</div>";
		
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_heating icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext "+active+" \" ><span>"+relais.getBez()+"</span></div>";
		timer = timer+ "</div>";
		timer = timer+ "<div class=\"content-spacer\"></div>";
		
		
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"table-body-cell icon_clock_start icon\"></div>";
		timer = timer+ "<div class=\"table-body-cell defaulttext\"><span>"+getFormatedTime(relais.getTimeOn())+"</span></div>";
		timer = timer+ "</div>";
	
		timer = timer+ "<div class=\"content-div\">";  
		timer = timer+ "<div class=\"table-body-cell icon_clock_end icon\"></div>";
		timer = timer+ "<div class=\"table-body-cell defaulttext\"><span>"+getFormatedTime(relais.getTimeOff())+"</span></div>";
		timer = timer+ "</div>";
		
		timer = timer+ "<div class=\"content-spacer\"></div>";
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div> ";  		
		
		for(var i=0;i<7;i++){
			if(relais.getWeekday(i)==1){
				timer = timer+ "<span class=\"dailytext active\" >"+getWeekdayFromDay(i)+"</span> ";
			}else{
				timer = timer+ "<span class=\"dailytext\" >"+getWeekdayFromDay(i)+"</span> ";
			}
		}
		timer = timer+ "</div>";
		timer = timer+ "</div>";
		
		timer = timer+ "<div class=\"content-bottom\">";
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_temp icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext\"><span>"+relais.getTemperatureOff()+"&deg; - "+getFormatedTempSensors(relais.getTempsensor())+"</span></div>";
		timer = timer+ "</div>";
		timer = timer+ "</div>";
		
		timer = timer+ "</div>";
		return timer;
	}
	
	buildTimerHP_Div(relais){ // Heating per request
		var timer = "";
		var active="";
		
		if(!relais.getActive())active="inactive";
 		timer = timer+ "<div class=\"panel heat\" id="+relais.getId()+">";
		timer = timer+ "<div class=\"content-div\"> ";
		if(relais.getState()){
			if(relais.getTimerstateType() == 1)timer = timer+ "<div class=\"processActive\"></div> ";
			else if(relais.getTimerstateType() == 3)timer = timer+ "<div class=\"processWait\"></div> ";
		}
		timer = timer+ "</div>";
		
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_heating icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext "+active+" \" ><span>"+relais.getBez()+"</span></div>";
		timer = timer+ "</div>";
		timer = timer+ "<div class=\"content-spacer\"></div>";
		
		timer = timer+ "<div class=\"content-icon\" > ";
		if(relais.getState()) timer = timer+ "<div id='stop"+relais.getId()+"' class=\"table-body-cell icon_stop\"></div> ";
		else timer = timer+ "<div id='start"+relais.getId()+"' class=\"table-body-cell icon_start\"></div> ";
		timer = timer+ "</div> ";
		 
		timer = timer+ "<div class=\"content-bottom\">";
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_temp icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext\"><span>"+relais.getTemperatureOff()+"&deg; - "+getFormatedTempSensors(relais.getTempsensor())+"</span></div>";
		timer = timer+ "</div>";
		timer = timer+ "</div>";
		timer = timer+ "</div>";
		
		return timer;
	}

	
	buildTimerP_Div(relais){ 
		var timer = ""; 
		var active="";
		
		if(!relais.getActive())active="inactive";
		timer = timer+ "<div class=\"panel pump\" id="+relais.getId()+">";
		timer = timer+ "<div class=\"content-div\"> ";
		if(relais.getState()){
			if(relais.getTimerstateType() == 1)timer = timer+ "<div class=\"processActive\"></div> ";
			else if(relais.getTimerstateType() == 3)timer = timer+ "<div class=\"processWait\"></div> ";
		}
		timer = timer+ "</div> ";
		
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_pump icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext "+active+" \" ><span>"+relais.getBez()+"</span></div>";
		timer = timer+ "</div>";
		timer = timer+ "<div class=\"content-spacer\"></div>";
		
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_clock icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext\" ><span>"+getSecondsFromMilliseconds(relais.getRunningPeriod())+"s</span></div>";
		timer = timer+ "</div>";
		
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_clock_wait icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext\" ><span>"+getSecondsFromMilliseconds(relais.getWaitingPeriod())+"s</span></div>";
		timer = timer+ "</div>";

		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_temperature_start icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext\" ><span>"+relais.getTemperatureOn()+"&deg;</span></div>";
		timer = timer+ "</div>";
	
		timer = timer+ "<div class=\"content-bottom\">";
		timer = timer+ "<div class=\"content-div\"> ";
		timer = timer+ "<div class=\"content-cell icon_temp icon\"></div>";
		timer = timer+ "<div class=\"content-cell defaulttext\"><span>"+relais.getTemperatureOff()+"&deg; - "+getFormatedTempSensors(relais.getTempsensor())+"</span></div>";
		timer = timer+ "</div>";
		timer = timer+ "</div>";
		timer = timer+ "</div>";
		
		return timer;
	}
	
	processCallback(event, id, relais){
		if(this.callback==null) return;
		this.callback(this.divId, event, id, relais);
	};
	
	compareRelaisList( a, b ) {
		if ( a.relais < b.relais ) return -1;
		if ( a.relais > b.relais ) return 1;
  		return 0;
	}
	
}


class GaugeCharts{
	constructor(idkol1, idsp1, idsp2){
		this.idkol1 = idkol1;
		this.idsp1 = idsp1;
		this.idsp2 = idsp2;
		this.gkol1;
		this.gsp1;
		this.gsp2;
		this.buildCharts();
	}
	
	buildCharts(){
		this.gkol1 = Gauge(
			document.getElementById(this.idkol1),	
		    {
		      min: 0,
		      max: 130,
		      ddialStartAngle: 180,
		      ddialEndAngle: 0,
		      value: 0,
		      label: function(value) {
				return Math.round(value) + " \u2103";// + "%0A" ;
			  },
			  showValue: true,
		      viewBox: "0 0 100 90",
		      color: function(value) {
		        if(value < 30) {
		          return "#009af8"; // blau
		        }else if(value < 40) {
		          return "#c09731";
		        }else if(value < 50) {
		        	return "#f7aa38";
		        }else if(value < 60) {
		          return "#f7aa38";
		        }else {
		          return "#ef4655";
		        }
		      }
		    }
		);
		this.gsp1 = Gauge(
			document.getElementById(this.idsp1),
		    {
		      min: 0,
		      max: 100,
		      ddialStartAngle: 180,
		      ddialEndAngle: 0,
		      value: 0,
		      label: function(value) {
				return Math.round(value) + " \u2103";// + "%0A" ;
			  },
			  showValue: true,
		      viewBox: "0 0 100 90",
		      color: this.getSPColors,
		    }
		 );
		this.gsp2 = Gauge(
			document.getElementById(this.idsp2),
		    {
		      min: 0,
		      max: 100,
		      ddialStartAngle: 180,
		      ddialEndAngle: 0,
		      value: 0,
		      label: function(value) {
				return Math.round(value) + " \u2103";// + "%0A" ;
			  },
			  showValue: true,
		      viewBox: "0 0 100 90",
		      color: this.getSPColors,
		    }
		 );		 		
	}
	
	
	getSPColors(value){
	    if(value < 30) {
    	  return "#009af8"; // blau
    	}else if(value < 40) {
      		return "#c09731";
        }else if(value < 50) {
        	return "#f7aa38";
        }else if(value < 60) {
          return "#f7aa38";
        }else {
          return "#ef4655";
        }
	}
	
	updateValues(jsonData){
		if(jsonData[0].Ta <130 && jsonData[0].Ta > -20) this.gkol1.setValue(jsonData[0].Ta);
		else this.gkol1.setValue(0);
		
		if(jsonData[1].Ta <130 && jsonData[1].Ta > -20){
			 this.gsp1.setValue(jsonData[1].Ta);
		}
		if(jsonData[2].Ta <130 && jsonData[2].Ta > -20){
			 this.gsp2.setValue(jsonData[2].Ta);
		}
	}

}

class LineChart{
 
	constructor (divId, timezone, callback) {
		this.divId = divId;
		this.callback = callback;
		this.data=new Array();
		
		this.format = new Intl.DateTimeFormat(timezone, { timeZone: 'Europe/Berlin', hour:'numeric',minute:'numeric'}).format;
		this.hours = new Array();
		this.init();
		this.buildChart();
		this.u;
	}
	
	init(){
		var t = 0;
		for(var i=0;i<25;i++){
			this.hours.push(t);
			t = t + 3600;
		}
	}
	
	utcDate(ts) {
		return uPlot.tzDate(new Date(ts * 1e3), 'Etc/UTC');
	}
 
 	buildChart(){
		var ts = this.hours;
		const opts = {
			width: 800,
			height: 300,
			tzDate: ts => uPlot.tzDate(new Date(ts * 1e3), 'Etc/UTC'),
			plugins: [
				this.columnHighlightPlugin(),
			],
			axes: [{
	    		values: (u, splits) => splits.map(ts => this.format(this.utcDate(ts))),
	  		},
	  		{	
	  			scale: 'y',
	    		values: (u, vals, space) => vals.map(v => v + '\u2103'),
	    		
	  		}],
			series: [
				{ 
					label: "Stunde",
					value: this.formatTime,

				},
				{
					stroke: "#6d99ce",
					width: 2,
					label: "KOL1",
					value: this.formatTemperature,
				},
				{
					stroke: "#C0C0C0",
					width: 2,
					label: "SP1",
					value: this.formatTemperature,
				},
				{
					stroke: "#9a9a9a",
					width: 2,
					label: "SP2",
					value: this.formatTemperature,
				},
			],
			scales: {
				"x": {
				      distr: 2,
				      time: true,
				      label: "Stunde",
				      
				    },
				"y": {
			  		range: [0,120],
			    }
			  },
			  legend: {
				live: true,
			  }
		};
		this.data = [
			this.hours,
			Array(25).fill(0),
			Array(25).fill(0),
			Array(25).fill(0)
		];
		this.u = new uPlot(opts, this.data, document.getElementById(this.divId));
		this.u.setSize(getLcSize(this.divId));
		
		window.addEventListener("resize", e => {
			this.u.setSize(getLcSize(this.divId));
		});
	}
	
 
	
	formatTemperature(self, rawValue){
		if(null!=rawValue) return ""+rawValue.toFixed(0)+ " \u2103";
		else return null;
	}
	
	formatTime(self, rawValue){
		var date = uPlot.tzDate(new Date(rawValue * 1e3), 'Etc/UTC');
		if(null==rawValue) return "";
		var hour = ""+date.getHours();
		if(hour.length==1)hour = "0"+hour;
		return hour+":00";
	}
	
	
	updateValues(jsonData){
		var acthour = new Date().getHours();
		for(var i=0;i<24;i++){
			if(jsonData[0].TaMaxH[i] <130 && jsonData[0].TaMaxH[i] > -20){
				this.data[1][i]=jsonData[0].TaMaxH[i];
				if(i==0)this.data[1][24]=jsonData[0].TaMaxH[i];
			/*}else{
				this.data[1][i]=0;
				*/
			}
			if(jsonData[1].TaMaxH[i] <130 && jsonData[1].TaMaxH[i] > -20){
				this.data[2][i]=jsonData[1].TaMaxH[i];
				if(i==0)this.data[2][24]=jsonData[1].TaMaxH[i];
			}
			if(jsonData[2].TaMaxH[i] <130 && jsonData[2].TaMaxH[i] > -20){
				this.data[3][i]=jsonData[2].TaMaxH[i];
				if(i==0)this.data[3][24]=jsonData[2].TaMaxH[i];
			}
		}
		
		for(var i=acthour+1;i<24;i++){
			if(jsonData[0].TaMaxHY[i] <130 && jsonData[0].TaMaxHY[i] > -20){
				this.data[1][i]=jsonData[0].TaMaxHY[i];
			}else{
				this.data[1][i-1]=0;
			}
			if(jsonData[1].TaMaxHY[i] <130 && jsonData[1].TaMaxHY[i] > -20){
				this.data[2][i]=jsonData[1].TaMaxHY[i];
			}
			if(jsonData[2].TaMaxHY[i] <130 && jsonData[2].TaMaxHY[i] > -20){
				this.data[3][i]=jsonData[2].TaMaxHY[i];
			}
		}
		
		
		
		this.u.setData(this.data);
	}
	
	
	columnHighlightPlugin({ className } = {}) {
		let underEl, overEl, highlightEl, currIdx, highlightEr;
		
		function init(u) {
			underEl = u.under;
			overEl = u.over;
			highlightEl = document.createElement("div");
			highlightEr = document.createElement("div");
			className && highlightEl.classList.add(className);
			className && highlightEr.classList.add(className);

			uPlot.assign(highlightEl.style, {
				pointerEvents: "none",
				position: "absolute",
				left: 0,
				top: 0,
				height: "100%",
				backgroundColor: "rgba(210, 43, 43, 1.5)"
			});
		
			uPlot.assign(highlightEr.style, {
				pointerEvents: "none",
				//display: "none",
				position: "absolute",
				left: 0,
				top: 0,
				height: "100%",
				backgroundColor: "rgba(10, 43, 43,0.1)"
			});

			underEl.appendChild(highlightEl);
			underEl.appendChild(highlightEr);

		}
		
		function applyHoursLine(u){
			const d = new Date();
			const hour = d.getHours();
			const width = 2;
			const left  = u.valToPos(hour, "x") - width / 2;
			highlightEl.style.transform = "translateX(" + Math.round(left) + "px)";
			highlightEl.style.width = Math.round(width) + "px";
			const xwidth = u.bbox.width ;
			const xleft  = u.valToPos(hour, "x");
			highlightEr.style.transform = "translateX(" + Math.round(xleft) + "px)";
			highlightEr.style.width = Math.round(xwidth) + "px";
		}	
		
		return {
			opts: (u, opts) => {
				uPlot.assign(opts, {
					cursor: {
						x: false,
						y: false,
					}
				});
			},
			hooks: {
				init: init,
				draw: applyHoursLine
			}
		};
	}

}



class LineChartOld{
 
	constructor (divId, timezone, callback) {
		this.divId = divId;
		this.callback = callback;
		this.data=new Array();
		
		this.format = new Intl.DateTimeFormat(timezone, { timeZone: 'Europe/Berlin', hour:'numeric',minute:'numeric'}).format;
		this.hours = new Array();
		this.init();
		this.buildChart();
		this.u;
	}
	
	init(){
		var t = 0;
		for(var i=0;i<24;i++){
			this.hours.push(t*1000);
			t = t + 3600;
		}
	}
 
 	buildChart(){
		var ts = this.hours;
		const opts = {
			width: 800,
			height: 300,
			axes: [{
	    		values: (u, splits) => splits.map(ts => this.format((ts))),
	  		},
	  		{	
	  			scale: 'y',
	    		values: (u, vals, space) => vals.map(v => v + '\u2103'),
	    		
	  		}],
			series: [
				{ 
					label: "Stunde",
					value: this.formatTime,

				},
				{
					stroke: "#6d99ce",
					width: 2,
					label: "KOL1",
					value: this.formatTemperature,
				},
				{
					stroke: "#C0C0C0",
					width: 2,
					label: "SP1",
					value: this.formatTemperature,
				},
				{
					stroke: "#9a9a9a",
					width: 2,
					label: "SP2",
					value: this.formatTemperature,
				},
			],
			scales: {
				"x": {
				      distr: 2,
				      time: true,
				      label: "Stunde",
				      
				    },
				"y": {
			  		range: [0,120],
			    }
			  },
			  legend: {
					 
					live: true,
			  }
		};
		this.data = [
			this.hours,
			Array(24).fill(0),
			Array(24).fill(0),
			Array(24).fill(0)
		];
		this.u = new uPlot(opts, this.data, document.getElementById(this.divId));
		this.u.setSize(getLcSize(this.divId));
		
		window.addEventListener("resize", e => {
			this.u.setSize(getLcSize(this.divId));
		});
	}
	
 
	
	formatTemperature(self, rawValue){
		//rawValue.toFixed(0)+ ' ° C';
		if(null!=rawValue) return ""+rawValue.toFixed(0)+ " \u2103";
		else return null;
	}
	
	formatTime(self, rawValue){
		var date = new Date(rawValue);
		if(null==rawValue) return "";
		var hour = ""+date.getHours();
		if(hour.length==1)hour = "0"+hour;
		return hour+":00";
	}
	
	
	updateValues(jsonData){

		for(var i=0;i<24;i++){
			if(jsonData[0].TaMaxH[i] <130 && jsonData[0].TaMaxH[i] > -20){
				this.data[1][i-1]=jsonData[0].TaMaxH[i];
			}else{
				this.data[1][i-1]=0;
			}
			if(jsonData[1].TaMaxH[i] <130 && jsonData[1].TaMaxH[i] > -20){
				this.data[2][i-1]=jsonData[1].TaMaxH[i];
			}
			if(jsonData[2].TaMaxH[i] <130 && jsonData[2].TaMaxH[i] > -20){
				this.data[3][i-1]=jsonData[2].TaMaxH[i];
			}
		}
		this.u.setData(this.data);
	}
	
	

}



// -----------------------------------
// Default Functions not only class relevant 

var logmessages = new Array();
function initLogTranslate(){
	logmessages.push(new LogTranslate(100, "OK", "System %1 gestartet"));
	logmessages.push(new LogTranslate(101, "OK", "Tageswechsel"));

	logmessages.push(new LogTranslate(110, "Error", "Unbekannter Systemaufruf"));
	logmessages.push(new LogTranslate(111, "OK", "System neu gestartet"));
	
	logmessages.push(new LogTranslate(112, "OK", "NTP Uhrzeit aktualisiert"));
	logmessages.push(new LogTranslate(113, "OK", "Firmware aktualtisiert"));
	logmessages.push(new LogTranslate(114, "ERROR", "Firmware konnte nicht aktualisiert werden"));
	
	logmessages.push(new LogTranslate(115, "OK", "ADC-Wandler erfolgreich deaktiviert"));
	logmessages.push(new LogTranslate(116, "ERROR", "ADC-Wandler konnten nicht deaktiviert werden"));
	
	logmessages.push(new LogTranslate(117, "OK", "Einstellungen gespeichert"));
	logmessages.push(new LogTranslate(118, "OK", "Einstellungen wurden erfolgreich gepseichert. Neustart erforderlich."));
	logmessages.push(new LogTranslate(119, "OK", "System wurde erfolgreich zur&uuml;ckgesetzt"));
	logmessages.push(new LogTranslate(120, "ERROR", "Einstellungen konnten nicht gespeichert werden"));
	
	
	logmessages.push(new LogTranslate(121, "ERROR", "Lut file <b>\"%1\"</b> konnte nicht gefunden werden"));
	logmessages.push(new LogTranslate(122,  "Keine SD Karte vorhanden und/oder nicht beschreibbar"));
	
	logmessages.push(new LogTranslate(125, "ERROR", "WiFi Verbindung unterbrochen"));
	logmessages.push(new LogTranslate(126, "OK", "WiFi Verbindung %1 wieder hergestellt"));
	logmessages.push(new LogTranslate(127, "OK", "System wurde im Config-Modus %1 gestartet "));
	
	
	logmessages.push(new LogTranslate(180, "OK", "Uhrzeit vom NTP-Server aktualisiert"));
	logmessages.push(new LogTranslate(181, "ERROR", "Uhrzeit konnte nicht gesetzt werden"));
		
	logmessages.push(new LogTranslate(200, "OK", "Timer <b>\"%2\"</b> gestartet"));
	logmessages.push(new LogTranslate(201, "OK", "Timer <b>\"%2\"</b> gestoppt"));
	logmessages.push(new LogTranslate(202, "OK", "Timer <b>\"%2\"</b> wurde in den Wait-State vesetzt"));
	logmessages.push(new LogTranslate(203, "OK", "Timer <b>\"%2\"</b> wurde restartet"));
	logmessages.push(new LogTranslate(204, "OK", "Alle Timer wurden gel&ouml;scht"));
	logmessages.push(new LogTranslate(205, "ERROR", "Timer konnten nicht gel&ouml;scht werden"));
	logmessages.push(new LogTranslate(206, "OK", "Timer <b>\"%2\"</b> wurde gel&ouml;scht"));
	logmessages.push(new LogTranslate(207, "OK", "Heitzungstimer <b>\"%2\"</b> hinzugef&uuml;gt"));
	logmessages.push(new LogTranslate(208, "OK", "Timer f&uuml;r Solarsteuerung <b>\"%2\"</b> hinzugef&uuml;gt"));
	logmessages.push(new LogTranslate(209, "OK", "Timer f&uuml;r Zirkulationspumpe <b>\"%2\"</b> hinzugef&uuml;gt"));
	logmessages.push(new LogTranslate(210, "OK", "Heitzungstimer   <b>\"%2\"</b> ge&auml;ndert"));
	logmessages.push(new LogTranslate(211, "OK", "Parameter f&uuml;r Solarsteuerung <b>\"%2\"</b> ge&auml;ndert"));
	logmessages.push(new LogTranslate(212, "OK", "Schaltzeiten f&uuml;r Zirkulationspumpe <b>\"%2\"</b> ge&auml;ndert"));
	
	logmessages.push(new LogTranslate(300, "ERROR", "Timer konnte nicht gesartet werden, da kein ID Parameter im Aufruf vorhanden"));
	logmessages.push(new LogTranslate(301, "ERROR", "Timer konnte nicht gestartet werden, da ID nicht vorhanden")); 	
	logmessages.push(new LogTranslate(302, "ERROR", "Timer mit der &uuml;bergebenen ID, wurde bereits gestartet")); 	
	logmessages.push(new LogTranslate(303, "ERROR", "Ein Timer mit dem gew&auml;hlten Relais-Type, wurde bereits gestaetet")); 	
	logmessages.push(new LogTranslate(304, "OK", "Timer <b>\"%2\"</b> wurde deaktiviert")); 	
	logmessages.push(new LogTranslate(305, "OK", "Timer <b>\"%2\"</b> gestartet"));
	logmessages.push(new LogTranslate(306, "ERROR", "Timer konnte nicht gestopt werden, kein ID Parameter im Aufruf vorhanden"));
	logmessages.push(new LogTranslate(307, "OK", "Timer <b>\"%2\"</b> gestoppt")); 	
	logmessages.push(new LogTranslate(308, "ERROR", "Timer konnte nicht gestopt werden, da kein laufender Timer mit der ID gefunden wurde"));
	logmessages.push(new LogTranslate(309, "ERROR", "Timer(s) konnten nicht gel&ouml;scht werden, keine ID's &uuml;bergeben")); 	
	logmessages.push(new LogTranslate(310, "ERROR", "Genereller Fehler beim L&ouml;schen der Timer <b>\"%1\"</b>"));	
	logmessages.push(new LogTranslate(311, "OK", "Timer(s) erfolgreich gel&ouml;scht"));
	logmessages.push(new LogTranslate(312, "ERROR", "Timer nicht gefunden. ID nicht vorhanden")); 	
	logmessages.push(new LogTranslate(313, "ERROR", "Timer nicht gefunden. Keine ID beim Aufruf uuml;bergeben")); 	
	logmessages.push(new LogTranslate(314, "ERROR", "Timer konnte nicht ge&auml;ndert werden. Es wurde kein Timer &uuml;bergeben")); 	
 	logmessages.push(new LogTranslate(315, "ERROR", "Genereller Fehler beim &Auml;dern des Timers <b>\"%1\"</b>"));
	logmessages.push(new LogTranslate(316, "OK", "Timer <b>\"%2\"</b> hinzugef&uuml;gt"));
	logmessages.push(new LogTranslate(317, "OK", "Timer <b>\"%2\"</b> ge&auml;ndert"));
						
	logmessages.push(new LogTranslate(340, "OK", "Webservice Connect ID:%1 von %2"));
	logmessages.push(new LogTranslate(341, "OK", "Erfolgreiche Abmeldung von Client ID:%1"));

	logmessages.push(new LogTranslate(350, "OK", "Firmwareupdate gestartet"));
	logmessages.push(new LogTranslate(351, "ERROR", "Fehler beim Firmwareupdate"));
	logmessages.push(new LogTranslate(352, "OK", "Firmwareupdate erfolgreich ausgef&uuml;hrt."));
	
}


function formDeserialize(form, data) {
	for (const [key, val] of (new URLSearchParams(data)).entries()) {
    	const input = form.elements[key];
    	if (input.type === 'checkbox') {
			if(val=='true'){
      			input.checked = true;
      		}else{
				input.checked = false;
			}
    	} else {
      		input.value = val;
    	}
  	}
}

function getFormatedTempSensors(tempsensor){
	if(tempsensor==1) return "SP1";
	else if(tempsensor==2) return "SP2";
	else if(tempsensor==3) return "avg";
	return NA;
}

	
function getFormatedTime(input){
	if(input==-1) return "";
	var output = ""+input;
	if(output=="0") output="000000";
    if(output.length<6)output = "0"+output;
    var hours = output.substring(0,2);
    var minutes = output.substring(2,4);
    return hours+":"+minutes;
}

function getUnformatedTime(input){
	var output = input;
	if(output=='') return -1;
	output = output.replaceAll(":", "");
	if(output.length<=4)output=output+"00";
	return parseInt(output);
}

function getMillisecondsFromSeconds(input){
	var output = input;
	if(output=='') return -1;
	output = parseInt(output)*1000;
	return parseInt(output);
}

function  getSecondsFromMilliseconds(input){
	var output = input;
	if(output=='') return -1;
	output = parseInt(output)/1000;
	return parseInt(output);
}

function getWeekdayFromDay(day){
	if(day==0) return "MO";
	if(day==1) return "DI";
	if(day==2) return "MI";
	if(day==3) return "DO";
	if(day==4) return "FR";
	if(day==5) return "SA";
	if(day==6) return "SO";
	return "NA";
}


function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

function getFormatedJSDate(date, time){
	var year = date.substring(0,4);
	var month = date.substring(4,6);
	var day = date.substring(6);
	
	if(time==0 || time=="0")time="000000";
	var hours = time.substring(0,2);
	var minutes = time.substring(2, 4);
	var seconds = time.substring(4);
	return day+"."+month+"."+year+ " "+hours+":"+minutes+":"+seconds;
}
 

function addLogTemplate(){
	htmx.defineExtension('log-template', {
		transformResponse : function(text, xhr, elt) {
			if(null!=text){
			  var json = JSON.parse(text);
			  
			  
			  var jsonLength = json.length;
			  var offset=0;
			  if(jsonLength-10>0){
				  offset=jsonLength-10;
			  }
			  var rc="";
			  
			  for(var i=offset;i<json.length;i++){
				if(i%2==0) rc = rc+ "<div class=\"content-row\">";
				else rc = rc+ "<div class=\"content-row even\">";
				rc = rc+ "<div class=\"content-cell defaultlogtext\">";
				var date = ""+json[i].date;
				var time = ""+json[i].time;

				if(time.length<6)time = "0"+time;
  				rc = rc + "<span>"+getFormatedJSDate(date, time)+"</span>";
 				rc = rc+ "</div>";
 				
 				var logmessage=null;
 				for(var j=0;j<logmessages.length;j++){
					if(logmessages[j].getCode()==json[i].code){
						logmessage = logmessages[j];
						break;
					}
				}
				
				if(null!=logmessage){
					
					rc = rc+ "<div class=\"content-cell defaultlogtext\">";
					if(logmessage.getStatus()=="OK")rc = rc + "<span>OK</span>";
					else rc = rc + "<span>ERROR</span>";
					rc = rc+ "</div>";
					
					var textMessage = logmessage.getMessage();
					if(json[i].message != ""){
						var fragments = json[i].message.split("|");
						for(var k=0;k<fragments.length;k++) textMessage = textMessage.replace("%"+(k+1),fragments[k]);
					}
					
					rc = rc+ "<div class=\"content-cell defaultlogtext\">";
					rc = rc + "<span>"+textMessage+"</span>";
					rc = rc+ "</div>";
					
					
					
				}else{
					rc = rc+ "<div class=\"content-cell defaultlogtext\">";
					if(json[i].status==1)rc = rc + "<span>OK</span>";
					else rc = rc + "<span>ERROR</span>";
					rc = rc+ "</div>";
				 
					rc = rc+ "<div class=\"content-cell defaultlogtext\">";
					rc = rc + "<span>"+json[i].function+"</span>";
					rc = rc+ "</div>";
				 
					rc = rc+ "<div class=\"content-cell defaultlogtext\">";
					rc = rc + "<span>"+json[i].message+"</span>";
					rc = rc+ "</div>";
				}
				rc = rc+ "<div style=\"	display: table-cell;width:100%\">&nbsp;</div>";
				rc = rc+ "</div>";
				document.getElementById("loglist").innerHTML = rc;
			  }
			}
			return '';
	  	}
	});
}

function getLogMessageByCode(code){
	var logmessage=null;
 	for(var j=0;j<logmessages.length;j++){
		if(logmessages[j].getCode()==code){
			logmessage = logmessages[j];
			break;
		}
	}
	return logmessage;
}

function buildLogTextByCode(json){
	var logmessage=null;
	for(var j=0;j<logmessages.length;j++){
		if(logmessages[j].getCode()==json.code){
			logmessage = logmessages[j];
			break;
		}
	}
	if(null!=logmessage){
		var textMessage = logmessage.getMessage();
		if(json.message != ""){
			var fragments = json.message.split("|");
			for(var k=0;k<fragments.length;k++) textMessage = textMessage.replace("%"+(k+1),fragments[k]);
		}
		return textMessage;
	}
	return null;
}

 


function addRelaisTemplate(){
	htmx.defineExtension('relais-template', {
	 	transformResponse : function(text, xhr, elt) {
			if(null!=text){
			  var data = JSON.parse(text);
			  relaisList.clearAll();
			  for (let i = 0; i < data.length; i++) {
  				var relais = new Relais();
  				relais.setJSON(data[i]);
  				relaisList.addRelais(relais);
  			  }
			  relaisList.refreshDiv();
			}
			return '';
	  	}
	});
}

function addStatusTemplate(){
	htmx.defineExtension('status-template', {
		transformResponse : function(text, xhr, elt) {
			if(null!=text){
			  var data = JSON.parse(text);
			  var rc="V"+data.version;
			  rc = rc +" / " + data.timestamp;
			  if(data.sd) rc = rc + " / SDCard: aktiv";
			  else rc = rc + " / SDCard: inaktiv";
			  return rc;
			}
			return '';
		  }
	});
}

function getLcSize(divid) {
	var gs = document.getElementById(divid);
	return {
		width: gs.getBoundingClientRect().width,
		height: gs.getBoundingClientRect().height-40,
	}
}

// Start Gauge Charts
!function(e){var t,o,F,S,n=(o=(t=e).document,F=Array.prototype.slice,S=t.requestAnimationFrame||t.mozRequestAnimationFrame||t.webkitRequestAnimationFrame||t.msRequestAnimationFrame||function(e){return setTimeout(e,1e3/60)},function(){var r="http://www.w3.org/2000/svg",M={centerX:50,centerY:50},k={dialRadius:40,dialStartAngle:135,dialEndAngle:45,value:0,max:100,min:0,valueDialClass:"value",valueClass:"value-text",dialClass:"dial",gaugeClass:"gauge",showValue:!0,gaugeColor:null,label:function(e){return Math.round(e)}};function V(e,t,n){var a=o.createElementNS(r,e);for(var i in t)a.setAttribute(i,t[i]);return n&&n.forEach(function(e){a.appendChild(e)}),a}function R(e,t){return e*t/100}function E(e,t,n){var a=Number(e);return n<a?n:a<t?t:a}function q(e,t,n,a){var i=a*Math.PI/180;return{x:Math.round(1e3*(e+n*Math.cos(i)))/1e3,y:Math.round(1e3*(t+n*Math.sin(i)))/1e3}}return function(e,r){r=function(){var n=arguments[0];return F.call(arguments,1).forEach(function(e){for(var t in e)e.hasOwnProperty(t)&&(n[t]=e[t])}),n}({},k,r);var o,l,t,n=e,s=r.max,u=r.min,a=E(r.value,u,s),c=r.dialRadius,d=r.showValue,f=r.dialStartAngle,v=r.dialEndAngle,i=r.valueDialClass,m=r.valueClass,g=(r.valueLabelClass,r.dialClass),h=r.gaugeClass,p=r.color,w=r.label,x=r.viewBox;if(f<v){console.log("WARN! startAngle < endAngle, Swapping");var A=f;f=v,v=A}function y(e,t,n,a){var i=function(e,t,n){var a=M.centerX,i=M.centerY;return{end:q(a,i,e,n),start:q(a,i,e,t)}}(e,t,n),r=i.start,o=i.end,l=void 0===a?1:a;return["M",r.x,r.y,"A",e,e,0,l,1,o.x,o.y].join(" ")}function b(e,t){var n=function(e,t,n){return 100*(e-t)/(n-t)}(e,u,s),a=R(n,360-Math.abs(f-v)),i=a<=180?0:1;d&&(o.textContent=w.call(r,e)),l.setAttribute("d",y(c,f,a+f,i))}function C(e,t){var n=p.call(r,e),a=1e3*t,i="stroke "+a+"ms ease";l.style.stroke=n,l.style["-webkit-transition"]=i,l.style["-moz-transition"]=i,l.style.transition=i}return t={setMaxValue:function(e){s=e},setValue:function(e){a=E(e,u,s),p&&C(a,0),b(a)},setValueAnimated:function(e,t){var n=a;a=E(e,u,s),n!==a&&(p&&C(a,t),function(e){var t=e.duration,a=1,i=60*t,r=e.start||0,o=e.end-r,l=e.step,s=e.easing||function(e){return(e/=.5)<1?.5*Math.pow(e,3):.5*(Math.pow(e-2,3)+2)};S(function e(){var t=a/i,n=o*s(t)+r;l(n,a),a+=1,t<1&&S(e)})}({start:n||0,end:a,duration:t||1,step:function(e,t){b(e,t)}}))},getValue:function(){return a}},function(e){o=V("text",{x:50,y:50,fill:"#999",class:m,"font-size":"100%","font-family":"sans-serif","font-weight":"normal","text-anchor":"middle","alignment-baseline":"middle","dominant-baseline":"central"}),l=V("path",{class:i,fill:"none",stroke:"#666","stroke-width":2.5,d:y(c,f,f)});var t=R(100,360-Math.abs(f-v)),n=V("svg",{viewBox:x||"0 0 100 100",class:h},[V("path",{class:g,fill:"none",stroke:"#eee","stroke-width":2,d:y(c,f,v,t<=180?0:1)}),V("g",{class:"text-container"},[o]),l]);e.appendChild(n)}(n),t.setValue(a),t}}());"function"==typeof define&&define.amd?define(function(){return n}):"object"==typeof module&&module.exports?module.exports=n:e.Gauge=n}("undefined"==typeof window?this:window);
// End Gauge Charts

// Start HTMX-Min
var htmx=function(){"use strict";const Q={onLoad:null,process:null,on:null,off:null,trigger:null,ajax:null,find:null,findAll:null,closest:null,values:function(e,t){const n=cn(e,t||"post");return n.values},remove:null,addClass:null,removeClass:null,toggleClass:null,takeClass:null,swap:null,defineExtension:null,removeExtension:null,logAll:null,logNone:null,logger:null,config:{historyEnabled:true,historyCacheSize:10,refreshOnHistoryMiss:false,defaultSwapStyle:"innerHTML",defaultSwapDelay:0,defaultSettleDelay:20,includeIndicatorStyles:true,indicatorClass:"htmx-indicator",requestClass:"htmx-request",addedClass:"htmx-added",settlingClass:"htmx-settling",swappingClass:"htmx-swapping",allowEval:true,allowScriptTags:true,inlineScriptNonce:"",inlineStyleNonce:"",attributesToSettle:["class","style","width","height"],withCredentials:false,timeout:0,wsReconnectDelay:"full-jitter",wsBinaryType:"blob",disableSelector:"[hx-disable], [data-hx-disable]",scrollBehavior:"instant",defaultFocusScroll:false,getCacheBusterParam:false,globalViewTransitions:false,methodsThatUseUrlParams:["get","delete"],selfRequestsOnly:true,ignoreTitle:false,scrollIntoViewOnBoost:true,triggerSpecsCache:null,disableInheritance:false,responseHandling:[{code:"204",swap:false},{code:"[23]..",swap:true},{code:"[45]..",swap:false,error:true}],allowNestedOobSwaps:true},parseInterval:null,_:null,version:"2.0.3"};Q.onLoad=j;Q.process=kt;Q.on=ye;Q.off=be;Q.trigger=de;Q.ajax=Rn;Q.find=r;Q.findAll=x;Q.closest=g;Q.remove=z;Q.addClass=K;Q.removeClass=G;Q.toggleClass=W;Q.takeClass=Z;Q.swap=$e;Q.defineExtension=Fn;Q.removeExtension=Bn;Q.logAll=V;Q.logNone=_;Q.parseInterval=h;Q._=e;const n={addTriggerHandler:St,bodyContains:le,canAccessLocalStorage:B,findThisElement:Se,filterValues:dn,swap:$e,hasAttribute:s,getAttributeValue:te,getClosestAttributeValue:re,getClosestMatch:i,getExpressionVars:En,getHeaders:fn,getInputValues:cn,getInternalData:ie,getSwapSpecification:gn,getTriggerSpecs:st,getTarget:Ee,makeFragment:P,mergeObjects:ce,makeSettleInfo:xn,oobSwap:He,querySelectorExt:ae,settleImmediately:Kt,shouldCancel:dt,triggerEvent:de,triggerErrorEvent:fe,withExtensions:Ft};const o=["get","post","put","delete","patch"];const R=o.map(function(e){return"[hx-"+e+"], [data-hx-"+e+"]"}).join(", ");function h(e){if(e==undefined){return undefined}let t=NaN;if(e.slice(-2)=="ms"){t=parseFloat(e.slice(0,-2))}else if(e.slice(-1)=="s"){t=parseFloat(e.slice(0,-1))*1e3}else if(e.slice(-1)=="m"){t=parseFloat(e.slice(0,-1))*1e3*60}else{t=parseFloat(e)}return isNaN(t)?undefined:t}function ee(e,t){return e instanceof Element&&e.getAttribute(t)}function s(e,t){return!!e.hasAttribute&&(e.hasAttribute(t)||e.hasAttribute("data-"+t))}function te(e,t){return ee(e,t)||ee(e,"data-"+t)}function c(e){const t=e.parentElement;if(!t&&e.parentNode instanceof ShadowRoot)return e.parentNode;return t}function ne(){return document}function m(e,t){return e.getRootNode?e.getRootNode({composed:t}):ne()}function i(e,t){while(e&&!t(e)){e=c(e)}return e||null}function H(e,t,n){const r=te(t,n);const o=te(t,"hx-disinherit");var i=te(t,"hx-inherit");if(e!==t){if(Q.config.disableInheritance){if(i&&(i==="*"||i.split(" ").indexOf(n)>=0)){return r}else{return null}}if(o&&(o==="*"||o.split(" ").indexOf(n)>=0)){return"unset"}}return r}function re(t,n){let r=null;i(t,function(e){return!!(r=H(t,ue(e),n))});if(r!=="unset"){return r}}function d(e,t){const n=e instanceof Element&&(e.matches||e.matchesSelector||e.msMatchesSelector||e.mozMatchesSelector||e.webkitMatchesSelector||e.oMatchesSelector);return!!n&&n.call(e,t)}function T(e){const t=/<([a-z][^\/\0>\x20\t\r\n\f]*)/i;const n=t.exec(e);if(n){return n[1].toLowerCase()}else{return""}}function q(e){const t=new DOMParser;return t.parseFromString(e,"text/html")}function L(e,t){while(t.childNodes.length>0){e.append(t.childNodes[0])}}function N(e){const t=ne().createElement("script");se(e.attributes,function(e){t.setAttribute(e.name,e.value)});t.textContent=e.textContent;t.async=false;if(Q.config.inlineScriptNonce){t.nonce=Q.config.inlineScriptNonce}return t}function A(e){return e.matches("script")&&(e.type==="text/javascript"||e.type==="module"||e.type==="")}function I(e){Array.from(e.querySelectorAll("script")).forEach(e=>{if(A(e)){const t=N(e);const n=e.parentNode;try{n.insertBefore(t,e)}catch(e){C(e)}finally{e.remove()}}})}function P(e){const t=e.replace(/<head(\s[^>]*)?>[\s\S]*?<\/head>/i,"");const n=T(t);let r;if(n==="html"){r=new DocumentFragment;const i=q(e);L(r,i.body);r.title=i.title}else if(n==="body"){r=new DocumentFragment;const i=q(t);L(r,i.body);r.title=i.title}else{const i=q('<body><template class="internal-htmx-wrapper">'+t+"</template></body>");r=i.querySelector("template").content;r.title=i.title;var o=r.querySelector("title");if(o&&o.parentNode===r){o.remove();r.title=o.innerText}}if(r){if(Q.config.allowScriptTags){I(r)}else{r.querySelectorAll("script").forEach(e=>e.remove())}}return r}function oe(e){if(e){e()}}function t(e,t){return Object.prototype.toString.call(e)==="[object "+t+"]"}function k(e){return typeof e==="function"}function D(e){return t(e,"Object")}function ie(e){const t="htmx-internal-data";let n=e[t];if(!n){n=e[t]={}}return n}function M(t){const n=[];if(t){for(let e=0;e<t.length;e++){n.push(t[e])}}return n}function se(t,n){if(t){for(let e=0;e<t.length;e++){n(t[e])}}}function X(e){const t=e.getBoundingClientRect();const n=t.top;const r=t.bottom;return n<window.innerHeight&&r>=0}function le(e){const t=e.getRootNode&&e.getRootNode();if(t&&t instanceof window.ShadowRoot){return ne().body.contains(t.host)}else{return ne().body.contains(e)}}function F(e){return e.trim().split(/\s+/)}function ce(e,t){for(const n in t){if(t.hasOwnProperty(n)){e[n]=t[n]}}return e}function S(e){try{return JSON.parse(e)}catch(e){C(e);return null}}function B(){const e="htmx:localStorageTest";try{localStorage.setItem(e,e);localStorage.removeItem(e);return true}catch(e){return false}}function U(t){try{const e=new URL(t);if(e){t=e.pathname+e.search}if(!/^\/$/.test(t)){t=t.replace(/\/+$/,"")}return t}catch(e){return t}}function e(e){return vn(ne().body,function(){return eval(e)})}function j(t){const e=Q.on("htmx:load",function(e){t(e.detail.elt)});return e}function V(){Q.logger=function(e,t,n){if(console){console.log(t,e,n)}}}function _(){Q.logger=null}function r(e,t){if(typeof e!=="string"){return e.querySelector(t)}else{return r(ne(),e)}}function x(e,t){if(typeof e!=="string"){return e.querySelectorAll(t)}else{return x(ne(),e)}}function E(){return window}function z(e,t){e=y(e);if(t){E().setTimeout(function(){z(e);e=null},t)}else{c(e).removeChild(e)}}function ue(e){return e instanceof Element?e:null}function $(e){return e instanceof HTMLElement?e:null}function J(e){return typeof e==="string"?e:null}function f(e){return e instanceof Element||e instanceof Document||e instanceof DocumentFragment?e:null}function K(e,t,n){e=ue(y(e));if(!e){return}if(n){E().setTimeout(function(){K(e,t);e=null},n)}else{e.classList&&e.classList.add(t)}}function G(e,t,n){let r=ue(y(e));if(!r){return}if(n){E().setTimeout(function(){G(r,t);r=null},n)}else{if(r.classList){r.classList.remove(t);if(r.classList.length===0){r.removeAttribute("class")}}}}function W(e,t){e=y(e);e.classList.toggle(t)}function Z(e,t){e=y(e);se(e.parentElement.children,function(e){G(e,t)});K(ue(e),t)}function g(e,t){e=ue(y(e));if(e&&e.closest){return e.closest(t)}else{do{if(e==null||d(e,t)){return e}}while(e=e&&ue(c(e)));return null}}function l(e,t){return e.substring(0,t.length)===t}function Y(e,t){return e.substring(e.length-t.length)===t}function ge(e){const t=e.trim();if(l(t,"<")&&Y(t,"/>")){return t.substring(1,t.length-2)}else{return t}}function p(e,t,n){e=y(e);if(t.indexOf("closest ")===0){return[g(ue(e),ge(t.substr(8)))]}else if(t.indexOf("find ")===0){return[r(f(e),ge(t.substr(5)))]}else if(t==="next"){return[ue(e).nextElementSibling]}else if(t.indexOf("next ")===0){return[pe(e,ge(t.substr(5)),!!n)]}else if(t==="previous"){return[ue(e).previousElementSibling]}else if(t.indexOf("previous ")===0){return[me(e,ge(t.substr(9)),!!n)]}else if(t==="document"){return[document]}else if(t==="window"){return[window]}else if(t==="body"){return[document.body]}else if(t==="root"){return[m(e,!!n)]}else if(t==="host"){return[e.getRootNode().host]}else if(t.indexOf("global ")===0){return p(e,t.slice(7),true)}else{return M(f(m(e,!!n)).querySelectorAll(ge(t)))}}var pe=function(t,e,n){const r=f(m(t,n)).querySelectorAll(e);for(let e=0;e<r.length;e++){const o=r[e];if(o.compareDocumentPosition(t)===Node.DOCUMENT_POSITION_PRECEDING){return o}}};var me=function(t,e,n){const r=f(m(t,n)).querySelectorAll(e);for(let e=r.length-1;e>=0;e--){const o=r[e];if(o.compareDocumentPosition(t)===Node.DOCUMENT_POSITION_FOLLOWING){return o}}};function ae(e,t){if(typeof e!=="string"){return p(e,t)[0]}else{return p(ne().body,e)[0]}}function y(e,t){if(typeof e==="string"){return r(f(t)||document,e)}else{return e}}function xe(e,t,n,r){if(k(t)){return{target:ne().body,event:J(e),listener:t,options:n}}else{return{target:y(e),event:J(t),listener:n,options:r}}}function ye(t,n,r,o){Vn(function(){const e=xe(t,n,r,o);e.target.addEventListener(e.event,e.listener,e.options)});const e=k(n);return e?n:r}function be(t,n,r){Vn(function(){const e=xe(t,n,r);e.target.removeEventListener(e.event,e.listener)});return k(n)?n:r}const ve=ne().createElement("output");function we(e,t){const n=re(e,t);if(n){if(n==="this"){return[Se(e,t)]}else{const r=p(e,n);if(r.length===0){C('The selector "'+n+'" on '+t+" returned no matches!");return[ve]}else{return r}}}}function Se(e,t){return ue(i(e,function(e){return te(ue(e),t)!=null}))}function Ee(e){const t=re(e,"hx-target");if(t){if(t==="this"){return Se(e,"hx-target")}else{return ae(e,t)}}else{const n=ie(e);if(n.boosted){return ne().body}else{return e}}}function Ce(t){const n=Q.config.attributesToSettle;for(let e=0;e<n.length;e++){if(t===n[e]){return true}}return false}function Oe(t,n){se(t.attributes,function(e){if(!n.hasAttribute(e.name)&&Ce(e.name)){t.removeAttribute(e.name)}});se(n.attributes,function(e){if(Ce(e.name)){t.setAttribute(e.name,e.value)}})}function Re(t,e){const n=Un(e);for(let e=0;e<n.length;e++){const r=n[e];try{if(r.isInlineSwap(t)){return true}}catch(e){C(e)}}return t==="outerHTML"}function He(e,o,i,t){t=t||ne();let n="#"+ee(o,"id");let s="outerHTML";if(e==="true"){}else if(e.indexOf(":")>0){s=e.substr(0,e.indexOf(":"));n=e.substr(e.indexOf(":")+1,e.length)}else{s=e}o.removeAttribute("hx-swap-oob");o.removeAttribute("data-hx-swap-oob");const r=p(t,n,false);if(r){se(r,function(e){let t;const n=o.cloneNode(true);t=ne().createDocumentFragment();t.appendChild(n);if(!Re(s,e)){t=f(n)}const r={shouldSwap:true,target:e,fragment:t};if(!de(e,"htmx:oobBeforeSwap",r))return;e=r.target;if(r.shouldSwap){qe(t);_e(s,e,e,t,i);Te()}se(i.elts,function(e){de(e,"htmx:oobAfterSwap",r)})});o.parentNode.removeChild(o)}else{o.parentNode.removeChild(o);fe(ne().body,"htmx:oobErrorNoTarget",{content:o})}return e}function Te(){const e=r("#--htmx-preserve-pantry--");if(e){for(const t of[...e.children]){const n=r("#"+t.id);n.parentNode.moveBefore(t,n);n.remove()}e.remove()}}function qe(e){se(x(e,"[hx-preserve], [data-hx-preserve]"),function(e){const t=te(e,"id");const n=ne().getElementById(t);if(n!=null){if(e.moveBefore){let e=r("#--htmx-preserve-pantry--");if(e==null){ne().body.insertAdjacentHTML("afterend","<div id='--htmx-preserve-pantry--'></div>");e=r("#--htmx-preserve-pantry--")}e.moveBefore(n,null)}else{e.parentNode.replaceChild(n,e)}}})}function Le(l,e,c){se(e.querySelectorAll("[id]"),function(t){const n=ee(t,"id");if(n&&n.length>0){const r=n.replace("'","\\'");const o=t.tagName.replace(":","\\:");const e=f(l);const i=e&&e.querySelector(o+"[id='"+r+"']");if(i&&i!==e){const s=t.cloneNode();Oe(t,i);c.tasks.push(function(){Oe(t,s)})}}})}function Ne(e){return function(){G(e,Q.config.addedClass);kt(ue(e));Ae(f(e));de(e,"htmx:load")}}function Ae(e){const t="[autofocus]";const n=$(d(e,t)?e:e.querySelector(t));if(n!=null){n.focus()}}function u(e,t,n,r){Le(e,n,r);while(n.childNodes.length>0){const o=n.firstChild;K(ue(o),Q.config.addedClass);e.insertBefore(o,t);if(o.nodeType!==Node.TEXT_NODE&&o.nodeType!==Node.COMMENT_NODE){r.tasks.push(Ne(o))}}}function Ie(e,t){let n=0;while(n<e.length){t=(t<<5)-t+e.charCodeAt(n++)|0}return t}function Pe(t){let n=0;if(t.attributes){for(let e=0;e<t.attributes.length;e++){const r=t.attributes[e];if(r.value){n=Ie(r.name,n);n=Ie(r.value,n)}}}return n}function ke(t){const n=ie(t);if(n.onHandlers){for(let e=0;e<n.onHandlers.length;e++){const r=n.onHandlers[e];be(t,r.event,r.listener)}delete n.onHandlers}}function De(e){const t=ie(e);if(t.timeout){clearTimeout(t.timeout)}if(t.listenerInfos){se(t.listenerInfos,function(e){if(e.on){be(e.on,e.trigger,e.listener)}})}ke(e);se(Object.keys(t),function(e){delete t[e]})}function a(e){de(e,"htmx:beforeCleanupElement");De(e);if(e.children){se(e.children,function(e){a(e)})}}function Me(t,e,n){if(t instanceof Element&&t.tagName==="BODY"){return Ve(t,e,n)}let r;const o=t.previousSibling;const i=c(t);if(!i){return}u(i,t,e,n);if(o==null){r=i.firstChild}else{r=o.nextSibling}n.elts=n.elts.filter(function(e){return e!==t});while(r&&r!==t){if(r instanceof Element){n.elts.push(r)}r=r.nextSibling}a(t);if(t instanceof Element){t.remove()}else{t.parentNode.removeChild(t)}}function Xe(e,t,n){return u(e,e.firstChild,t,n)}function Fe(e,t,n){return u(c(e),e,t,n)}function Be(e,t,n){return u(e,null,t,n)}function Ue(e,t,n){return u(c(e),e.nextSibling,t,n)}function je(e){a(e);const t=c(e);if(t){return t.removeChild(e)}}function Ve(e,t,n){const r=e.firstChild;u(e,r,t,n);if(r){while(r.nextSibling){a(r.nextSibling);e.removeChild(r.nextSibling)}a(r);e.removeChild(r)}}function _e(t,e,n,r,o){switch(t){case"none":return;case"outerHTML":Me(n,r,o);return;case"afterbegin":Xe(n,r,o);return;case"beforebegin":Fe(n,r,o);return;case"beforeend":Be(n,r,o);return;case"afterend":Ue(n,r,o);return;case"delete":je(n);return;default:var i=Un(e);for(let e=0;e<i.length;e++){const s=i[e];try{const l=s.handleSwap(t,n,r,o);if(l){if(Array.isArray(l)){for(let e=0;e<l.length;e++){const c=l[e];if(c.nodeType!==Node.TEXT_NODE&&c.nodeType!==Node.COMMENT_NODE){o.tasks.push(Ne(c))}}}return}}catch(e){C(e)}}if(t==="innerHTML"){Ve(n,r,o)}else{_e(Q.config.defaultSwapStyle,e,n,r,o)}}}function ze(e,n,r){var t=x(e,"[hx-swap-oob], [data-hx-swap-oob]");se(t,function(e){if(Q.config.allowNestedOobSwaps||e.parentElement===null){const t=te(e,"hx-swap-oob");if(t!=null){He(t,e,n,r)}}else{e.removeAttribute("hx-swap-oob");e.removeAttribute("data-hx-swap-oob")}});return t.length>0}function $e(e,t,r,o){if(!o){o={}}e=y(e);const i=o.contextElement?m(o.contextElement,false):ne();const n=document.activeElement;let s={};try{s={elt:n,start:n?n.selectionStart:null,end:n?n.selectionEnd:null}}catch(e){}const l=xn(e);if(r.swapStyle==="textContent"){e.textContent=t}else{let n=P(t);l.title=n.title;if(o.selectOOB){const u=o.selectOOB.split(",");for(let t=0;t<u.length;t++){const a=u[t].split(":",2);let e=a[0].trim();if(e.indexOf("#")===0){e=e.substring(1)}const f=a[1]||"true";const d=n.querySelector("#"+e);if(d){He(f,d,l,i)}}}ze(n,l,i);se(x(n,"template"),function(e){if(ze(e.content,l,i)){e.remove()}});if(o.select){const h=ne().createDocumentFragment();se(n.querySelectorAll(o.select),function(e){h.appendChild(e)});n=h}qe(n);_e(r.swapStyle,o.contextElement,e,n,l);Te()}if(s.elt&&!le(s.elt)&&ee(s.elt,"id")){const g=document.getElementById(ee(s.elt,"id"));const p={preventScroll:r.focusScroll!==undefined?!r.focusScroll:!Q.config.defaultFocusScroll};if(g){if(s.start&&g.setSelectionRange){try{g.setSelectionRange(s.start,s.end)}catch(e){}}g.focus(p)}}e.classList.remove(Q.config.swappingClass);se(l.elts,function(e){if(e.classList){e.classList.add(Q.config.settlingClass)}de(e,"htmx:afterSwap",o.eventInfo)});if(o.afterSwapCallback){o.afterSwapCallback()}if(!r.ignoreTitle){kn(l.title)}const c=function(){se(l.tasks,function(e){e.call()});se(l.elts,function(e){if(e.classList){e.classList.remove(Q.config.settlingClass)}de(e,"htmx:afterSettle",o.eventInfo)});if(o.anchor){const e=ue(y("#"+o.anchor));if(e){e.scrollIntoView({block:"start",behavior:"auto"})}}yn(l.elts,r);if(o.afterSettleCallback){o.afterSettleCallback()}};if(r.settleDelay>0){E().setTimeout(c,r.settleDelay)}else{c()}}function Je(e,t,n){const r=e.getResponseHeader(t);if(r.indexOf("{")===0){const o=S(r);for(const i in o){if(o.hasOwnProperty(i)){let e=o[i];if(D(e)){n=e.target!==undefined?e.target:n}else{e={value:e}}de(n,i,e)}}}else{const s=r.split(",");for(let e=0;e<s.length;e++){de(n,s[e].trim(),[])}}}const Ke=/\s/;const b=/[\s,]/;const Ge=/[_$a-zA-Z]/;const We=/[_$a-zA-Z0-9]/;const Ze=['"',"'","/"];const v=/[^\s]/;const Ye=/[{(]/;const Qe=/[})]/;function et(e){const t=[];let n=0;while(n<e.length){if(Ge.exec(e.charAt(n))){var r=n;while(We.exec(e.charAt(n+1))){n++}t.push(e.substr(r,n-r+1))}else if(Ze.indexOf(e.charAt(n))!==-1){const o=e.charAt(n);var r=n;n++;while(n<e.length&&e.charAt(n)!==o){if(e.charAt(n)==="\\"){n++}n++}t.push(e.substr(r,n-r+1))}else{const i=e.charAt(n);t.push(i)}n++}return t}function tt(e,t,n){return Ge.exec(e.charAt(0))&&e!=="true"&&e!=="false"&&e!=="this"&&e!==n&&t!=="."}function nt(r,o,i){if(o[0]==="["){o.shift();let e=1;let t=" return (function("+i+"){ return (";let n=null;while(o.length>0){const s=o[0];if(s==="]"){e--;if(e===0){if(n===null){t=t+"true"}o.shift();t+=")})";try{const l=vn(r,function(){return Function(t)()},function(){return true});l.source=t;return l}catch(e){fe(ne().body,"htmx:syntax:error",{error:e,source:t});return null}}}else if(s==="["){e++}if(tt(s,n,i)){t+="(("+i+"."+s+") ? ("+i+"."+s+") : (window."+s+"))"}else{t=t+s}n=o.shift()}}}function w(e,t){let n="";while(e.length>0&&!t.test(e[0])){n+=e.shift()}return n}function rt(e){let t;if(e.length>0&&Ye.test(e[0])){e.shift();t=w(e,Qe).trim();e.shift()}else{t=w(e,b)}return t}const ot="input, textarea, select";function it(e,t,n){const r=[];const o=et(t);do{w(o,v);const l=o.length;const c=w(o,/[,\[\s]/);if(c!==""){if(c==="every"){const u={trigger:"every"};w(o,v);u.pollInterval=h(w(o,/[,\[\s]/));w(o,v);var i=nt(e,o,"event");if(i){u.eventFilter=i}r.push(u)}else{const a={trigger:c};var i=nt(e,o,"event");if(i){a.eventFilter=i}w(o,v);while(o.length>0&&o[0]!==","){const f=o.shift();if(f==="changed"){a.changed=true}else if(f==="once"){a.once=true}else if(f==="consume"){a.consume=true}else if(f==="delay"&&o[0]===":"){o.shift();a.delay=h(w(o,b))}else if(f==="from"&&o[0]===":"){o.shift();if(Ye.test(o[0])){var s=rt(o)}else{var s=w(o,b);if(s==="closest"||s==="find"||s==="next"||s==="previous"){o.shift();const d=rt(o);if(d.length>0){s+=" "+d}}}a.from=s}else if(f==="target"&&o[0]===":"){o.shift();a.target=rt(o)}else if(f==="throttle"&&o[0]===":"){o.shift();a.throttle=h(w(o,b))}else if(f==="queue"&&o[0]===":"){o.shift();a.queue=w(o,b)}else if(f==="root"&&o[0]===":"){o.shift();a[f]=rt(o)}else if(f==="threshold"&&o[0]===":"){o.shift();a[f]=w(o,b)}else{fe(e,"htmx:syntax:error",{token:o.shift()})}w(o,v)}r.push(a)}}if(o.length===l){fe(e,"htmx:syntax:error",{token:o.shift()})}w(o,v)}while(o[0]===","&&o.shift());if(n){n[t]=r}return r}function st(e){const t=te(e,"hx-trigger");let n=[];if(t){const r=Q.config.triggerSpecsCache;n=r&&r[t]||it(e,t,r)}if(n.length>0){return n}else if(d(e,"form")){return[{trigger:"submit"}]}else if(d(e,'input[type="button"], input[type="submit"]')){return[{trigger:"click"}]}else if(d(e,ot)){return[{trigger:"change"}]}else{return[{trigger:"click"}]}}function lt(e){ie(e).cancelled=true}function ct(e,t,n){const r=ie(e);r.timeout=E().setTimeout(function(){if(le(e)&&r.cancelled!==true){if(!gt(n,e,Mt("hx:poll:trigger",{triggerSpec:n,target:e}))){t(e)}ct(e,t,n)}},n.pollInterval)}function ut(e){return location.hostname===e.hostname&&ee(e,"href")&&ee(e,"href").indexOf("#")!==0}function at(e){return g(e,Q.config.disableSelector)}function ft(t,n,e){if(t instanceof HTMLAnchorElement&&ut(t)&&(t.target===""||t.target==="_self")||t.tagName==="FORM"&&String(ee(t,"method")).toLowerCase()!=="dialog"){n.boosted=true;let r,o;if(t.tagName==="A"){r="get";o=ee(t,"href")}else{const i=ee(t,"method");r=i?i.toLowerCase():"get";o=ee(t,"action");if(r==="get"&&o.includes("?")){o=o.replace(/\?[^#]+/,"")}}e.forEach(function(e){pt(t,function(e,t){const n=ue(e);if(at(n)){a(n);return}he(r,o,n,t)},n,e,true)})}}function dt(e,t){const n=ue(t);if(!n){return false}if(e.type==="submit"||e.type==="click"){if(n.tagName==="FORM"){return true}if(d(n,'input[type="submit"], button')&&g(n,"form")!==null){return true}if(n instanceof HTMLAnchorElement&&n.href&&(n.getAttribute("href")==="#"||n.getAttribute("href").indexOf("#")!==0)){return true}}return false}function ht(e,t){return ie(e).boosted&&e instanceof HTMLAnchorElement&&t.type==="click"&&(t.ctrlKey||t.metaKey)}function gt(e,t,n){const r=e.eventFilter;if(r){try{return r.call(t,n)!==true}catch(e){const o=r.source;fe(ne().body,"htmx:eventFilter:error",{error:e,source:o});return true}}return false}function pt(l,c,e,u,a){const f=ie(l);let t;if(u.from){t=p(l,u.from)}else{t=[l]}if(u.changed){if(!("lastValue"in f)){f.lastValue=new WeakMap}t.forEach(function(e){if(!f.lastValue.has(u)){f.lastValue.set(u,new WeakMap)}f.lastValue.get(u).set(e,e.value)})}se(t,function(i){const s=function(e){if(!le(l)){i.removeEventListener(u.trigger,s);return}if(ht(l,e)){return}if(a||dt(e,l)){e.preventDefault()}if(gt(u,l,e)){return}const t=ie(e);t.triggerSpec=u;if(t.handledFor==null){t.handledFor=[]}if(t.handledFor.indexOf(l)<0){t.handledFor.push(l);if(u.consume){e.stopPropagation()}if(u.target&&e.target){if(!d(ue(e.target),u.target)){return}}if(u.once){if(f.triggeredOnce){return}else{f.triggeredOnce=true}}if(u.changed){const n=event.target;const r=n.value;const o=f.lastValue.get(u);if(o.has(n)&&o.get(n)===r){return}o.set(n,r)}if(f.delayed){clearTimeout(f.delayed)}if(f.throttle){return}if(u.throttle>0){if(!f.throttle){de(l,"htmx:trigger");c(l,e);f.throttle=E().setTimeout(function(){f.throttle=null},u.throttle)}}else if(u.delay>0){f.delayed=E().setTimeout(function(){de(l,"htmx:trigger");c(l,e)},u.delay)}else{de(l,"htmx:trigger");c(l,e)}}};if(e.listenerInfos==null){e.listenerInfos=[]}e.listenerInfos.push({trigger:u.trigger,listener:s,on:i});i.addEventListener(u.trigger,s)})}let mt=false;let xt=null;function yt(){if(!xt){xt=function(){mt=true};window.addEventListener("scroll",xt);window.addEventListener("resize",xt);setInterval(function(){if(mt){mt=false;se(ne().querySelectorAll("[hx-trigger*='revealed'],[data-hx-trigger*='revealed']"),function(e){bt(e)})}},200)}}function bt(e){if(!s(e,"data-hx-revealed")&&X(e)){e.setAttribute("data-hx-revealed","true");const t=ie(e);if(t.initHash){de(e,"revealed")}else{e.addEventListener("htmx:afterProcessNode",function(){de(e,"revealed")},{once:true})}}}function vt(e,t,n,r){const o=function(){if(!n.loaded){n.loaded=true;t(e)}};if(r>0){E().setTimeout(o,r)}else{o()}}function wt(t,n,e){let i=false;se(o,function(r){if(s(t,"hx-"+r)){const o=te(t,"hx-"+r);i=true;n.path=o;n.verb=r;e.forEach(function(e){St(t,e,n,function(e,t){const n=ue(e);if(g(n,Q.config.disableSelector)){a(n);return}he(r,o,n,t)})})}});return i}function St(r,e,t,n){if(e.trigger==="revealed"){yt();pt(r,n,t,e);bt(ue(r))}else if(e.trigger==="intersect"){const o={};if(e.root){o.root=ae(r,e.root)}if(e.threshold){o.threshold=parseFloat(e.threshold)}const i=new IntersectionObserver(function(t){for(let e=0;e<t.length;e++){const n=t[e];if(n.isIntersecting){de(r,"intersect");break}}},o);i.observe(ue(r));pt(ue(r),n,t,e)}else if(e.trigger==="load"){if(!gt(e,r,Mt("load",{elt:r}))){vt(ue(r),n,t,e.delay)}}else if(e.pollInterval>0){t.polling=true;ct(ue(r),n,e)}else{pt(r,n,t,e)}}function Et(e){const t=ue(e);if(!t){return false}const n=t.attributes;for(let e=0;e<n.length;e++){const r=n[e].name;if(l(r,"hx-on:")||l(r,"data-hx-on:")||l(r,"hx-on-")||l(r,"data-hx-on-")){return true}}return false}const Ct=(new XPathEvaluator).createExpression('.//*[@*[ starts-with(name(), "hx-on:") or starts-with(name(), "data-hx-on:") or'+' starts-with(name(), "hx-on-") or starts-with(name(), "data-hx-on-") ]]');function Ot(e,t){if(Et(e)){t.push(ue(e))}const n=Ct.evaluate(e);let r=null;while(r=n.iterateNext())t.push(ue(r))}function Rt(e){const t=[];if(e instanceof DocumentFragment){for(const n of e.childNodes){Ot(n,t)}}else{Ot(e,t)}return t}function Ht(e){if(e.querySelectorAll){const n=", [hx-boost] a, [data-hx-boost] a, a[hx-boost], a[data-hx-boost]";const r=[];for(const i in Mn){const s=Mn[i];if(s.getSelectors){var t=s.getSelectors();if(t){r.push(t)}}}const o=e.querySelectorAll(R+n+", form, [type='submit'],"+" [hx-ext], [data-hx-ext], [hx-trigger], [data-hx-trigger]"+r.flat().map(e=>", "+e).join(""));return o}else{return[]}}function Tt(e){const t=g(ue(e.target),"button, input[type='submit']");const n=Lt(e);if(n){n.lastButtonClicked=t}}function qt(e){const t=Lt(e);if(t){t.lastButtonClicked=null}}function Lt(e){const t=g(ue(e.target),"button, input[type='submit']");if(!t){return}const n=y("#"+ee(t,"form"),t.getRootNode())||g(t,"form");if(!n){return}return ie(n)}function Nt(e){e.addEventListener("click",Tt);e.addEventListener("focusin",Tt);e.addEventListener("focusout",qt)}function At(t,e,n){const r=ie(t);if(!Array.isArray(r.onHandlers)){r.onHandlers=[]}let o;const i=function(e){vn(t,function(){if(at(t)){return}if(!o){o=new Function("event",n)}o.call(t,e)})};t.addEventListener(e,i);r.onHandlers.push({event:e,listener:i})}function It(t){ke(t);for(let e=0;e<t.attributes.length;e++){const n=t.attributes[e].name;const r=t.attributes[e].value;if(l(n,"hx-on")||l(n,"data-hx-on")){const o=n.indexOf("-on")+3;const i=n.slice(o,o+1);if(i==="-"||i===":"){let e=n.slice(o+1);if(l(e,":")){e="htmx"+e}else if(l(e,"-")){e="htmx:"+e.slice(1)}else if(l(e,"htmx-")){e="htmx:"+e.slice(5)}At(t,e,r)}}}}function Pt(t){if(g(t,Q.config.disableSelector)){a(t);return}const n=ie(t);if(n.initHash!==Pe(t)){De(t);n.initHash=Pe(t);de(t,"htmx:beforeProcessNode");const e=st(t);const r=wt(t,n,e);if(!r){if(re(t,"hx-boost")==="true"){ft(t,n,e)}else if(s(t,"hx-trigger")){e.forEach(function(e){St(t,e,n,function(){})})}}if(t.tagName==="FORM"||ee(t,"type")==="submit"&&s(t,"form")){Nt(t)}de(t,"htmx:afterProcessNode")}}function kt(e){e=y(e);if(g(e,Q.config.disableSelector)){a(e);return}Pt(e);se(Ht(e),function(e){Pt(e)});se(Rt(e),It)}function Dt(e){return e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}function Mt(e,t){let n;if(window.CustomEvent&&typeof window.CustomEvent==="function"){n=new CustomEvent(e,{bubbles:true,cancelable:true,composed:true,detail:t})}else{n=ne().createEvent("CustomEvent");n.initCustomEvent(e,true,true,t)}return n}function fe(e,t,n){de(e,t,ce({error:t},n))}function Xt(e){return e==="htmx:afterProcessNode"}function Ft(e,t){se(Un(e),function(e){try{t(e)}catch(e){C(e)}})}function C(e){if(console.error){console.error(e)}else if(console.log){console.log("ERROR: ",e)}}function de(e,t,n){e=y(e);if(n==null){n={}}n.elt=e;const r=Mt(t,n);if(Q.logger&&!Xt(t)){Q.logger(e,t,n)}if(n.error){C(n.error);de(e,"htmx:error",{errorInfo:n})}let o=e.dispatchEvent(r);const i=Dt(t);if(o&&i!==t){const s=Mt(i,r.detail);o=o&&e.dispatchEvent(s)}Ft(ue(e),function(e){o=o&&(e.onEvent(t,r)!==false&&!r.defaultPrevented)});return o}let Bt=location.pathname+location.search;function Ut(){const e=ne().querySelector("[hx-history-elt],[data-hx-history-elt]");return e||ne().body}function jt(t,e){if(!B()){return}const n=_t(e);const r=ne().title;const o=window.scrollY;if(Q.config.historyCacheSize<=0){localStorage.removeItem("htmx-history-cache");return}t=U(t);const i=S(localStorage.getItem("htmx-history-cache"))||[];for(let e=0;e<i.length;e++){if(i[e].url===t){i.splice(e,1);break}}const s={url:t,content:n,title:r,scroll:o};de(ne().body,"htmx:historyItemCreated",{item:s,cache:i});i.push(s);while(i.length>Q.config.historyCacheSize){i.shift()}while(i.length>0){try{localStorage.setItem("htmx-history-cache",JSON.stringify(i));break}catch(e){fe(ne().body,"htmx:historyCacheError",{cause:e,cache:i});i.shift()}}}function Vt(t){if(!B()){return null}t=U(t);const n=S(localStorage.getItem("htmx-history-cache"))||[];for(let e=0;e<n.length;e++){if(n[e].url===t){return n[e]}}return null}function _t(e){const t=Q.config.requestClass;const n=e.cloneNode(true);se(x(n,"."+t),function(e){G(e,t)});se(x(n,"[data-disabled-by-htmx]"),function(e){e.removeAttribute("disabled")});return n.innerHTML}function zt(){const e=Ut();const t=Bt||location.pathname+location.search;let n;try{n=ne().querySelector('[hx-history="false" i],[data-hx-history="false" i]')}catch(e){n=ne().querySelector('[hx-history="false"],[data-hx-history="false"]')}if(!n){de(ne().body,"htmx:beforeHistorySave",{path:t,historyElt:e});jt(t,e)}if(Q.config.historyEnabled)history.replaceState({htmx:true},ne().title,window.location.href)}function $t(e){if(Q.config.getCacheBusterParam){e=e.replace(/org\.htmx\.cache-buster=[^&]*&?/,"");if(Y(e,"&")||Y(e,"?")){e=e.slice(0,-1)}}if(Q.config.historyEnabled){history.pushState({htmx:true},"",e)}Bt=e}function Jt(e){if(Q.config.historyEnabled)history.replaceState({htmx:true},"",e);Bt=e}function Kt(e){se(e,function(e){e.call(undefined)})}function Gt(o){const e=new XMLHttpRequest;const i={path:o,xhr:e};de(ne().body,"htmx:historyCacheMiss",i);e.open("GET",o,true);e.setRequestHeader("HX-Request","true");e.setRequestHeader("HX-History-Restore-Request","true");e.setRequestHeader("HX-Current-URL",ne().location.href);e.onload=function(){if(this.status>=200&&this.status<400){de(ne().body,"htmx:historyCacheMissLoad",i);const e=P(this.response);const t=e.querySelector("[hx-history-elt],[data-hx-history-elt]")||e;const n=Ut();const r=xn(n);kn(e.title);qe(e);Ve(n,t,r);Te();Kt(r.tasks);Bt=o;de(ne().body,"htmx:historyRestore",{path:o,cacheMiss:true,serverResponse:this.response})}else{fe(ne().body,"htmx:historyCacheMissLoadError",i)}};e.send()}function Wt(e){zt();e=e||location.pathname+location.search;const t=Vt(e);if(t){const n=P(t.content);const r=Ut();const o=xn(r);kn(t.title);qe(n);Ve(r,n,o);Te();Kt(o.tasks);E().setTimeout(function(){window.scrollTo(0,t.scroll)},0);Bt=e;de(ne().body,"htmx:historyRestore",{path:e,item:t})}else{if(Q.config.refreshOnHistoryMiss){window.location.reload(true)}else{Gt(e)}}}function Zt(e){let t=we(e,"hx-indicator");if(t==null){t=[e]}se(t,function(e){const t=ie(e);t.requestCount=(t.requestCount||0)+1;e.classList.add.call(e.classList,Q.config.requestClass)});return t}function Yt(e){let t=we(e,"hx-disabled-elt");if(t==null){t=[]}se(t,function(e){const t=ie(e);t.requestCount=(t.requestCount||0)+1;e.setAttribute("disabled","");e.setAttribute("data-disabled-by-htmx","")});return t}function Qt(e,t){se(e.concat(t),function(e){const t=ie(e);t.requestCount=(t.requestCount||1)-1});se(e,function(e){const t=ie(e);if(t.requestCount===0){e.classList.remove.call(e.classList,Q.config.requestClass)}});se(t,function(e){const t=ie(e);if(t.requestCount===0){e.removeAttribute("disabled");e.removeAttribute("data-disabled-by-htmx")}})}function en(t,n){for(let e=0;e<t.length;e++){const r=t[e];if(r.isSameNode(n)){return true}}return false}function tn(e){const t=e;if(t.name===""||t.name==null||t.disabled||g(t,"fieldset[disabled]")){return false}if(t.type==="button"||t.type==="submit"||t.tagName==="image"||t.tagName==="reset"||t.tagName==="file"){return false}if(t.type==="checkbox"||t.type==="radio"){return t.checked}return true}function nn(t,e,n){if(t!=null&&e!=null){if(Array.isArray(e)){e.forEach(function(e){n.append(t,e)})}else{n.append(t,e)}}}function rn(t,n,r){if(t!=null&&n!=null){let e=r.getAll(t);if(Array.isArray(n)){e=e.filter(e=>n.indexOf(e)<0)}else{e=e.filter(e=>e!==n)}r.delete(t);se(e,e=>r.append(t,e))}}function on(t,n,r,o,i){if(o==null||en(t,o)){return}else{t.push(o)}if(tn(o)){const s=ee(o,"name");let e=o.value;if(o instanceof HTMLSelectElement&&o.multiple){e=M(o.querySelectorAll("option:checked")).map(function(e){return e.value})}if(o instanceof HTMLInputElement&&o.files){e=M(o.files)}nn(s,e,n);if(i){sn(o,r)}}if(o instanceof HTMLFormElement){se(o.elements,function(e){if(t.indexOf(e)>=0){rn(e.name,e.value,n)}else{t.push(e)}if(i){sn(e,r)}});new FormData(o).forEach(function(e,t){if(e instanceof File&&e.name===""){return}nn(t,e,n)})}}function sn(e,t){const n=e;if(n.willValidate){de(n,"htmx:validation:validate");if(!n.checkValidity()){t.push({elt:n,message:n.validationMessage,validity:n.validity});de(n,"htmx:validation:failed",{message:n.validationMessage,validity:n.validity})}}}function ln(n,e){for(const t of e.keys()){n.delete(t)}e.forEach(function(e,t){n.append(t,e)});return n}function cn(e,t){const n=[];const r=new FormData;const o=new FormData;const i=[];const s=ie(e);if(s.lastButtonClicked&&!le(s.lastButtonClicked)){s.lastButtonClicked=null}let l=e instanceof HTMLFormElement&&e.noValidate!==true||te(e,"hx-validate")==="true";if(s.lastButtonClicked){l=l&&s.lastButtonClicked.formNoValidate!==true}if(t!=="get"){on(n,o,i,g(e,"form"),l)}on(n,r,i,e,l);if(s.lastButtonClicked||e.tagName==="BUTTON"||e.tagName==="INPUT"&&ee(e,"type")==="submit"){const u=s.lastButtonClicked||e;const a=ee(u,"name");nn(a,u.value,o)}const c=we(e,"hx-include");se(c,function(e){on(n,r,i,ue(e),l);if(!d(e,"form")){se(f(e).querySelectorAll(ot),function(e){on(n,r,i,e,l)})}});ln(r,o);return{errors:i,formData:r,values:Nn(r)}}function un(e,t,n){if(e!==""){e+="&"}if(String(n)==="[object Object]"){n=JSON.stringify(n)}const r=encodeURIComponent(n);e+=encodeURIComponent(t)+"="+r;return e}function an(e){e=qn(e);let n="";e.forEach(function(e,t){n=un(n,t,e)});return n}function fn(e,t,n){const r={"HX-Request":"true","HX-Trigger":ee(e,"id"),"HX-Trigger-Name":ee(e,"name"),"HX-Target":te(t,"id"),"HX-Current-URL":ne().location.href};bn(e,"hx-headers",false,r);if(n!==undefined){r["HX-Prompt"]=n}if(ie(e).boosted){r["HX-Boosted"]="true"}return r}function dn(n,e){const t=re(e,"hx-params");if(t){if(t==="none"){return new FormData}else if(t==="*"){return n}else if(t.indexOf("not ")===0){se(t.substr(4).split(","),function(e){e=e.trim();n.delete(e)});return n}else{const r=new FormData;se(t.split(","),function(t){t=t.trim();if(n.has(t)){n.getAll(t).forEach(function(e){r.append(t,e)})}});return r}}else{return n}}function hn(e){return!!ee(e,"href")&&ee(e,"href").indexOf("#")>=0}function gn(e,t){const n=t||re(e,"hx-swap");const r={swapStyle:ie(e).boosted?"innerHTML":Q.config.defaultSwapStyle,swapDelay:Q.config.defaultSwapDelay,settleDelay:Q.config.defaultSettleDelay};if(Q.config.scrollIntoViewOnBoost&&ie(e).boosted&&!hn(e)){r.show="top"}if(n){const s=F(n);if(s.length>0){for(let e=0;e<s.length;e++){const l=s[e];if(l.indexOf("swap:")===0){r.swapDelay=h(l.substr(5))}else if(l.indexOf("settle:")===0){r.settleDelay=h(l.substr(7))}else if(l.indexOf("transition:")===0){r.transition=l.substr(11)==="true"}else if(l.indexOf("ignoreTitle:")===0){r.ignoreTitle=l.substr(12)==="true"}else if(l.indexOf("scroll:")===0){const c=l.substr(7);var o=c.split(":");const u=o.pop();var i=o.length>0?o.join(":"):null;r.scroll=u;r.scrollTarget=i}else if(l.indexOf("show:")===0){const a=l.substr(5);var o=a.split(":");const f=o.pop();var i=o.length>0?o.join(":"):null;r.show=f;r.showTarget=i}else if(l.indexOf("focus-scroll:")===0){const d=l.substr("focus-scroll:".length);r.focusScroll=d=="true"}else if(e==0){r.swapStyle=l}else{C("Unknown modifier in hx-swap: "+l)}}}}return r}function pn(e){return re(e,"hx-encoding")==="multipart/form-data"||d(e,"form")&&ee(e,"enctype")==="multipart/form-data"}function mn(t,n,r){let o=null;Ft(n,function(e){if(o==null){o=e.encodeParameters(t,r,n)}});if(o!=null){return o}else{if(pn(n)){return ln(new FormData,qn(r))}else{return an(r)}}}function xn(e){return{tasks:[],elts:[e]}}function yn(e,t){const n=e[0];const r=e[e.length-1];if(t.scroll){var o=null;if(t.scrollTarget){o=ue(ae(n,t.scrollTarget))}if(t.scroll==="top"&&(n||o)){o=o||n;o.scrollTop=0}if(t.scroll==="bottom"&&(r||o)){o=o||r;o.scrollTop=o.scrollHeight}}if(t.show){var o=null;if(t.showTarget){let e=t.showTarget;if(t.showTarget==="window"){e="body"}o=ue(ae(n,e))}if(t.show==="top"&&(n||o)){o=o||n;o.scrollIntoView({block:"start",behavior:Q.config.scrollBehavior})}if(t.show==="bottom"&&(r||o)){o=o||r;o.scrollIntoView({block:"end",behavior:Q.config.scrollBehavior})}}}function bn(r,e,o,i){if(i==null){i={}}if(r==null){return i}const s=te(r,e);if(s){let e=s.trim();let t=o;if(e==="unset"){return null}if(e.indexOf("javascript:")===0){e=e.substr(11);t=true}else if(e.indexOf("js:")===0){e=e.substr(3);t=true}if(e.indexOf("{")!==0){e="{"+e+"}"}let n;if(t){n=vn(r,function(){return Function("return ("+e+")")()},{})}else{n=S(e)}for(const l in n){if(n.hasOwnProperty(l)){if(i[l]==null){i[l]=n[l]}}}}return bn(ue(c(r)),e,o,i)}function vn(e,t,n){if(Q.config.allowEval){return t()}else{fe(e,"htmx:evalDisallowedError");return n}}function wn(e,t){return bn(e,"hx-vars",true,t)}function Sn(e,t){return bn(e,"hx-vals",false,t)}function En(e){return ce(wn(e),Sn(e))}function Cn(t,n,r){if(r!==null){try{t.setRequestHeader(n,r)}catch(e){t.setRequestHeader(n,encodeURIComponent(r));t.setRequestHeader(n+"-URI-AutoEncoded","true")}}}function On(t){if(t.responseURL&&typeof URL!=="undefined"){try{const e=new URL(t.responseURL);return e.pathname+e.search}catch(e){fe(ne().body,"htmx:badResponseUrl",{url:t.responseURL})}}}function O(e,t){return t.test(e.getAllResponseHeaders())}function Rn(t,n,r){t=t.toLowerCase();if(r){if(r instanceof Element||typeof r==="string"){return he(t,n,null,null,{targetOverride:y(r)||ve,returnPromise:true})}else{let e=y(r.target);if(r.target&&!e||!e&&!y(r.source)){e=ve}return he(t,n,y(r.source),r.event,{handler:r.handler,headers:r.headers,values:r.values,targetOverride:e,swapOverride:r.swap,select:r.select,returnPromise:true})}}else{return he(t,n,null,null,{returnPromise:true})}}function Hn(e){const t=[];while(e){t.push(e);e=e.parentElement}return t}function Tn(e,t,n){let r;let o;if(typeof URL==="function"){o=new URL(t,document.location.href);const i=document.location.origin;r=i===o.origin}else{o=t;r=l(t,document.location.origin)}if(Q.config.selfRequestsOnly){if(!r){return false}}return de(e,"htmx:validateUrl",ce({url:o,sameHost:r},n))}function qn(e){if(e instanceof FormData)return e;const t=new FormData;for(const n in e){if(e.hasOwnProperty(n)){if(e[n]&&typeof e[n].forEach==="function"){e[n].forEach(function(e){t.append(n,e)})}else if(typeof e[n]==="object"&&!(e[n]instanceof Blob)){t.append(n,JSON.stringify(e[n]))}else{t.append(n,e[n])}}}return t}function Ln(r,o,e){return new Proxy(e,{get:function(t,e){if(typeof e==="number")return t[e];if(e==="length")return t.length;if(e==="push"){return function(e){t.push(e);r.append(o,e)}}if(typeof t[e]==="function"){return function(){t[e].apply(t,arguments);r.delete(o);t.forEach(function(e){r.append(o,e)})}}if(t[e]&&t[e].length===1){return t[e][0]}else{return t[e]}},set:function(e,t,n){e[t]=n;r.delete(o);e.forEach(function(e){r.append(o,e)});return true}})}function Nn(r){return new Proxy(r,{get:function(e,t){if(typeof t==="symbol"){return Reflect.get(e,t)}if(t==="toJSON"){return()=>Object.fromEntries(r)}if(t in e){if(typeof e[t]==="function"){return function(){return r[t].apply(r,arguments)}}else{return e[t]}}const n=r.getAll(t);if(n.length===0){return undefined}else if(n.length===1){return n[0]}else{return Ln(e,t,n)}},set:function(t,n,e){if(typeof n!=="string"){return false}t.delete(n);if(e&&typeof e.forEach==="function"){e.forEach(function(e){t.append(n,e)})}else if(typeof e==="object"&&!(e instanceof Blob)){t.append(n,JSON.stringify(e))}else{t.append(n,e)}return true},deleteProperty:function(e,t){if(typeof t==="string"){e.delete(t)}return true},ownKeys:function(e){return Reflect.ownKeys(Object.fromEntries(e))},getOwnPropertyDescriptor:function(e,t){return Reflect.getOwnPropertyDescriptor(Object.fromEntries(e),t)}})}function he(t,n,r,o,i,D){let s=null;let l=null;i=i!=null?i:{};if(i.returnPromise&&typeof Promise!=="undefined"){var e=new Promise(function(e,t){s=e;l=t})}if(r==null){r=ne().body}const M=i.handler||Dn;const X=i.select||null;if(!le(r)){oe(s);return e}const c=i.targetOverride||ue(Ee(r));if(c==null||c==ve){fe(r,"htmx:targetError",{target:te(r,"hx-target")});oe(l);return e}let u=ie(r);const a=u.lastButtonClicked;if(a){const L=ee(a,"formaction");if(L!=null){n=L}const N=ee(a,"formmethod");if(N!=null){if(N.toLowerCase()!=="dialog"){t=N}}}const f=re(r,"hx-confirm");if(D===undefined){const K=function(e){return he(t,n,r,o,i,!!e)};const G={target:c,elt:r,path:n,verb:t,triggeringEvent:o,etc:i,issueRequest:K,question:f};if(de(r,"htmx:confirm",G)===false){oe(s);return e}}let d=r;let h=re(r,"hx-sync");let g=null;let F=false;if(h){const A=h.split(":");const I=A[0].trim();if(I==="this"){d=Se(r,"hx-sync")}else{d=ue(ae(r,I))}h=(A[1]||"drop").trim();u=ie(d);if(h==="drop"&&u.xhr&&u.abortable!==true){oe(s);return e}else if(h==="abort"){if(u.xhr){oe(s);return e}else{F=true}}else if(h==="replace"){de(d,"htmx:abort")}else if(h.indexOf("queue")===0){const W=h.split(" ");g=(W[1]||"last").trim()}}if(u.xhr){if(u.abortable){de(d,"htmx:abort")}else{if(g==null){if(o){const P=ie(o);if(P&&P.triggerSpec&&P.triggerSpec.queue){g=P.triggerSpec.queue}}if(g==null){g="last"}}if(u.queuedRequests==null){u.queuedRequests=[]}if(g==="first"&&u.queuedRequests.length===0){u.queuedRequests.push(function(){he(t,n,r,o,i)})}else if(g==="all"){u.queuedRequests.push(function(){he(t,n,r,o,i)})}else if(g==="last"){u.queuedRequests=[];u.queuedRequests.push(function(){he(t,n,r,o,i)})}oe(s);return e}}const p=new XMLHttpRequest;u.xhr=p;u.abortable=F;const m=function(){u.xhr=null;u.abortable=false;if(u.queuedRequests!=null&&u.queuedRequests.length>0){const e=u.queuedRequests.shift();e()}};const B=re(r,"hx-prompt");if(B){var x=prompt(B);if(x===null||!de(r,"htmx:prompt",{prompt:x,target:c})){oe(s);m();return e}}if(f&&!D){if(!confirm(f)){oe(s);m();return e}}let y=fn(r,c,x);if(t!=="get"&&!pn(r)){y["Content-Type"]="application/x-www-form-urlencoded"}if(i.headers){y=ce(y,i.headers)}const U=cn(r,t);let b=U.errors;const j=U.formData;if(i.values){ln(j,qn(i.values))}const V=qn(En(r));const v=ln(j,V);let w=dn(v,r);if(Q.config.getCacheBusterParam&&t==="get"){w.set("org.htmx.cache-buster",ee(c,"id")||"true")}if(n==null||n===""){n=ne().location.href}const S=bn(r,"hx-request");const _=ie(r).boosted;let E=Q.config.methodsThatUseUrlParams.indexOf(t)>=0;const C={boosted:_,useUrlParams:E,formData:w,parameters:Nn(w),unfilteredFormData:v,unfilteredParameters:Nn(v),headers:y,target:c,verb:t,errors:b,withCredentials:i.credentials||S.credentials||Q.config.withCredentials,timeout:i.timeout||S.timeout||Q.config.timeout,path:n,triggeringEvent:o};if(!de(r,"htmx:configRequest",C)){oe(s);m();return e}n=C.path;t=C.verb;y=C.headers;w=qn(C.parameters);b=C.errors;E=C.useUrlParams;if(b&&b.length>0){de(r,"htmx:validation:halted",C);oe(s);m();return e}const z=n.split("#");const $=z[0];const O=z[1];let R=n;if(E){R=$;const Z=!w.keys().next().done;if(Z){if(R.indexOf("?")<0){R+="?"}else{R+="&"}R+=an(w);if(O){R+="#"+O}}}if(!Tn(r,R,C)){fe(r,"htmx:invalidPath",C);oe(l);return e}p.open(t.toUpperCase(),R,true);p.overrideMimeType("text/html");p.withCredentials=C.withCredentials;p.timeout=C.timeout;if(S.noHeaders){}else{for(const k in y){if(y.hasOwnProperty(k)){const Y=y[k];Cn(p,k,Y)}}}const H={xhr:p,target:c,requestConfig:C,etc:i,boosted:_,select:X,pathInfo:{requestPath:n,finalRequestPath:R,responsePath:null,anchor:O}};p.onload=function(){try{const t=Hn(r);H.pathInfo.responsePath=On(p);M(r,H);if(H.keepIndicators!==true){Qt(T,q)}de(r,"htmx:afterRequest",H);de(r,"htmx:afterOnLoad",H);if(!le(r)){let e=null;while(t.length>0&&e==null){const n=t.shift();if(le(n)){e=n}}if(e){de(e,"htmx:afterRequest",H);de(e,"htmx:afterOnLoad",H)}}oe(s);m()}catch(e){fe(r,"htmx:onLoadError",ce({error:e},H));throw e}};p.onerror=function(){Qt(T,q);fe(r,"htmx:afterRequest",H);fe(r,"htmx:sendError",H);oe(l);m()};p.onabort=function(){Qt(T,q);fe(r,"htmx:afterRequest",H);fe(r,"htmx:sendAbort",H);oe(l);m()};p.ontimeout=function(){Qt(T,q);fe(r,"htmx:afterRequest",H);fe(r,"htmx:timeout",H);oe(l);m()};if(!de(r,"htmx:beforeRequest",H)){oe(s);m();return e}var T=Zt(r);var q=Yt(r);se(["loadstart","loadend","progress","abort"],function(t){se([p,p.upload],function(e){e.addEventListener(t,function(e){de(r,"htmx:xhr:"+t,{lengthComputable:e.lengthComputable,loaded:e.loaded,total:e.total})})})});de(r,"htmx:beforeSend",H);const J=E?null:mn(p,r,w);p.send(J);return e}function An(e,t){const n=t.xhr;let r=null;let o=null;if(O(n,/HX-Push:/i)){r=n.getResponseHeader("HX-Push");o="push"}else if(O(n,/HX-Push-Url:/i)){r=n.getResponseHeader("HX-Push-Url");o="push"}else if(O(n,/HX-Replace-Url:/i)){r=n.getResponseHeader("HX-Replace-Url");o="replace"}if(r){if(r==="false"){return{}}else{return{type:o,path:r}}}const i=t.pathInfo.finalRequestPath;const s=t.pathInfo.responsePath;const l=re(e,"hx-push-url");const c=re(e,"hx-replace-url");const u=ie(e).boosted;let a=null;let f=null;if(l){a="push";f=l}else if(c){a="replace";f=c}else if(u){a="push";f=s||i}if(f){if(f==="false"){return{}}if(f==="true"){f=s||i}if(t.pathInfo.anchor&&f.indexOf("#")===-1){f=f+"#"+t.pathInfo.anchor}return{type:a,path:f}}else{return{}}}function In(e,t){var n=new RegExp(e.code);return n.test(t.toString(10))}function Pn(e){for(var t=0;t<Q.config.responseHandling.length;t++){var n=Q.config.responseHandling[t];if(In(n,e.status)){return n}}return{swap:false}}function kn(e){if(e){const t=r("title");if(t){t.innerHTML=e}else{window.document.title=e}}}function Dn(o,i){const s=i.xhr;let l=i.target;const e=i.etc;const c=i.select;if(!de(o,"htmx:beforeOnLoad",i))return;if(O(s,/HX-Trigger:/i)){Je(s,"HX-Trigger",o)}if(O(s,/HX-Location:/i)){zt();let e=s.getResponseHeader("HX-Location");var t;if(e.indexOf("{")===0){t=S(e);e=t.path;delete t.path}Rn("get",e,t).then(function(){$t(e)});return}const n=O(s,/HX-Refresh:/i)&&s.getResponseHeader("HX-Refresh")==="true";if(O(s,/HX-Redirect:/i)){i.keepIndicators=true;location.href=s.getResponseHeader("HX-Redirect");n&&location.reload();return}if(n){i.keepIndicators=true;location.reload();return}if(O(s,/HX-Retarget:/i)){if(s.getResponseHeader("HX-Retarget")==="this"){i.target=o}else{i.target=ue(ae(o,s.getResponseHeader("HX-Retarget")))}}const u=An(o,i);const r=Pn(s);const a=r.swap;let f=!!r.error;let d=Q.config.ignoreTitle||r.ignoreTitle;let h=r.select;if(r.target){i.target=ue(ae(o,r.target))}var g=e.swapOverride;if(g==null&&r.swapOverride){g=r.swapOverride}if(O(s,/HX-Retarget:/i)){if(s.getResponseHeader("HX-Retarget")==="this"){i.target=o}else{i.target=ue(ae(o,s.getResponseHeader("HX-Retarget")))}}if(O(s,/HX-Reswap:/i)){g=s.getResponseHeader("HX-Reswap")}var p=s.response;var m=ce({shouldSwap:a,serverResponse:p,isError:f,ignoreTitle:d,selectOverride:h,swapOverride:g},i);if(r.event&&!de(l,r.event,m))return;if(!de(l,"htmx:beforeSwap",m))return;l=m.target;p=m.serverResponse;f=m.isError;d=m.ignoreTitle;h=m.selectOverride;g=m.swapOverride;i.target=l;i.failed=f;i.successful=!f;if(m.shouldSwap){if(s.status===286){lt(o)}Ft(o,function(e){p=e.transformResponse(p,s,o)});if(u.type){zt()}var x=gn(o,g);if(!x.hasOwnProperty("ignoreTitle")){x.ignoreTitle=d}l.classList.add(Q.config.swappingClass);let n=null;let r=null;if(c){h=c}if(O(s,/HX-Reselect:/i)){h=s.getResponseHeader("HX-Reselect")}const y=re(o,"hx-select-oob");const b=re(o,"hx-select");let e=function(){try{if(u.type){de(ne().body,"htmx:beforeHistoryUpdate",ce({history:u},i));if(u.type==="push"){$t(u.path);de(ne().body,"htmx:pushedIntoHistory",{path:u.path})}else{Jt(u.path);de(ne().body,"htmx:replacedInHistory",{path:u.path})}}$e(l,p,x,{select:h||b,selectOOB:y,eventInfo:i,anchor:i.pathInfo.anchor,contextElement:o,afterSwapCallback:function(){if(O(s,/HX-Trigger-After-Swap:/i)){let e=o;if(!le(o)){e=ne().body}Je(s,"HX-Trigger-After-Swap",e)}},afterSettleCallback:function(){if(O(s,/HX-Trigger-After-Settle:/i)){let e=o;if(!le(o)){e=ne().body}Je(s,"HX-Trigger-After-Settle",e)}oe(n)}})}catch(e){fe(o,"htmx:swapError",i);oe(r);throw e}};let t=Q.config.globalViewTransitions;if(x.hasOwnProperty("transition")){t=x.transition}if(t&&de(o,"htmx:beforeTransition",i)&&typeof Promise!=="undefined"&&document.startViewTransition){const v=new Promise(function(e,t){n=e;r=t});const w=e;e=function(){document.startViewTransition(function(){w();return v})}}if(x.swapDelay>0){E().setTimeout(e,x.swapDelay)}else{e()}}if(f){fe(o,"htmx:responseError",ce({error:"Response Status Error Code "+s.status+" from "+i.pathInfo.requestPath},i))}}const Mn={};function Xn(){return{init:function(e){return null},getSelectors:function(){return null},onEvent:function(e,t){return true},transformResponse:function(e,t,n){return e},isInlineSwap:function(e){return false},handleSwap:function(e,t,n,r){return false},encodeParameters:function(e,t,n){return null}}}function Fn(e,t){if(t.init){t.init(n)}Mn[e]=ce(Xn(),t)}function Bn(e){delete Mn[e]}function Un(e,n,r){if(n==undefined){n=[]}if(e==undefined){return n}if(r==undefined){r=[]}const t=te(e,"hx-ext");if(t){se(t.split(","),function(e){e=e.replace(/ /g,"");if(e.slice(0,7)=="ignore:"){r.push(e.slice(7));return}if(r.indexOf(e)<0){const t=Mn[e];if(t&&n.indexOf(t)<0){n.push(t)}}})}return Un(ue(c(e)),n,r)}var jn=false;ne().addEventListener("DOMContentLoaded",function(){jn=true});function Vn(e){if(jn||ne().readyState==="complete"){e()}else{ne().addEventListener("DOMContentLoaded",e)}}function _n(){if(Q.config.includeIndicatorStyles!==false){const e=Q.config.inlineStyleNonce?` nonce="${Q.config.inlineStyleNonce}"`:"";ne().head.insertAdjacentHTML("beforeend","<style"+e+">      ."+Q.config.indicatorClass+"{opacity:0}      ."+Q.config.requestClass+" ."+Q.config.indicatorClass+"{opacity:1; transition: opacity 200ms ease-in;}      ."+Q.config.requestClass+"."+Q.config.indicatorClass+"{opacity:1; transition: opacity 200ms ease-in;}      </style>")}}function zn(){const e=ne().querySelector('meta[name="htmx-config"]');if(e){return S(e.content)}else{return null}}function $n(){const e=zn();if(e){Q.config=ce(Q.config,e)}}Vn(function(){$n();_n();let e=ne().body;kt(e);const t=ne().querySelectorAll("[hx-trigger='restored'],[data-hx-trigger='restored']");e.addEventListener("htmx:abort",function(e){const t=e.target;const n=ie(t);if(n&&n.xhr){n.xhr.abort()}});const n=window.onpopstate?window.onpopstate.bind(window):null;window.onpopstate=function(e){if(e.state&&e.state.htmx){Wt();se(t,function(e){de(e,"htmx:restored",{document:ne(),triggerEvent:de})})}else{if(n){n(e)}}};E().setTimeout(function(){de(e,"htmx:load",{});e=null},0)});return Q}();
// End HTMX-Min

// Start uPlot.iife-Min
/*! https://github.com/leeoniya/uPlot (v1.6.30) */
var uPlot=function(){"use strict";const l="u-off",e="u-label",t="width",n="height",i="top",o="bottom",s="left",r="right",u="#000",a=u+"0",f="mousemove",c="mousedown",h="mouseup",d="mouseenter",p="mouseleave",m="dblclick",g="change",x="dppxchange",w="--",_="undefined"!=typeof window,b=_?document:null,v=_?window:null,k=_?navigator:null;let y,M;function S(l,e){if(null!=e){let t=l.classList;!t.contains(e)&&t.add(e)}}function E(l,e){let t=l.classList;t.contains(e)&&t.remove(e)}function T(l,e,t){l.style[e]=t+"px"}function z(l,e,t,n){let i=b.createElement(l);return null!=e&&S(i,e),null!=t&&t.insertBefore(i,n),i}function D(l,e){return z("div",l,e)}const P=new WeakMap;function A(e,t,n,i,o){let s="translate("+t+"px,"+n+"px)";s!=P.get(e)&&(e.style.transform=s,P.set(e,s),0>t||0>n||t>i||n>o?S(e,l):E(e,l))}const W=new WeakMap;function Y(l,e,t){let n=e+t;n!=W.get(l)&&(W.set(l,n),l.style.background=e,l.style.borderColor=t)}const C=new WeakMap;function F(l,e,t,n){let i=e+""+t;i!=C.get(l)&&(C.set(l,i),l.style.height=t+"px",l.style.width=e+"px",l.style.marginLeft=n?-e/2+"px":0,l.style.marginTop=n?-t/2+"px":0)}const H={passive:!0},R={...H,capture:!0};function G(l,e,t,n){e.addEventListener(l,t,n?R:H)}function I(l,e,t,n){e.removeEventListener(l,t,n?R:H)}function L(l,e,t,n){let i;t=t||0;let o=2147483647>=(n=n||e.length-1);for(;n-t>1;)i=o?t+n>>1:tl((t+n)/2),l>e[i]?t=i:n=i;return l-e[t]>e[n]-l?n:t}function O(l,e,t,n){for(let i=1==n?e:t;i>=e&&t>=i;i+=n)if(null!=l[i])return i;return-1}function N(l,e,t,n){let i=ul(l),o=ul(e);l==e&&(-1==i?(l*=t,e/=t):(l/=t,e*=t));let s=10==t?al:fl,r=1==o?il:tl,u=(1==i?tl:il)(s(el(l))),a=r(s(el(e))),f=rl(t,u),c=rl(t,a);return 10==t&&(0>u&&(f=Sl(f,-u)),0>a&&(c=Sl(c,-a))),n||2==t?(l=f*i,e=c*o):(l=Ml(l,f),e=yl(e,c)),[l,e]}function j(l,e,t,n){let i=N(l,e,t,n);return 0==l&&(i[0]=0),0==e&&(i[1]=0),i}_&&function l(){let e=devicePixelRatio;y!=e&&(y=e,M&&I(g,M,l),M=matchMedia(`(min-resolution: ${y-.001}dppx) and (max-resolution: ${y+.001}dppx)`),G(g,M,l),v.dispatchEvent(new CustomEvent(x)))}();const U=.1,B={mode:3,pad:U},V={pad:0,soft:null,mode:0},J={min:V,max:V};function q(l,e,t,n){return Fl(t)?X(l,e,t):(V.pad=t,V.soft=n?0:null,V.mode=n?3:0,X(l,e,J))}function K(l,e){return null==l?e:l}function X(l,e,t){let n=t.min,i=t.max,o=K(n.pad,0),s=K(i.pad,0),r=K(n.hard,-hl),u=K(i.hard,hl),a=K(n.soft,hl),f=K(i.soft,-hl),c=K(n.mode,0),h=K(i.mode,0),d=e-l,p=al(d),m=sl(el(l),el(e)),g=al(m),x=el(g-p);(1e-9>d||x>10)&&(d=0,0!=l&&0!=e||(d=1e-9,2==c&&a!=hl&&(o=0),2==h&&f!=-hl&&(s=0)));let w=d||m||1e3,_=al(w),b=rl(10,tl(_)),v=Sl(Ml(l-w*(0==d?0==l?.1:1:o),b/10),9),k=a>l||1!=c&&(3!=c||v>a)&&(2!=c||a>v)?hl:a,y=sl(r,k>v&&l>=k?k:ol(k,v)),M=Sl(yl(e+w*(0==d?0==e?.1:1:s),b/10),9),S=e>f||1!=h&&(3!=h||f>M)&&(2!=h||M>f)?-hl:f,E=ol(u,M>S&&S>=e?S:sl(S,M));return y==E&&0==y&&(E=100),[y,E]}const Z=new Intl.NumberFormat(_?k.language:"en-US"),$=l=>Z.format(l),Q=Math,ll=Q.PI,el=Q.abs,tl=Q.floor,nl=Q.round,il=Q.ceil,ol=Q.min,sl=Q.max,rl=Q.pow,ul=Q.sign,al=Q.log10,fl=Q.log2,cl=(l,e=1)=>Q.asinh(l/e),hl=1/0;function dl(l){return 1+(0|al((l^l>>31)-(l>>31)))}function pl(l,e,t){return ol(sl(l,e),t)}function ml(l){return"function"==typeof l?l:()=>l}const gl=l=>l,xl=(l,e)=>e,wl=()=>null,_l=()=>!0,bl=(l,e)=>l==e,vl=l=>Sl(l,14);function kl(l,e){return vl(Sl(vl(l/e))*e)}function yl(l,e){return vl(il(vl(l/e))*e)}function Ml(l,e){return vl(tl(vl(l/e))*e)}function Sl(l,e=0){if(Yl(l))return l;let t=10**e;return nl(l*t*(1+Number.EPSILON))/t}const El=new Map;function Tl(l){return((""+l).split(".")[1]||"").length}function zl(l,e,t,n){let i=[],o=n.map(Tl);for(let s=e;t>s;s++){let e=el(s),t=Sl(rl(l,s),e);for(let l=0;n.length>l;l++){let r=n[l]*t,u=(0>r||0>s?e:0)+(o[l]>s?o[l]:0),a=Sl(r,u);i.push(a),El.set(a,u)}}return i}const Dl={},Pl=[],Al=[null,null],Wl=Array.isArray,Yl=Number.isInteger;function Cl(l){return"string"==typeof l}function Fl(l){let e=!1;if(null!=l){let t=l.constructor;e=null==t||t==Object}return e}function Hl(l){return null!=l&&"object"==typeof l}const Rl=Object.getPrototypeOf(Uint8Array);function Gl(l,e=Fl){let t;if(Wl(l)){let n=l.find((l=>null!=l));if(Wl(n)||e(n)){t=Array(l.length);for(let n=0;l.length>n;n++)t[n]=Gl(l[n],e)}else t=l.slice()}else if(l instanceof Rl)t=l.slice();else if(e(l)){t={};for(let n in l)t[n]=Gl(l[n],e)}else t=l;return t}function Il(l){let e=arguments;for(let t=1;e.length>t;t++){let n=e[t];for(let e in n)Fl(l[e])?Il(l[e],Gl(n[e])):l[e]=Gl(n[e])}return l}function Ll(l,e,t){for(let n,i=0,o=-1;e.length>i;i++){let s=e[i];if(s>o){for(n=s-1;n>=0&&null==l[n];)l[n--]=null;for(n=s+1;t>n&&null==l[n];)l[o=n++]=null}}}const Ol="undefined"==typeof queueMicrotask?l=>Promise.resolve().then(l):queueMicrotask,Nl=["January","February","March","April","May","June","July","August","September","October","November","December"],jl=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];function Ul(l){return l.slice(0,3)}const Bl=jl.map(Ul),Vl=Nl.map(Ul),Jl={MMMM:Nl,MMM:Vl,WWWW:jl,WWW:Bl};function ql(l){return(10>l?"0":"")+l}const Kl={YYYY:l=>l.getFullYear(),YY:l=>(l.getFullYear()+"").slice(2),MMMM:(l,e)=>e.MMMM[l.getMonth()],MMM:(l,e)=>e.MMM[l.getMonth()],MM:l=>ql(l.getMonth()+1),M:l=>l.getMonth()+1,DD:l=>ql(l.getDate()),D:l=>l.getDate(),WWWW:(l,e)=>e.WWWW[l.getDay()],WWW:(l,e)=>e.WWW[l.getDay()],HH:l=>ql(l.getHours()),H:l=>l.getHours(),h:l=>{let e=l.getHours();return 0==e?12:e>12?e-12:e},AA:l=>12>l.getHours()?"AM":"PM",aa:l=>12>l.getHours()?"am":"pm",a:l=>12>l.getHours()?"a":"p",mm:l=>ql(l.getMinutes()),m:l=>l.getMinutes(),ss:l=>ql(l.getSeconds()),s:l=>l.getSeconds(),fff:l=>function(l){return(10>l?"00":100>l?"0":"")+l}(l.getMilliseconds())};function Xl(l,e){e=e||Jl;let t,n=[],i=/\{([a-z]+)\}|[^{]+/gi;for(;t=i.exec(l);)n.push("{"==t[0][0]?Kl[t[1]]:t[0]);return l=>{let t="";for(let i=0;n.length>i;i++)t+="string"==typeof n[i]?n[i]:n[i](l,e);return t}}const Zl=(new Intl.DateTimeFormat).resolvedOptions().timeZone,$l=l=>l%1==0,Ql=[1,2,2.5,5],le=zl(10,-16,0,Ql),ee=zl(10,0,16,Ql),te=ee.filter($l),ne=le.concat(ee),ie="{YYYY}",oe="\n"+ie,se="{M}/{D}",re="\n"+se,ue=re+"/{YY}",ae="{aa}",fe="{h}:{mm}"+ae,ce="\n"+fe,he=":{ss}",de=null;function pe(l){let e=1e3*l,t=60*e,n=60*t,i=24*n,o=30*i,s=365*i;return[(1==l?zl(10,0,3,Ql).filter($l):zl(10,-3,0,Ql)).concat([e,5*e,10*e,15*e,30*e,t,5*t,10*t,15*t,30*t,n,2*n,3*n,4*n,6*n,8*n,12*n,i,2*i,3*i,4*i,5*i,6*i,7*i,8*i,9*i,10*i,15*i,o,2*o,3*o,4*o,6*o,s,2*s,5*s,10*s,25*s,50*s,100*s]),[[s,ie,de,de,de,de,de,de,1],[28*i,"{MMM}",oe,de,de,de,de,de,1],[i,se,oe,de,de,de,de,de,1],[n,"{h}"+ae,ue,de,re,de,de,de,1],[t,fe,ue,de,re,de,de,de,1],[e,he,ue+" "+fe,de,re+" "+fe,de,ce,de,1],[l,he+".{fff}",ue+" "+fe,de,re+" "+fe,de,ce,de,1]],function(e){return(r,u,a,f,c,h)=>{let d=[],p=c>=s,m=c>=o&&s>c,g=e(a),x=Sl(g*l,3),w=ye(g.getFullYear(),p?0:g.getMonth(),m||p?1:g.getDate()),_=Sl(w*l,3);if(m||p){let t=m?c/o:0,n=p?c/s:0,i=x==_?x:Sl(ye(w.getFullYear()+n,w.getMonth()+t,1)*l,3),r=new Date(nl(i/l)),u=r.getFullYear(),a=r.getMonth();for(let o=0;f>=i;o++){let s=ye(u+n*o,a+t*o,1),r=s-e(Sl(s*l,3));i=Sl((+s+r)*l,3),i>f||d.push(i)}}else{let o=i>c?c:i,s=_+(tl(a)-tl(x))+yl(x-_,o);d.push(s);let p=e(s),m=p.getHours()+p.getMinutes()/t+p.getSeconds()/n,g=c/n,w=h/r.axes[u]._space;for(;s=Sl(s+c,1==l?0:3),f>=s;)if(g>1){let l=tl(Sl(m+g,6))%24,t=e(s).getHours()-l;t>1&&(t=-1),s-=t*n,m=(m+g)%24,.7>Sl((s-d[d.length-1])/c,3)*w||d.push(s)}else d.push(s)}return d}}]}const[me,ge,xe]=pe(1),[we,_e,be]=pe(.001);function ve(l,e){return l.map((l=>l.map(((t,n)=>0==n||8==n||null==t?t:e(1==n||0==l[8]?t:l[1]+t)))))}function ke(l,e){return(t,n,i,o,s)=>{let r,u,a,f,c,h,d=e.find((l=>s>=l[0]))||e[e.length-1];return n.map((e=>{let t=l(e),n=t.getFullYear(),i=t.getMonth(),o=t.getDate(),s=t.getHours(),p=t.getMinutes(),m=t.getSeconds(),g=n!=r&&d[2]||i!=u&&d[3]||o!=a&&d[4]||s!=f&&d[5]||p!=c&&d[6]||m!=h&&d[7]||d[1];return r=n,u=i,a=o,f=s,c=p,h=m,g(t)}))}}function ye(l,e,t){return new Date(l,e,t)}function Me(l,e){return e(l)}function Se(l,e){return(t,n,i,o)=>null==o?w:e(l(n))}zl(2,-53,53,[1]);const Ee={show:!0,live:!0,isolate:!1,mount:()=>{},markers:{show:!0,width:2,stroke:function(l,e){let t=l.series[e];return t.width?t.stroke(l,e):t.points.width?t.points.stroke(l,e):null},fill:function(l,e){return l.series[e].fill(l,e)},dash:"solid"},idx:null,idxs:null,values:[]},Te=[0,0];function ze(l,e,t,n=!0){return l=>{0==l.button&&(!n||l.target==e)&&t(l)}}function De(l,e,t,n=!0){return l=>{(!n||l.target==e)&&t(l)}}const Pe={show:!0,x:!0,y:!0,lock:!1,move:function(l,e,t){return Te[0]=e,Te[1]=t,Te},points:{show:function(l,e){let i=l.cursor.points,o=D(),s=i.size(l,e);T(o,t,s),T(o,n,s);let r=s/-2;T(o,"marginLeft",r),T(o,"marginTop",r);let u=i.width(l,e,s);return u&&T(o,"borderWidth",u),o},size:function(l,e){return l.series[e].points.size},width:0,stroke:function(l,e){let t=l.series[e].points;return t._stroke||t._fill},fill:function(l,e){let t=l.series[e].points;return t._fill||t._stroke}},bind:{mousedown:ze,mouseup:ze,click:ze,dblclick:ze,mousemove:De,mouseleave:De,mouseenter:De},drag:{setScale:!0,x:!0,y:!1,dist:0,uni:null,click:(l,e)=>{e.stopPropagation(),e.stopImmediatePropagation()},_x:!1,_y:!1},focus:{dist:(l,e,t,n,i)=>n-i,prox:-1,bias:0},hover:{skip:[void 0],prox:null,bias:0},left:-10,top:-10,idx:null,dataIdx:null,idxs:null,event:null},Ae={show:!0,stroke:"rgba(0,0,0,0.07)",width:2},We=Il({},Ae,{filter:xl}),Ye=Il({},We,{size:10}),Ce=Il({},Ae,{show:!1}),Fe='12px system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',He="bold "+Fe,Re={show:!0,scale:"x",stroke:u,space:50,gap:5,size:50,labelGap:0,labelSize:30,labelFont:He,side:2,grid:We,ticks:Ye,border:Ce,font:Fe,lineGap:1.5,rotate:0},Ge={show:!0,scale:"x",auto:!1,sorted:1,min:hl,max:-hl,idxs:[]};function Ie(l,e){return e.map((l=>null==l?"":$(l)))}function Le(l,e,t,n,i,o,s){let r=[],u=El.get(i)||0;for(let l=t=s?t:Sl(yl(t,i),u);n>=l;l=Sl(l+i,u))r.push(Object.is(l,-0)?0:l);return r}function Oe(l,e,t,n,i){const o=[],s=l.scales[l.axes[e].scale].log,r=tl((10==s?al:fl)(t));i=rl(s,r),10==s&&0>r&&(i=Sl(i,-r));let u=t;do{o.push(u),u+=i,10==s&&(u=Sl(u,El.get(i))),i*s>u||(i=u)}while(n>=u);return o}function Ne(l,e,t,n,i){let o=l.scales[l.axes[e].scale].asinh,s=n>o?Oe(l,e,sl(o,t),n,i):[o],r=0>n||t>0?[]:[0];return(-o>t?Oe(l,e,sl(o,-n),-t,i):[o]).reverse().map((l=>-l)).concat(r,s)}const je=/./,Ue=/[12357]/,Be=/[125]/,Ve=/1/,Je=(l,e,t,n)=>l.map(((l,i)=>4==e&&0==l||i%n==0&&t.test(l.toExponential()[0>l?1:0])?l:null));function qe(l,e,t){let n=l.axes[t],i=n.scale,o=l.scales[i],s=l.valToPos,r=n._space,u=s(10,i),a=s(9,i)-u<r?s(7,i)-u<r?s(5,i)-u<r?Ve:Be:Ue:je;if(a==Ve){let l=el(s(1,i)-u);if(r>l)return Je(e.slice().reverse(),o.distr,a,il(r/l)).reverse()}return Je(e,o.distr,a,1)}function Ke(l,e,t){let n=l.axes[t],i=n.scale,o=n._space,s=l.valToPos,r=el(s(1,i)-s(2,i));return o>r?Je(e.slice().reverse(),3,je,il(o/r)).reverse():e}function Xe(l,e,t,n){return null==n?w:null==e?"":$(e)}const Ze={show:!0,scale:"y",stroke:u,space:30,gap:5,size:50,labelGap:0,labelSize:30,labelFont:He,side:3,grid:We,ticks:Ye,border:Ce,font:Fe,lineGap:1.5,rotate:0},$e={scale:null,auto:!0,sorted:0,min:hl,max:-hl},Qe=(l,e,t,n,i)=>i,lt={show:!0,auto:!0,sorted:0,gaps:Qe,alpha:1,facets:[Il({},$e,{scale:"x"}),Il({},$e,{scale:"y"})]},et={scale:"y",auto:!0,sorted:0,show:!0,spanGaps:!1,gaps:Qe,alpha:1,points:{show:function(l,e){let{scale:t,idxs:n}=l.series[0],i=l._data[0],o=l.valToPos(i[n[0]],t,!0),s=l.valToPos(i[n[1]],t,!0);return el(s-o)/(l.series[e].points.space*y)>=n[1]-n[0]},filter:null},values:null,min:hl,max:-hl,idxs:[],path:null,clip:null};function tt(l,e,t){return t/10}const nt={time:!0,auto:!0,distr:1,log:10,asinh:1,min:null,max:null,dir:1,ori:0},it=Il({},nt,{time:!1,ori:1}),ot={};function st(l){let e=ot[l];return e||(e={key:l,plots:[],sub(l){e.plots.push(l)},unsub(l){e.plots=e.plots.filter((e=>e!=l))},pub(l,t,n,i,o,s,r){for(let u=0;e.plots.length>u;u++)e.plots[u]!=t&&e.plots[u].pub(l,t,n,i,o,s,r)}},null!=l&&(ot[l]=e)),e}function rt(l,e,t){const n=l.mode,i=l.series[e],o=2==n?l._data[e]:l._data,s=l.scales,r=l.bbox;let u=o[0],a=2==n?o[1]:o[e],f=2==n?s[i.facets[0].scale]:s[l.series[0].scale],c=2==n?s[i.facets[1].scale]:s[i.scale],h=r.left,d=r.top,p=r.width,m=r.height,g=l.valToPosH,x=l.valToPosV;return 0==f.ori?t(i,u,a,f,c,g,x,h,d,p,m,mt,xt,_t,vt,yt):t(i,u,a,f,c,x,g,d,h,m,p,gt,wt,bt,kt,Mt)}function ut(l,e){let t=0,n=0,i=K(l.bands,Pl);for(let l=0;i.length>l;l++){let o=i[l];o.series[0]==e?t=o.dir:o.series[1]==e&&(n|=1==o.dir?1:2)}return[t,1==n?-1:2==n?1:3==n?2:0]}function at(l,e,t,n,i){let o=l.series[e],s=l.scales[2==l.mode?o.facets[1].scale:o.scale];return-1==i?s.min:1==i?s.max:3==s.distr?1==s.dir?s.min:s.max:0}function ft(l,e,t,n,i,o){return rt(l,e,((l,e,s,r,u,a,f,c,h,d,p)=>{let m=l.pxRound;const g=0==r.ori?xt:wt;let x,w;1==r.dir*(0==r.ori?1:-1)?(x=t,w=n):(x=n,w=t);let _=m(a(e[x],r,d,c)),b=m(f(s[x],u,p,h)),v=m(a(e[w],r,d,c)),k=m(f(1==o?u.max:u.min,u,p,h)),y=new Path2D(i);return g(y,v,k),g(y,_,k),g(y,_,b),y}))}function ct(l,e,t,n,i,o){let s=null;if(l.length>0){s=new Path2D;const r=0==e?_t:bt;let u=t;for(let e=0;l.length>e;e++){let t=l[e];if(t[1]>t[0]){let l=t[0]-u;l>0&&r(s,u,n,l,n+o),u=t[1]}}let a=t+i-u,f=10;a>0&&r(s,u,n-f/2,a,n+o+f)}return s}function ht(l,e,t,n,i,o,s){let r=[],u=l.length;for(let a=1==i?t:n;a>=t&&n>=a;a+=i)if(null===e[a]){let f=a,c=a;if(1==i)for(;++a<=n&&null===e[a];)c=a;else for(;--a>=t&&null===e[a];)c=a;let h=o(l[f]),d=c==f?h:o(l[c]),p=f-i;h=s>0||0>p||p>=u?h:o(l[p]);let m=c+i;d=0>s||0>m||m>=u?d:o(l[m]),h>d||r.push([h,d])}return r}function dt(l){return 0==l?gl:1==l?nl:e=>kl(e,l)}function pt(l){let e=0==l?mt:gt,t=0==l?(l,e,t,n,i,o)=>{l.arcTo(e,t,n,i,o)}:(l,e,t,n,i,o)=>{l.arcTo(t,e,i,n,o)},n=0==l?(l,e,t,n,i)=>{l.rect(e,t,n,i)}:(l,e,t,n,i)=>{l.rect(t,e,i,n)};return(l,i,o,s,r,u=0,a=0)=>{0==u&&0==a?n(l,i,o,s,r):(u=ol(u,s/2,r/2),a=ol(a,s/2,r/2),e(l,i+u,o),t(l,i+s,o,i+s,o+r,u),t(l,i+s,o+r,i,o+r,a),t(l,i,o+r,i,o,a),t(l,i,o,i+s,o,u),l.closePath())}}const mt=(l,e,t)=>{l.moveTo(e,t)},gt=(l,e,t)=>{l.moveTo(t,e)},xt=(l,e,t)=>{l.lineTo(e,t)},wt=(l,e,t)=>{l.lineTo(t,e)},_t=pt(0),bt=pt(1),vt=(l,e,t,n,i,o)=>{l.arc(e,t,n,i,o)},kt=(l,e,t,n,i,o)=>{l.arc(t,e,n,i,o)},yt=(l,e,t,n,i,o,s)=>{l.bezierCurveTo(e,t,n,i,o,s)},Mt=(l,e,t,n,i,o,s)=>{l.bezierCurveTo(t,e,i,n,s,o)};function St(){return(l,e,t,n,i)=>rt(l,e,((e,o,s,r,u,a,f,c,h,d,p)=>{let m,g,{pxRound:x,points:w}=e;0==r.ori?(m=mt,g=vt):(m=gt,g=kt);const _=Sl(w.width*y,3);let b=(w.size-w.width)/2*y,v=Sl(2*b,3),k=new Path2D,M=new Path2D,{left:S,top:E,width:T,height:z}=l.bbox;_t(M,S-v,E-v,T+2*v,z+2*v);const D=l=>{if(null!=s[l]){let e=x(a(o[l],r,d,c)),t=x(f(s[l],u,p,h));m(k,e+b,t),g(k,e,t,b,0,2*ll)}};if(i)i.forEach(D);else for(let l=t;n>=l;l++)D(l);return{stroke:_>0?k:null,fill:k,clip:M,flags:3}}))}function Et(l){return(e,t,n,i,o,s)=>{n!=i&&(o!=n&&s!=n&&l(e,t,n),o!=i&&s!=i&&l(e,t,i),l(e,t,s))}}const Tt=Et(xt),zt=Et(wt);function Dt(l){const e=K(l?.alignGaps,0);return(l,t,n,i)=>rt(l,t,((o,s,r,u,a,f,c,h,d,p,m)=>{let g,x,w=o.pxRound,_=l=>w(f(l,u,p,h)),b=l=>w(c(l,a,m,d));0==u.ori?(g=xt,x=Tt):(g=wt,x=zt);const v=u.dir*(0==u.ori?1:-1),k={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:1},y=k.stroke;let M,S,E,T=hl,z=-hl,D=_(s[1==v?n:i]),P=O(r,n,i,1*v),A=O(r,n,i,-1*v),W=_(s[P]),Y=_(s[A]),C=!1;for(let l=1==v?n:i;l>=n&&i>=l;l+=v){let e=_(s[l]),t=r[l];e==D?null!=t?(S=b(t),T==hl&&(g(y,e,S),M=S),T=ol(S,T),z=sl(S,z)):null===t&&(C=!0):(T!=hl&&(x(y,D,T,z,M,S),E=D),null!=t?(S=b(t),g(y,e,S),T=z=M=S):(T=hl,z=-hl,null===t&&(C=!0)),D=e)}T!=hl&&T!=z&&E!=D&&x(y,D,T,z,M,S);let[F,H]=ut(l,t);if(null!=o.fill||0!=F){let e=k.fill=new Path2D(y),n=b(o.fillTo(l,t,o.min,o.max,F));g(e,Y,n),g(e,W,n)}if(!o.spanGaps){let a=[];C&&a.push(...ht(s,r,n,i,v,_,e)),k.gaps=a=o.gaps(l,t,n,i,a),k.clip=ct(a,u.ori,h,d,p,m)}return 0!=H&&(k.band=2==H?[ft(l,t,n,i,y,-1),ft(l,t,n,i,y,1)]:ft(l,t,n,i,y,H)),k}))}function Pt(l,e,t,n,i,o,s=hl){if(l.length>1){let r=null;for(let u=0,a=1/0;l.length>u;u++)if(void 0!==e[u]){if(null!=r){let e=el(l[u]-l[r]);a>e&&(a=e,s=el(t(l[u],n,i,o)-t(l[r],n,i,o)))}r=u}}return s}function At(l,e,t,n,i){const o=l.length;if(2>o)return null;const s=new Path2D;if(t(s,l[0],e[0]),2==o)n(s,l[1],e[1]);else{let t=Array(o),n=Array(o-1),r=Array(o-1),u=Array(o-1);for(let t=0;o-1>t;t++)r[t]=e[t+1]-e[t],u[t]=l[t+1]-l[t],n[t]=r[t]/u[t];t[0]=n[0];for(let l=1;o-1>l;l++)0===n[l]||0===n[l-1]||n[l-1]>0!=n[l]>0?t[l]=0:(t[l]=3*(u[l-1]+u[l])/((2*u[l]+u[l-1])/n[l-1]+(u[l]+2*u[l-1])/n[l]),isFinite(t[l])||(t[l]=0));t[o-1]=n[o-2];for(let n=0;o-1>n;n++)i(s,l[n]+u[n]/3,e[n]+t[n]*u[n]/3,l[n+1]-u[n]/3,e[n+1]-t[n+1]*u[n]/3,l[n+1],e[n+1])}return s}const Wt=new Set;function Yt(){for(let l of Wt)l.syncRect(!0)}_&&(G("resize",v,Yt),G("scroll",v,Yt,!0),G(x,v,(()=>{qt.pxRatio=y})));const Ct=Dt(),Ft=St();function Ht(l,e,t,n){return(n?[l[0],l[1]].concat(l.slice(2)):[l[0]].concat(l.slice(1))).map(((l,n)=>Rt(l,n,e,t)))}function Rt(l,e,t,n){return Il({},0==e?t:n,l)}function Gt(l,e,t){return null==e?Al:[e,t]}const It=Gt;function Lt(l,e,t){return null==e?Al:q(e,t,U,!0)}function Ot(l,e,t,n){return null==e?Al:N(e,t,l.scales[n].log,!1)}const Nt=Ot;function jt(l,e,t,n){return null==e?Al:j(e,t,l.scales[n].log,!1)}const Ut=jt;function Bt(l,e,t,n,i){let o=sl(dl(l),dl(e)),s=e-l,r=L(i/n*s,t);do{let l=t[r],e=n*l/s;if(e>=i&&17>=o+(5>l?El.get(l):0))return[l,e]}while(++r<t.length);return[0,0]}function Vt(l){let e,t;return[l=l.replace(/(\d+)px/,((l,n)=>(e=nl((t=+n)*y))+"px")),e,t]}function Jt(l){l.show&&[l.font,l.labelFont].forEach((l=>{let e=Sl(l[2]*y,1);l[0]=l[0].replace(/[0-9.]+px/,e+"px"),l[1]=e}))}function qt(u,g,_){const k={mode:K(u.mode,1)},M=k.mode;function P(l,e){return((3==e.distr?al(l>0?l:e.clamp(k,l,e.min,e.max,e.key)):4==e.distr?cl(l,e.asinh):l)-e._min)/(e._max-e._min)}function W(l,e,t,n){let i=P(l,e);return n+t*(-1==e.dir?1-i:i)}function C(l,e,t,n){let i=P(l,e);return n+t*(-1==e.dir?i:1-i)}function H(l,e,t,n){return 0==e.ori?W(l,e,t,n):C(l,e,t,n)}k.valToPosH=W,k.valToPosV=C;let R=!1;k.status=0;const O=k.root=D("uplot");null!=u.id&&(O.id=u.id),S(O,u.class),u.title&&(D("u-title",O).textContent=u.title);const V=z("canvas"),J=k.ctx=V.getContext("2d"),X=D("u-wrap",O);G("click",X,(l=>{l.target===$&&(Fn!=An||Hn!=Wn)&&Bn.click(k,l)}),!0);const Z=k.under=D("u-under",X);X.appendChild(V);const $=k.over=D("u-over",X),tl=+K((u=Gl(u)).pxAlign,1),ul=dt(tl);(u.plugins||[]).forEach((l=>{l.opts&&(u=l.opts(k,u)||u)}));const fl=u.ms||.001,dl=k.series=1==M?Ht(u.series||[],Ge,et,!1):function(l,e){return l.map(((l,t)=>0==t?null:Il({},e,l)))}(u.series||[null],lt),gl=k.axes=Ht(u.axes||[],Re,Ze,!0),vl=k.scales={},Ml=k.bands=u.bands||[];Ml.forEach((l=>{l.fill=ml(l.fill||null),l.dir=K(l.dir,-1)}));const zl=2==M?dl[1].facets[0].scale:dl[0].scale,Yl={axes:function(){for(let l=0;gl.length>l;l++){let e=gl[l];if(!e.show||!e._show)continue;let t,n,u=e.side,a=u%2,f=e.stroke(k,l),c=0==u||3==u?-1:1;if(e.label){let l=nl((e._lpos+e.labelGap*c)*y);hn(e.labelFont[0],f,"center",2==u?i:o),J.save(),1==a?(t=n=0,J.translate(l,nl($e+ot/2)),J.rotate((3==u?-ll:ll)/2)):(t=nl(Je+Qe/2),n=l),J.fillText(e.label,t,n),J.restore()}let[h,d]=e._found;if(0==d)continue;let p=vl[e.scale],m=0==a?Qe:ot,g=0==a?Je:$e,x=nl(e.gap*y),w=e._splits,_=2==p.distr?w.map((l=>rn[l])):w,b=2==p.distr?rn[w[1]]-rn[w[0]]:h,v=e.ticks,M=e.border,S=v.show?nl(v.size*y):0,E=e._rotate*-ll/180,T=ul(e._pos*y),z=T+(S+x)*c;n=0==a?z:0,t=1==a?z:0,hn(e.font[0],f,1==e.align?s:2==e.align?r:E>0?s:0>E?r:0==a?"center":3==u?r:s,E||1==a?"middle":2==u?i:o);let D=e.font[1]*e.lineGap,P=w.map((l=>ul(H(l,p,m,g)))),A=e._values;for(let l=0;A.length>l;l++){let e=A[l];if(null!=e){0==a?t=P[l]:n=P[l],e=""+e;let i=-1==e.indexOf("\n")?[e]:e.split(/\n/gm);for(let l=0;i.length>l;l++){let e=i[l];E?(J.save(),J.translate(t,n+l*D),J.rotate(E),J.fillText(e,0,0),J.restore()):J.fillText(e,t,n+l*D)}}}v.show&&vn(P,v.filter(k,_,l,d,b),a,u,T,S,Sl(v.width*y,3),v.stroke(k,l),v.dash,v.cap);let W=e.grid;W.show&&vn(P,W.filter(k,_,l,d,b),a,0==a?2:1,0==a?$e:Je,0==a?ot:Qe,Sl(W.width*y,3),W.stroke(k,l),W.dash,W.cap),M.show&&vn([T],[1],0==a?1:0,0==a?1:2,1==a?$e:Je,1==a?ot:Qe,Sl(M.width*y,3),M.stroke(k,l),M.dash,M.cap)}Ti("drawAxes")},series:function(){At>0&&(dl.forEach(((l,e)=>{if(e>0&&l.show&&(mn(e,!1),mn(e,!0),null==l._paths)){sn!=l.alpha&&(J.globalAlpha=sn=l.alpha);let t=2==M?[0,g[e][0].length-1]:function(l){let e=pl(Yt-1,0,At-1),t=pl(qt+1,0,At-1);for(;null==l[e]&&e>0;)e--;for(;null==l[t]&&At-1>t;)t++;return[e,t]}(g[e]);l._paths=l.paths(k,e,t[0],t[1]),1!=sn&&(J.globalAlpha=sn=1)}})),dl.forEach(((l,e)=>{if(e>0&&l.show){sn!=l.alpha&&(J.globalAlpha=sn=l.alpha),null!=l._paths&&gn(e,!1);{let t=null!=l._paths?l._paths.gaps:null,n=l.points.show(k,e,Yt,qt,t),i=l.points.filter(k,e,n,t);(n||i)&&(l.points._paths=l.points.paths(k,e,Yt,qt,i),gn(e,!0))}1!=sn&&(J.globalAlpha=sn=1),Ti("drawSeries",e)}})))}},Rl=(u.drawOrder||["axes","series"]).map((l=>Yl[l]));function Ll(l){let e=vl[l];if(null==e){let t=(u.scales||Dl)[l]||Dl;if(null!=t.from)Ll(t.from),vl[l]=Il({},vl[t.from],t,{key:l});else{e=vl[l]=Il({},l==zl?nt:it,t),e.key=l;let n=e.time,i=e.range,o=Wl(i);if((l!=zl||2==M&&!n)&&(!o||null!=i[0]&&null!=i[1]||(i={min:null==i[0]?B:{mode:1,hard:i[0],soft:i[0]},max:null==i[1]?B:{mode:1,hard:i[1],soft:i[1]}},o=!1),!o&&Fl(i))){let l=i;i=(e,t,n)=>null==t?Al:q(t,n,l)}e.range=ml(i||(n?It:l==zl?3==e.distr?Nt:4==e.distr?Ut:Gt:3==e.distr?Ot:4==e.distr?jt:Lt)),e.auto=ml(!o&&e.auto),e.clamp=ml(e.clamp||tt),e._min=e._max=null}}}Ll("x"),Ll("y"),1==M&&dl.forEach((l=>{Ll(l.scale)})),gl.forEach((l=>{Ll(l.scale)}));for(let l in u.scales)Ll(l);const Nl=vl[zl],jl=Nl.distr;let Ul,Bl;0==Nl.ori?(S(O,"u-hz"),Ul=W,Bl=C):(S(O,"u-vt"),Ul=C,Bl=W);const Vl={};for(let l in vl){let e=vl[l];null==e.min&&null==e.max||(Vl[l]={min:e.min,max:e.max},e.min=e.max=null)}const Jl=u.tzDate||(l=>new Date(nl(l/fl))),ql=u.fmtDate||Xl,Kl=1==fl?xe(Jl):be(Jl),Zl=ke(Jl,ve(1==fl?ge:_e,ql)),$l=Se(Jl,Me("{YYYY}-{MM}-{DD} {h}:{mm}{aa}",ql)),Ql=[],le=k.legend=Il({},Ee,u.legend),ee=le.show,ie=le.markers;let oe,se,re;le.idxs=Ql,ie.width=ml(ie.width),ie.dash=ml(ie.dash),ie.stroke=ml(ie.stroke),ie.fill=ml(ie.fill);let ue,ae=[],fe=[],ce=!1,he={};if(le.live){const l=dl[1]?dl[1].values:null;ce=null!=l,ue=ce?l(k,1,0):{_:0};for(let l in ue)he[l]=w}if(ee)if(oe=z("table","u-legend",O),re=z("tbody",null,oe),le.mount(k,oe),ce){se=z("thead",null,oe,re);let l=z("tr",null,se);for(var de in z("th",null,l),ue)z("th",e,l).textContent=de}else S(oe,"u-inline"),le.live&&S(oe,"u-live");const pe={show:!0},ye={show:!1},Te=new Map;function ze(l,e,t,n=!0){const i=Te.get(e)||{},o=wt.bind[l](k,e,t,n);o&&(G(l,e,i[l]=o),Te.set(e,i))}function De(l,e){const t=Te.get(e)||{};for(let n in t)null!=l&&n!=l||(I(n,e,t[n]),delete t[n]);null==l&&Te.delete(e)}let Ae=0,We=0,Ye=0,Ce=0,Fe=0,He=0,je=Fe,Ue=He,Be=Ye,Ve=Ce,Je=0,$e=0,Qe=0,ot=0;k.bbox={};let rt=!1,ut=!1,ft=!1,ct=!1,ht=!1,pt=!1;function mt(l,e,t){(t||l!=k.width||e!=k.height)&&gt(l,e),Mn(!1),ft=!0,ut=!0,On()}function gt(l,e){k.width=Ae=Ye=l,k.height=We=Ce=e,Fe=He=0,function(){let l=!1,e=!1,t=!1,n=!1;gl.forEach((i=>{if(i.show&&i._show){let{side:o,_size:s}=i,r=s+(null!=i.label?i.labelSize:0);r>0&&(o%2?(Ye-=r,3==o?(Fe+=r,n=!0):t=!0):(Ce-=r,0==o?(He+=r,l=!0):e=!0))}})),Tt[0]=l,Tt[1]=t,Tt[2]=e,Tt[3]=n,Ye-=Pt[1]+Pt[3],Fe+=Pt[3],Ce-=Pt[2]+Pt[0],He+=Pt[0]}(),function(){let l=Fe+Ye,e=He+Ce,t=Fe,n=He;function i(i,o){switch(i){case 1:return l+=o,l-o;case 2:return e+=o,e-o;case 3:return t-=o,t+o;case 0:return n-=o,n+o}}gl.forEach((l=>{if(l.show&&l._show){let e=l.side;l._pos=i(e,l._size),null!=l.label&&(l._lpos=i(e,l.labelSize))}}))}();let t=k.bbox;Je=t.left=kl(Fe*y,.5),$e=t.top=kl(He*y,.5),Qe=t.width=kl(Ye*y,.5),ot=t.height=kl(Ce*y,.5)}const xt=3;k.setSize=function({width:l,height:e}){mt(l,e)};const wt=k.cursor=Il({},Pe,{drag:{y:2==M}},u.cursor);if(null==wt.dataIdx){let l=wt.hover,e=l.skip=new Set(l.skip??[]);e.add(void 0);let t=l.prox=ml(l.prox),n=l.bias??=0;wt.dataIdx=(l,i,o,s)=>{if(0==i)return o;let r=o,u=t(l,i,o,s)??hl,a=u>=0&&hl>u,f=0==Nl.ori?Ye:Ce,c=wt.left,h=g[0],d=g[i];if(e.has(d[o])){r=null;let l,t=null,i=null;if(0==n||-1==n)for(l=o;null==t&&l-- >0;)e.has(d[l])||(t=l);if(0==n||1==n)for(l=o;null==i&&l++<d.length;)e.has(d[l])||(i=l);if(null!=t||null!=i)if(a){let l=c-(null==t?-1/0:Ul(h[t],Nl,f,0)),e=(null==i?1/0:Ul(h[i],Nl,f,0))-c;l>e?e>u||(r=i):l>u||(r=t)}else r=null==i?t:null==t||o-t>i-o?i:t}else a&&el(c-Ul(h[o],Nl,f,0))>u&&(r=null);return r}}const _t=l=>{wt.event=l};wt.idxs=Ql,wt._lock=!1;let bt=wt.points;bt.show=ml(bt.show),bt.size=ml(bt.size),bt.stroke=ml(bt.stroke),bt.width=ml(bt.width),bt.fill=ml(bt.fill);const vt=k.focus=Il({},u.focus||{alpha:.3},wt.focus),kt=vt.prox>=0;let yt=[null],Mt=[null],St=[null];function Et(t,n){if(1==M||n>0){let l=1==M&&vl[t.scale].time,e=t.value;t.value=l?Cl(e)?Se(Jl,Me(e,ql)):e||$l:e||Xe,t.label=t.label||(l?"Time":"Value")}if(n>0){t.width=null==t.width?1:t.width,t.paths=t.paths||Ct||wl,t.fillTo=ml(t.fillTo||at),t.pxAlign=+K(t.pxAlign,tl),t.pxRound=dt(t.pxAlign),t.stroke=ml(t.stroke||null),t.fill=ml(t.fill||null),t._stroke=t._fill=t._paths=t._focus=null;let l=function(l){return Sl(1*(3+2*(l||1)),3)}(sl(1,t.width)),e=t.points=Il({},{size:l,width:sl(1,.2*l),stroke:t.stroke,space:2*l,paths:Ft,_stroke:null,_fill:null},t.points);e.show=ml(e.show),e.filter=ml(e.filter),e.fill=ml(e.fill),e.stroke=ml(e.stroke),e.paths=ml(e.paths),e.pxAlign=t.pxAlign}if(ee){let i=function(t,n){if(0==n&&(ce||!le.live||2==M))return Al;let i=[],o=z("tr","u-series",re,re.childNodes[n]);S(o,t.class),t.show||S(o,l);let s=z("th",null,o);if(ie.show){let l=D("u-marker",s);if(n>0){let e=ie.width(k,n);e&&(l.style.border=e+"px "+ie.dash(k,n)+" "+ie.stroke(k,n)),l.style.background=ie.fill(k,n)}}let r=D(e,s);for(var u in r.textContent=t.label,n>0&&(ie.show||(r.style.color=t.width>0?ie.stroke(k,n):ie.fill(k,n)),ze("click",s,(l=>{if(wt._lock)return;_t(l);let e=dl.indexOf(t);if((l.ctrlKey||l.metaKey)!=le.isolate){let l=dl.some(((l,t)=>t>0&&t!=e&&l.show));dl.forEach(((t,n)=>{n>0&&$n(n,l?n==e?pe:ye:pe,!0,Di.setSeries)}))}else $n(e,{show:!t.show},!0,Di.setSeries)}),!1),kt&&ze(d,s,(l=>{wt._lock||(_t(l),$n(dl.indexOf(t),ti,!0,Di.setSeries))}),!1)),ue){let l=z("td","u-value",o);l.textContent="--",i.push(l)}return[o,i]}(t,n);ae.splice(n,0,i[0]),fe.splice(n,0,i[1]),le.values.push(null)}if(wt.show){Ql.splice(n,0,null);let l=function(l,e){if(e>0){let t=wt.points.show(k,e);if(t)return S(t,"u-cursor-pt"),S(t,l.class),A(t,-10,-10,Ye,Ce),$.insertBefore(t,yt[e]),t}}(t,n);null!=l&&(yt.splice(n,0,l),Mt.splice(n,0,0),St.splice(n,0,0))}Ti("addSeries",n)}k.addSeries=function(l,e){e=null==e?dl.length:e,l=1==M?Rt(l,e,Ge,et):Rt(l,e,null,lt),dl.splice(e,0,l),Et(dl[e],e)},k.delSeries=function(l){if(dl.splice(l,1),ee){le.values.splice(l,1),fe.splice(l,1);let e=ae.splice(l,1)[0];De(null,e.firstChild),e.remove()}wt.show&&(Ql.splice(l,1),yt.length>1&&(yt.splice(l,1)[0].remove(),Mt.splice(l,1),St.splice(l,1))),Ti("delSeries",l)};const Tt=[!1,!1,!1,!1];function zt(l,e,t){let[n,i,o,s]=t,r=e%2,u=0;return 0==r&&(s||i)&&(u=0==e&&!n||2==e&&!o?nl(Re.size/3):0),1==r&&(n||o)&&(u=1==e&&!i||3==e&&!s?nl(Ze.size/2):0),u}const Dt=k.padding=(u.padding||[zt,zt,zt,zt]).map((l=>ml(K(l,zt)))),Pt=k._padding=Dt.map(((l,e)=>l(k,e,Tt,0)));let At,Yt=null,qt=null;const Kt=1==M?dl[0].idxs:null;let Xt,Zt,$t,Qt,ln,en,tn,nn,on,sn,rn=null,un=!1;function an(l,e){if(k.data=k._data=g=null==l?[]:l,2==M){At=0;for(let l=1;dl.length>l;l++)At+=g[l][0].length}else{0==g.length&&(k.data=k._data=g=[[]]),rn=g[0],At=rn.length;let l=g;if(2==jl){l=g.slice();let e=l[0]=Array(At);for(let l=0;At>l;l++)e[l]=l}k._data=g=l}if(Mn(!0),Ti("setData"),2==jl&&(ft=!0),!1!==e){let l=Nl;l.auto(k,un)?fn():Zn(zl,l.min,l.max),ct=ct||wt.left>=0,pt=!0,On()}}function fn(){let l,e;un=!0,1==M&&(At>0?(Yt=Kt[0]=0,qt=Kt[1]=At-1,l=g[0][Yt],e=g[0][qt],2==jl?(l=Yt,e=qt):l==e&&(3==jl?[l,e]=N(l,l,Nl.log,!1):4==jl?[l,e]=j(l,l,Nl.log,!1):Nl.time?e=l+nl(86400/fl):[l,e]=q(l,e,U,!0))):(Yt=Kt[0]=l=null,qt=Kt[1]=e=null)),Zn(zl,l,e)}function cn(l,e,t,n,i,o){l??=a,t??=Pl,n??="butt",i??=a,o??="round",l!=Xt&&(J.strokeStyle=Xt=l),i!=Zt&&(J.fillStyle=Zt=i),e!=$t&&(J.lineWidth=$t=e),o!=ln&&(J.lineJoin=ln=o),n!=en&&(J.lineCap=en=n),t!=Qt&&J.setLineDash(Qt=t)}function hn(l,e,t,n){e!=Zt&&(J.fillStyle=Zt=e),l!=tn&&(J.font=tn=l),t!=nn&&(J.textAlign=nn=t),n!=on&&(J.textBaseline=on=n)}function dn(l,e,t,n,i=0){if(n.length>0&&l.auto(k,un)&&(null==e||null==e.min)){let e=K(Yt,0),o=K(qt,n.length-1),s=null==t.min?3==l.distr?function(l,e,t){let n=hl,i=-hl;for(let o=e;t>=o;o++){let e=l[o];null!=e&&e>0&&(n>e&&(n=e),e>i&&(i=e))}return[n,i]}(n,e,o):function(l,e,t,n){let i=hl,o=-hl;if(1==n)i=l[e],o=l[t];else if(-1==n)i=l[t],o=l[e];else for(let n=e;t>=n;n++){let e=l[n];null!=e&&(i>e&&(i=e),e>o&&(o=e))}return[i,o]}(n,e,o,i):[t.min,t.max];l.min=ol(l.min,t.min=s[0]),l.max=sl(l.max,t.max=s[1])}}k.setData=an;const pn={min:null,max:null};function mn(l,e){let t=e?dl[l].points:dl[l];t._stroke=t.stroke(k,l),t._fill=t.fill(k,l)}function gn(l,e){let t=e?dl[l].points:dl[l],{stroke:n,fill:i,clip:o,flags:s,_stroke:r=t._stroke,_fill:u=t._fill,_width:a=t.width}=t._paths;a=Sl(a*y,3);let f=null,c=a%2/2;e&&null==u&&(u=a>0?"#fff":r);let h=1==t.pxAlign&&c>0;if(h&&J.translate(c,c),!e){let l=Je-a/2,e=$e-a/2,t=Qe+a,n=ot+a;f=new Path2D,f.rect(l,e,t,n)}e?wn(r,a,t.dash,t.cap,u,n,i,s,o):function(l,e,t,n,i,o,s,r,u,a,f){let c=!1;0!=u&&Ml.forEach(((h,d)=>{if(h.series[0]==l){let l,p=dl[h.series[1]],m=g[h.series[1]],x=(p._paths||Dl).band;Wl(x)&&(x=1==h.dir?x[0]:x[1]);let w=null;p.show&&x&&function(l,e,t){for(e=K(e,0),t=K(t,l.length-1);t>=e;){if(null!=l[e])return!0;e++}return!1}(m,Yt,qt)?(w=h.fill(k,d)||o,l=p._paths.clip):x=null,wn(e,t,n,i,w,s,r,u,a,f,l,x),c=!0}})),c||wn(e,t,n,i,o,s,r,u,a,f)}(l,r,a,t.dash,t.cap,u,n,i,s,f,o),h&&J.translate(-c,-c)}const xn=3;function wn(l,e,t,n,i,o,s,r,u,a,f,c){cn(l,e,t,n,i),(u||a||c)&&(J.save(),u&&J.clip(u),a&&J.clip(a)),c?(r&xn)==xn?(J.clip(c),f&&J.clip(f),bn(i,s),_n(l,o,e)):2&r?(bn(i,s),J.clip(c),_n(l,o,e)):1&r&&(J.save(),J.clip(c),f&&J.clip(f),bn(i,s),J.restore(),_n(l,o,e)):(bn(i,s),_n(l,o,e)),(u||a||c)&&J.restore()}function _n(l,e,t){t>0&&(e instanceof Map?e.forEach(((l,e)=>{J.strokeStyle=Xt=e,J.stroke(l)})):null!=e&&l&&J.stroke(e))}function bn(l,e){e instanceof Map?e.forEach(((l,e)=>{J.fillStyle=Zt=e,J.fill(l)})):null!=e&&l&&J.fill(e)}function vn(l,e,t,n,i,o,s,r,u,a){let f=s%2/2;1==tl&&J.translate(f,f),cn(r,s,u,a,r),J.beginPath();let c,h,d,p,m=i+(0==n||3==n?-o:o);0==t?(h=i,p=m):(c=i,d=m);for(let n=0;l.length>n;n++)null!=e[n]&&(0==t?c=d=l[n]:h=p=l[n],J.moveTo(c,h),J.lineTo(d,p));J.stroke(),1==tl&&J.translate(-f,-f)}function kn(l){let e=!0;return gl.forEach(((t,n)=>{if(!t.show)return;let i=vl[t.scale];if(null==i.min)return void(t._show&&(e=!1,t._show=!1,Mn(!1)));t._show||(e=!1,t._show=!0,Mn(!1));let o=t.side,s=o%2,{min:r,max:u}=i,[a,f]=function(l,e,t,n){let i,o=gl[l];if(n>0){let s=o._space=o.space(k,l,e,t,n);i=Bt(e,t,o._incrs=o.incrs(k,l,e,t,n,s),n,s)}else i=[0,0];return o._found=i}(n,r,u,0==s?Ye:Ce);if(0==f)return;let c=t._splits=t.splits(k,n,r,u,a,f,2==i.distr),h=2==i.distr?c.map((l=>rn[l])):c,d=2==i.distr?rn[c[1]]-rn[c[0]]:a,p=t._values=t.values(k,t.filter(k,h,n,f,d),n,f,d);t._rotate=2==o?t.rotate(k,p,n,f):0;let m=t._size;t._size=il(t.size(k,p,n,l)),null!=m&&t._size!=m&&(e=!1)})),e}function yn(l){let e=!0;return Dt.forEach(((t,n)=>{let i=t(k,n,Tt,l);i!=Pt[n]&&(e=!1),Pt[n]=i})),e}function Mn(l){dl.forEach(((e,t)=>{t>0&&(e._paths=null,l&&(1==M?(e.min=null,e.max=null):e.facets.forEach((l=>{l.min=null,l.max=null}))))}))}let Sn,En,Tn,zn,Dn,Pn,An,Wn,Yn,Cn,Fn,Hn,Rn=!1,Gn=!1,In=[];function Ln(){Gn=!1;for(let l=0;In.length>l;l++)Ti(...In[l]);In.length=0}function On(){Rn||(Ol(Nn),Rn=!0)}function Nn(){if(rt&&(function(){for(let l in vl){let e=vl[l];null==Vl[l]&&(null==e.min||null!=Vl[zl]&&e.auto(k,un))&&(Vl[l]=pn)}for(let l in vl){let e=vl[l];null==Vl[l]&&null!=e.from&&null!=Vl[e.from]&&(Vl[l]=pn)}null!=Vl[zl]&&Mn(!0);let l={};for(let e in Vl){let t=Vl[e];if(null!=t){let n=l[e]=Gl(vl[e],Hl);if(null!=t.min)Il(n,t);else if(e!=zl||2==M)if(0==At&&null==n.from){let l=n.range(k,null,null,e);n.min=l[0],n.max=l[1]}else n.min=hl,n.max=-hl}}if(At>0){dl.forEach(((e,t)=>{if(1==M){let n=e.scale,i=Vl[n];if(null==i)return;let o=l[n];if(0==t){let l=o.range(k,o.min,o.max,n);o.min=l[0],o.max=l[1],Yt=L(o.min,g[0]),qt=L(o.max,g[0]),qt-Yt>1&&(o.min>g[0][Yt]&&Yt++,g[0][qt]>o.max&&qt--),e.min=rn[Yt],e.max=rn[qt]}else e.show&&e.auto&&dn(o,i,e,g[t],e.sorted);e.idxs[0]=Yt,e.idxs[1]=qt}else if(t>0&&e.show&&e.auto){let[n,i]=e.facets,o=n.scale,s=i.scale,[r,u]=g[t],a=l[o],f=l[s];null!=a&&dn(a,Vl[o],n,r,n.sorted),null!=f&&dn(f,Vl[s],i,u,i.sorted),e.min=i.min,e.max=i.max}}));for(let e in l){let t=l[e],n=Vl[e];if(null==t.from&&(null==n||null==n.min)){let l=t.range(k,t.min==hl?null:t.min,t.max==-hl?null:t.max,e);t.min=l[0],t.max=l[1]}}}for(let e in l){let t=l[e];if(null!=t.from){let n=l[t.from];if(null==n.min)t.min=t.max=null;else{let l=t.range(k,n.min,n.max,e);t.min=l[0],t.max=l[1]}}}let e={},t=!1;for(let n in l){let i=l[n],o=vl[n];if(o.min!=i.min||o.max!=i.max){o.min=i.min,o.max=i.max;let l=o.distr;o._min=3==l?al(o.min):4==l?cl(o.min,o.asinh):o.min,o._max=3==l?al(o.max):4==l?cl(o.max,o.asinh):o.max,e[n]=t=!0}}if(t){dl.forEach(((l,t)=>{2==M?t>0&&e.y&&(l._paths=null):e[l.scale]&&(l._paths=null)}));for(let l in e)ft=!0,Ti("setScale",l);wt.show&&wt.left>=0&&(ct=pt=!0)}for(let l in Vl)Vl[l]=null}(),rt=!1),ft&&(function(){let l=!1,e=0;for(;!l;){e++;let t=kn(e),n=yn(e);l=e==xt||t&&n,l||(gt(k.width,k.height),ut=!0)}}(),ft=!1),ut){if(T(Z,s,Fe),T(Z,i,He),T(Z,t,Ye),T(Z,n,Ce),T($,s,Fe),T($,i,He),T($,t,Ye),T($,n,Ce),T(X,t,Ae),T(X,n,We),V.width=nl(Ae*y),V.height=nl(We*y),gl.forEach((({_el:e,_show:t,_size:n,_pos:i,side:o})=>{if(null!=e)if(t){let t=o%2==1;T(e,t?"left":"top",i-(3===o||0===o?n:0)),T(e,t?"width":"height",n),T(e,t?"top":"left",t?He:Fe),T(e,t?"height":"width",t?Ce:Ye),E(e,l)}else S(e,l)})),Xt=Zt=$t=ln=en=tn=nn=on=Qt=null,sn=1,hi(!0),Fe!=je||He!=Ue||Ye!=Be||Ce!=Ve){Mn(!1);let l=Ye/Be,e=Ce/Ve;if(wt.show&&!ct&&wt.left>=0){wt.left*=l,wt.top*=e,Tn&&A(Tn,nl(wt.left),0,Ye,Ce),zn&&A(zn,0,nl(wt.top),Ye,Ce);for(let t=1;yt.length>t;t++)Mt[t]*=l,St[t]*=e,A(yt[t],yl(Mt[t],1),yl(St[t],1),Ye,Ce)}if(qn.show&&!ht&&qn.left>=0&&qn.width>0){qn.left*=l,qn.width*=l,qn.top*=e,qn.height*=e;for(let l in mi)T(Kn,l,qn[l])}je=Fe,Ue=He,Be=Ye,Ve=Ce}Ti("setSize"),ut=!1}Ae>0&&We>0&&(J.clearRect(0,0,V.width,V.height),Ti("drawClear"),Rl.forEach((l=>l())),Ti("draw")),qn.show&&ht&&(Xn(qn),ht=!1),wt.show&&ct&&(fi(null,!0,!1),ct=!1),le.show&&le.live&&pt&&(ui(),pt=!1),R||(R=!0,k.status=1,Ti("ready")),un=!1,Rn=!1}function jn(l,e){let t=vl[l];if(null==t.from){if(0==At){let n=t.range(k,e.min,e.max,l);e.min=n[0],e.max=n[1]}if(e.min>e.max){let l=e.min;e.min=e.max,e.max=l}if(At>1&&null!=e.min&&null!=e.max&&1e-16>e.max-e.min)return;l==zl&&2==t.distr&&At>0&&(e.min=L(e.min,g[0]),e.max=L(e.max,g[0]),e.min==e.max&&e.max++),Vl[l]=e,rt=!0,On()}}k.batch=function(l,e=!1){Rn=!0,Gn=e,l(k),Nn(),e&&In.length>0&&queueMicrotask(Ln)},k.redraw=(l,e)=>{ft=e||!1,!1!==l?Zn(zl,Nl.min,Nl.max):On()},k.setScale=jn;let Un=!1;const Bn=wt.drag;let Vn=Bn.x,Jn=Bn.y;wt.show&&(wt.x&&(Sn=D("u-cursor-x",$)),wt.y&&(En=D("u-cursor-y",$)),0==Nl.ori?(Tn=Sn,zn=En):(Tn=En,zn=Sn),Fn=wt.left,Hn=wt.top);const qn=k.select=Il({show:!0,over:!0,left:0,width:0,top:0,height:0},u.select),Kn=qn.show?D("u-select",qn.over?$:Z):null;function Xn(l,e){if(qn.show){for(let e in l)qn[e]=l[e],e in mi&&T(Kn,e,l[e]);!1!==e&&Ti("setSelect")}}function Zn(l,e,t){jn(l,{min:e,max:t})}function $n(e,t,n,i){null!=t.focus&&function(l){if(l!=ei){let e=null==l,t=1!=vt.alpha;dl.forEach(((n,i)=>{if(1==M||i>0){let o=e||0==i||i==l;n._focus=e?null:o,t&&function(l,e){dl[l].alpha=e,wt.show&&yt[l]&&(yt[l].style.opacity=e),ee&&ae[l]&&(ae[l].style.opacity=e)}(i,o?1:vt.alpha)}})),ei=l,t&&On()}}(e),null!=t.show&&dl.forEach(((n,i)=>{0>=i||e!=i&&null!=e||(n.show=t.show,function(e){let t=ee?ae[e]:null;dl[e].show?t&&E(t,l):(t&&S(t,l),yt.length>1&&A(yt[e],-10,-10,Ye,Ce))}(i),2==M?(Zn(n.facets[0].scale,null,null),Zn(n.facets[1].scale,null,null)):Zn(n.scale,null,null),On())})),!1!==n&&Ti("setSeries",e,t),i&&Wi("setSeries",k,e,t)}let Qn,li,ei;k.setSelect=Xn,k.setSeries=$n,k.addBand=function(l,e){l.fill=ml(l.fill||null),l.dir=K(l.dir,-1),Ml.splice(e=null==e?Ml.length:e,0,l)},k.setBand=function(l,e){Il(Ml[l],e)},k.delBand=function(l){null==l?Ml.length=0:Ml.splice(l,1)};const ti={focus:!0};function ni(l,e,t){let n=vl[e];t&&(l=l/y-(1==n.ori?He:Fe));let i=Ye;1==n.ori&&(i=Ce,l=i-l),-1==n.dir&&(l=i-l);let o=n._min,s=o+l/i*(n._max-o),r=n.distr;return 3==r?rl(10,s):4==r?((l,e=1)=>Q.sinh(l)*e)(s,n.asinh):s}function ii(l,e){T(Kn,s,qn.left=l),T(Kn,t,qn.width=e)}function oi(l,e){T(Kn,i,qn.top=l),T(Kn,n,qn.height=e)}ee&&kt&&ze(p,oe,(l=>{wt._lock||(_t(l),null!=ei&&$n(null,ti,!0,Di.setSeries))})),k.valToIdx=l=>L(l,g[0]),k.posToIdx=function(l,e){return L(ni(l,zl,e),g[0],Yt,qt)},k.posToVal=ni,k.valToPos=(l,e,t)=>0==vl[e].ori?W(l,vl[e],t?Qe:Ye,t?Je:0):C(l,vl[e],t?ot:Ce,t?$e:0),k.setCursor=(l,e,t)=>{Fn=l.left,Hn=l.top,fi(null,e,t)};let si=0==Nl.ori?ii:oi,ri=1==Nl.ori?ii:oi;function ui(l,e){null!=l&&(l.idxs?l.idxs.forEach(((l,e)=>{Ql[e]=l})):(l=>void 0===l)(l.idx)||Ql.fill(l.idx),le.idx=Ql[0]);for(let l=0;dl.length>l;l++)(l>0||1==M&&!ce)&&ai(l,Ql[l]);ee&&le.live&&function(){if(ee&&le.live)for(let l=2==M?1:0;dl.length>l;l++){if(0==l&&ce)continue;let e=le.values[l],t=0;for(let n in e)fe[l][t++].firstChild.nodeValue=e[n]}}(),pt=!1,!1!==e&&Ti("setLegend")}function ai(l,e){let t,n=dl[l],i=0==l&&2==jl?rn:g[l];ce?t=n.values(k,l,e)??he:(t=n.value(k,null==e?null:i[e],l,e),t=null==t?he:{_:t}),le.values[l]=t}function fi(l,e,t){let n;Yn=Fn,Cn=Hn,[Fn,Hn]=wt.move(k,Fn,Hn),wt.left=Fn,wt.top=Hn,wt.show&&(Tn&&A(Tn,nl(Fn),0,Ye,Ce),zn&&A(zn,0,nl(Hn),Ye,Ce)),Qn=hl;let i=0==Nl.ori?Ye:Ce,o=1==Nl.ori?Ye:Ce;if(0>Fn||0==At||Yt>qt){n=wt.idx=null;for(let l=0;dl.length>l;l++)l>0&&yt.length>1&&A(yt[l],-10,-10,Ye,Ce);kt&&$n(null,ti,!0,null==l&&Di.setSeries),le.live&&(Ql.fill(n),pt=!0)}else{let l,e,t;1==M&&(l=0==Nl.ori?Fn:Hn,e=ni(l,zl),n=wt.idx=L(e,g[0],Yt,qt),t=Ul(g[0][n],Nl,i,0));for(let l=2==M?1:0;dl.length>l;l++){let s=dl[l],r=Ql[l],u=null==r?null:1==M?g[l][r]:g[l][1][r],a=wt.dataIdx(k,l,n,e),f=null==a?null:1==M?g[l][a]:g[l][1][a];pt=pt||f!=u||a!=r,Ql[l]=a;let c=a==n?t:Ul(1==M?g[0][a]:g[l][0][a],Nl,i,0);if(l>0&&s.show){let e,t,n=null==f?-10:Bl(f,1==M?vl[s.scale]:vl[s.facets[1].scale],o,0);if(kt&&null!=f){let e=1==Nl.ori?Fn:Hn,t=el(vt.dist(k,l,a,n,e));if(Qn>t){let n=vt.bias;if(0!=n){let i=ni(e,s.scale),o=0>i?-1:1;o!=(0>f?-1:1)||(1==o?1==n?i>f:f>i:1==n?f>i:i>f)||(Qn=t,li=l)}else Qn=t,li=l}}if(0==Nl.ori?(e=c,t=n):(e=n,t=c),pt&&yt.length>1){Y(yt[l],wt.points.fill(k,l),wt.points.stroke(k,l));let n,i,o,s,r=!0,u=wt.points.bbox;if(null!=u){r=!1;let e=u(k,l);o=e.left,s=e.top,n=e.width,i=e.height}else o=e,s=t,n=i=wt.points.size(k,l);F(yt[l],n,i,r),Mt[l]=o,St[l]=s,A(yt[l],yl(o,1),yl(s,1),Ye,Ce)}}}}if(qn.show&&Un)if(null!=l){let[e,t]=Di.scales,[n,s]=Di.match,[r,u]=l.cursor.sync.scales,a=l.cursor.drag;if(Vn=a._x,Jn=a._y,Vn||Jn){let a,f,c,h,d,{left:p,top:m,width:g,height:x}=l.select,w=l.scales[e].ori,_=l.posToVal,b=null!=e&&n(e,r),v=null!=t&&s(t,u);b&&Vn?(0==w?(a=p,f=g):(a=m,f=x),c=vl[e],h=Ul(_(a,r),c,i,0),d=Ul(_(a+f,r),c,i,0),si(ol(h,d),el(d-h))):si(0,i),v&&Jn?(1==w?(a=p,f=g):(a=m,f=x),c=vl[t],h=Bl(_(a,u),c,o,0),d=Bl(_(a+f,u),c,o,0),ri(ol(h,d),el(d-h))):ri(0,o)}else gi()}else{let l=el(Yn-Dn),e=el(Cn-Pn);if(1==Nl.ori){let t=l;l=e,e=t}Vn=Bn.x&&l>=Bn.dist,Jn=Bn.y&&e>=Bn.dist;let t,n,s=Bn.uni;null!=s?Vn&&Jn&&(Vn=l>=s,Jn=e>=s,Vn||Jn||(e>l?Jn=!0:Vn=!0)):Bn.x&&Bn.y&&(Vn||Jn)&&(Vn=Jn=!0),Vn&&(0==Nl.ori?(t=An,n=Fn):(t=Wn,n=Hn),si(ol(t,n),el(n-t)),Jn||ri(0,o)),Jn&&(1==Nl.ori?(t=An,n=Fn):(t=Wn,n=Hn),ri(ol(t,n),el(n-t)),Vn||si(0,i)),Vn||Jn||(si(0,0),ri(0,0))}if(Bn._x=Vn,Bn._y=Jn,null==l){if(t){if(null!=Pi){let[l,e]=Di.scales;Di.values[0]=null!=l?ni(0==Nl.ori?Fn:Hn,l):null,Di.values[1]=null!=e?ni(1==Nl.ori?Fn:Hn,e):null}Wi(f,k,Fn,Hn,Ye,Ce,n)}if(kt){let l=t&&Di.setSeries,e=vt.prox;null==ei?Qn>e||$n(li,ti,!0,l):Qn>e?$n(null,ti,!0,l):li!=ei&&$n(li,ti,!0,l)}}pt&&(le.idx=n,ui()),!1!==e&&Ti("setCursor")}k.setLegend=ui;let ci=null;function hi(l=!1){l?ci=null:(ci=$.getBoundingClientRect(),Ti("syncRect",ci))}function di(l,e,t,n,i,o){wt._lock||Un&&null!=l&&0==l.movementX&&0==l.movementY||(pi(l,e,t,n,i,o,0,!1,null!=l),null!=l?fi(null,!0,!0):fi(e,!0,!1))}function pi(l,e,t,n,i,o,s,r,u){if(null==ci&&hi(!1),_t(l),null!=l)t=l.clientX-ci.left,n=l.clientY-ci.top;else{if(0>t||0>n)return Fn=-10,void(Hn=-10);let[l,s]=Di.scales,r=e.cursor.sync,[u,a]=r.values,[f,c]=r.scales,[h,d]=Di.match,p=e.axes[0].side%2==1,m=0==Nl.ori?Ye:Ce,g=1==Nl.ori?Ye:Ce,x=p?o:i,w=p?i:o,_=p?n:t,b=p?t:n;if(t=null!=f?h(l,f)?H(u,vl[l],m,0):-10:m*(_/x),n=null!=c?d(s,c)?H(a,vl[s],g,0):-10:g*(b/w),1==Nl.ori){let l=t;t=n,n=l}}u&&(t>1&&Ye-1>t||(t=kl(t,Ye)),n>1&&Ce-1>n||(n=kl(n,Ce))),r?(Dn=t,Pn=n,[An,Wn]=wt.move(k,t,n)):(Fn=t,Hn=n)}Object.defineProperty(k,"rect",{get:()=>(null==ci&&hi(!1),ci)});const mi={width:0,height:0,left:0,top:0};function gi(){Xn(mi,!1)}let xi,wi,_i,bi;function vi(l,e,t,n,i,o){Un=!0,Vn=Jn=Bn._x=Bn._y=!1,pi(l,e,t,n,i,o,0,!0,!1),null!=l&&(ze(h,b,ki,!1),Wi(c,k,An,Wn,Ye,Ce,null));let{left:s,top:r,width:u,height:a}=qn;xi=s,wi=r,_i=u,bi=a,gi()}function ki(l,e,t,n,i,o){Un=Bn._x=Bn._y=!1,pi(l,e,t,n,i,o,0,!1,!0);let{left:s,top:r,width:u,height:a}=qn,f=u>0||a>0,c=xi!=s||wi!=r||_i!=u||bi!=a;if(f&&c&&Xn(qn),Bn.setScale&&f&&c){let l=s,e=u,t=r,n=a;if(1==Nl.ori&&(l=r,e=a,t=s,n=u),Vn&&Zn(zl,ni(l,zl),ni(l+e,zl)),Jn)for(let l in vl){let e=vl[l];l!=zl&&null==e.from&&e.min!=hl&&Zn(l,ni(t+n,l),ni(t,l))}gi()}else wt.lock&&(wt._lock=!wt._lock,wt._lock||fi(null,!0,!1));null!=l&&(De(h,b),Wi(h,k,Fn,Hn,Ye,Ce,null))}function yi(l){wt._lock||(_t(l),fn(),gi(),null!=l&&Wi(m,k,Fn,Hn,Ye,Ce,null))}function Mi(){gl.forEach(Jt),mt(k.width,k.height,!0)}G(x,v,Mi);const Si={};Si.mousedown=vi,Si.mousemove=di,Si.mouseup=ki,Si.dblclick=yi,Si.setSeries=(l,e,t,n)=>{-1!=(t=(0,Di.match[2])(k,e,t))&&$n(t,n,!0,!1)},wt.show&&(ze(c,$,vi),ze(f,$,di),ze(d,$,(l=>{_t(l),hi(!1)})),ze(p,$,(function(l){if(wt._lock)return;_t(l);let e=Un;if(Un){let l,e,t=!0,n=!0,i=10;0==Nl.ori?(l=Vn,e=Jn):(l=Jn,e=Vn),l&&e&&(t=i>=Fn||Fn>=Ye-i,n=i>=Hn||Hn>=Ce-i),l&&t&&(Fn=An>Fn?0:Ye),e&&n&&(Hn=Wn>Hn?0:Ce),fi(null,!0,!0),Un=!1}Fn=-10,Hn=-10,fi(null,!0,!0),e&&(Un=e)})),ze(m,$,yi),Wt.add(k),k.syncRect=hi);const Ei=k.hooks=u.hooks||{};function Ti(l,e,t){Gn?In.push([l,e,t]):l in Ei&&Ei[l].forEach((l=>{l.call(null,k,e,t)}))}(u.plugins||[]).forEach((l=>{for(let e in l.hooks)Ei[e]=(Ei[e]||[]).concat(l.hooks[e])}));const zi=(l,e,t)=>t,Di=Il({key:null,setSeries:!1,filters:{pub:_l,sub:_l},scales:[zl,dl[1]?dl[1].scale:null],match:[bl,bl,zi],values:[null,null]},wt.sync);2==Di.match.length&&Di.match.push(zi),wt.sync=Di;const Pi=Di.key,Ai=st(Pi);function Wi(l,e,t,n,i,o,s){Di.filters.pub(l,e,t,n,i,o,s)&&Ai.pub(l,e,t,n,i,o,s)}function Yi(){Ti("init",u,g),an(g||u.data,!1),Vl[zl]?jn(zl,Vl[zl]):fn(),ht=qn.show&&(qn.width>0||qn.height>0),ct=pt=!0,mt(u.width,u.height)}return Ai.sub(k),k.pub=function(l,e,t,n,i,o,s){Di.filters.sub(l,e,t,n,i,o,s)&&Si[l](null,e,t,n,i,o,s)},k.destroy=function(){Ai.unsub(k),Wt.delete(k),Te.clear(),I(x,v,Mi),O.remove(),oe?.remove(),Ti("destroy")},dl.forEach(Et),gl.forEach((function(l,e){if(l._show=l.show,l.show){let t=vl[l.scale];null==t&&(l.scale=l.side%2?dl[1].scale:zl,t=vl[l.scale]);let n=t.time;l.size=ml(l.size),l.space=ml(l.space),l.rotate=ml(l.rotate),Wl(l.incrs)&&l.incrs.forEach((l=>{!El.has(l)&&El.set(l,Tl(l))})),l.incrs=ml(l.incrs||(2==t.distr?te:n?1==fl?me:we:ne)),l.splits=ml(l.splits||(n&&1==t.distr?Kl:3==t.distr?Oe:4==t.distr?Ne:Le)),l.stroke=ml(l.stroke),l.grid.stroke=ml(l.grid.stroke),l.ticks.stroke=ml(l.ticks.stroke),l.border.stroke=ml(l.border.stroke);let i=l.values;l.values=Wl(i)&&!Wl(i[0])?ml(i):n?Wl(i)?ke(Jl,ve(i,ql)):Cl(i)?function(l,e){let t=Xl(e);return(e,n)=>n.map((e=>t(l(e))))}(Jl,i):i||Zl:i||Ie,l.filter=ml(l.filter||(3>t.distr||10!=t.log?3==t.distr&&2==t.log?Ke:xl:qe)),l.font=Vt(l.font),l.labelFont=Vt(l.labelFont),l._size=l.size(k,null,e,0),l._space=l._rotate=l._incrs=l._found=l._splits=l._values=null,l._size>0&&(Tt[e]=!0,l._el=D("u-axis",X))}})),_?_ instanceof HTMLElement?(_.appendChild(O),Yi()):_(k,Yi):Yi(),k}qt.assign=Il,qt.fmtNum=$,qt.rangeNum=q,qt.rangeLog=N,qt.rangeAsinh=j,qt.orient=rt,qt.pxRatio=y,qt.join=function(l,e){if(function(l){let e=l[0][0],t=e.length;for(let n=1;l.length>n;n++){let i=l[n][0];if(i.length!=t)return!1;if(i!=e)for(let l=0;t>l;l++)if(i[l]!=e[l])return!1}return!0}(l)){let e=l[0].slice();for(let t=1;l.length>t;t++)e.push(...l[t].slice(1));return function(l,e=100){const t=l.length;if(1>=t)return!0;let n=0,i=t-1;for(;i>=n&&null==l[n];)n++;for(;i>=n&&null==l[i];)i--;if(n>=i)return!0;const o=sl(1,tl((i-n+1)/e));for(let e=l[n],t=n+o;i>=t;t+=o){const n=l[t];if(null!=n){if(e>=n)return!1;e=n}}return!0}(e[0])||(e=function(l){let e=l[0],t=e.length,n=Array(t);for(let l=0;n.length>l;l++)n[l]=l;n.sort(((l,t)=>e[l]-e[t]));let i=[];for(let e=0;l.length>e;e++){let o=l[e],s=Array(t);for(let l=0;t>l;l++)s[l]=o[n[l]];i.push(s)}return i}(e)),e}let t=new Set;for(let e=0;l.length>e;e++){let n=l[e][0],i=n.length;for(let l=0;i>l;l++)t.add(n[l])}let n=[Array.from(t).sort(((l,e)=>l-e))],i=n[0].length,o=new Map;for(let l=0;i>l;l++)o.set(n[0][l],l);for(let t=0;l.length>t;t++){let s=l[t],r=s[0];for(let l=1;s.length>l;l++){let u=s[l],a=Array(i).fill(void 0),f=e?e[t][l]:1,c=[];for(let l=0;u.length>l;l++){let e=u[l],t=o.get(r[l]);null===e?0!=f&&(a[t]=e,2==f&&c.push(t)):a[t]=e}Ll(a,c,i),n.push(a)}}return n},qt.fmtDate=Xl,qt.tzDate=function(l,e){let t;return"UTC"==e||"Etc/UTC"==e?t=new Date(+l+6e4*l.getTimezoneOffset()):e==Zl?t=l:(t=new Date(l.toLocaleString("en-US",{timeZone:e})),t.setMilliseconds(l.getMilliseconds())),t},qt.sync=st;{qt.addGap=function(l,e,t){let n=l[l.length-1];n&&n[0]==e?n[1]=t:l.push([e,t])},qt.clipGaps=ct;let l=qt.paths={points:St};l.linear=Dt,l.stepped=function(l){const e=K(l.align,1),t=K(l.ascDesc,!1),n=K(l.alignGaps,0),i=K(l.extend,!1);return(l,o,s,r)=>rt(l,o,((u,a,f,c,h,d,p,m,g,x,w)=>{let _=u.pxRound,{left:b,width:v}=l.bbox,k=l=>_(d(l,c,x,m)),M=l=>_(p(l,h,w,g)),S=0==c.ori?xt:wt;const E={stroke:new Path2D,fill:null,clip:null,band:null,gaps:null,flags:1},T=E.stroke,z=c.dir*(0==c.ori?1:-1);s=O(f,s,r,1),r=O(f,s,r,-1);let D=M(f[1==z?s:r]),P=k(a[1==z?s:r]),A=P,W=P;i&&-1==e&&(W=b,S(T,W,D)),S(T,P,D);for(let l=1==z?s:r;l>=s&&r>=l;l+=z){let t=f[l];if(null==t)continue;let n=k(a[l]),i=M(t);1==e?S(T,n,D):S(T,A,i),S(T,n,i),D=i,A=n}let Y=A;i&&1==e&&(Y=b+v,S(T,Y,D));let[C,F]=ut(l,o);if(null!=u.fill||0!=C){let e=E.fill=new Path2D(T),t=M(u.fillTo(l,o,u.min,u.max,C));S(e,Y,t),S(e,W,t)}if(!u.spanGaps){let i=[];i.push(...ht(a,f,s,r,z,k,n));let h=u.width*y/2,d=t||1==e?h:-h,p=t||-1==e?-h:h;i.forEach((l=>{l[0]+=d,l[1]+=p})),E.gaps=i=u.gaps(l,o,s,r,i),E.clip=ct(i,c.ori,m,g,x,w)}return 0!=F&&(E.band=2==F?[ft(l,o,s,r,T,-1),ft(l,o,s,r,T,1)]:ft(l,o,s,r,T,F)),E}))},l.bars=function(l){const e=K((l=l||Dl).size,[.6,hl,1]),t=l.align||0,n=l.gap||0;let i=l.radius;i=null==i?[0,0]:"number"==typeof i?[i,0]:i;const o=ml(i),s=1-e[0],r=K(e[1],hl),u=K(e[2],1),a=K(l.disp,Dl),f=K(l.each,(()=>{})),{fill:c,stroke:h}=a;return(l,e,i,d)=>rt(l,e,((p,m,g,x,w,_,b,v,k,M,S)=>{let E,T,z=p.pxRound,D=t,P=n*y,A=r*y,W=u*y;0==x.ori?[E,T]=o(l,e):[T,E]=o(l,e);const Y=x.dir*(0==x.ori?1:-1);let C,F,H,R=0==x.ori?_t:bt,G=0==x.ori?f:(l,e,t,n,i,o,s)=>{f(l,e,t,i,n,s,o)},I=K(l.bands,Pl).find((l=>l.series[0]==e)),L=p.fillTo(l,e,p.min,p.max,null!=I?I.dir:0),O=z(b(L,w,S,k)),N=M,j=z(p.width*y),U=!1,B=null,V=null,J=null,q=null;null==c||0!=j&&null==h||(U=!0,B=c.values(l,e,i,d),V=new Map,new Set(B).forEach((l=>{null!=l&&V.set(l,new Path2D)})),j>0&&(J=h.values(l,e,i,d),q=new Map,new Set(J).forEach((l=>{null!=l&&q.set(l,new Path2D)}))));let{x0:X,size:Z}=a;if(null!=X&&null!=Z){D=1,m=X.values(l,e,i,d),2==X.unit&&(m=m.map((e=>l.posToVal(v+e*M,x.key,!0))));let t=Z.values(l,e,i,d);F=2==Z.unit?t[0]*M:_(t[0],x,M,v)-_(0,x,M,v),N=Pt(m,g,_,x,M,v,N),H=N-F+P}else N=Pt(m,g,_,x,M,v,N),H=N*s+P,F=N-H;1>H&&(H=0),F/2>j||(j=0),5>H&&(z=gl);let $=H>0;F=z(pl(N-H-($?j:0),W,A)),C=(0==D?F/2:D==Y?0:F)-D*Y*((0==D?P/2:0)+($?j/2:0));const Q={stroke:null,fill:null,clip:null,band:null,gaps:null,flags:0},ll=U?null:new Path2D;let el=null;if(null!=I)el=l.data[I.series[1]];else{let{y0:t,y1:n}=a;null!=t&&null!=n&&(g=n.values(l,e,i,d),el=t.values(l,e,i,d))}let nl=E*F,il=T*F;for(let t=1==Y?i:d;t>=i&&d>=t;t+=Y){let n=g[t];if(null==n)continue;if(null!=el){let l=el[t]??0;if(n-l==0)continue;O=b(l,w,S,k)}let i=_(2!=x.distr||null!=a?m[t]:t,x,M,v),o=b(K(n,L),w,S,k),s=z(i-C),r=z(sl(o,O)),u=z(ol(o,O)),f=r-u;if(null!=n){let i=0>n?il:nl,o=0>n?nl:il;U?(j>0&&null!=J[t]&&R(q.get(J[t]),s,u+tl(j/2),F,sl(0,f-j),i,o),null!=B[t]&&R(V.get(B[t]),s,u+tl(j/2),F,sl(0,f-j),i,o)):R(ll,s,u+tl(j/2),F,sl(0,f-j),i,o),G(l,e,t,s-j/2,u,F+j,f)}}return j>0?Q.stroke=U?q:ll:U||(Q._fill=0==p.width?p._fill:p._stroke??p._fill,Q.width=0),Q.fill=U?V:ll,Q}))},l.spline=function(l){return function(l,e){const t=K(e?.alignGaps,0);return(e,n,i,o)=>rt(e,n,((s,r,u,a,f,c,h,d,p,m,g)=>{let x,w,_,b=s.pxRound,v=l=>b(c(l,a,m,d)),k=l=>b(h(l,f,g,p));0==a.ori?(x=mt,_=xt,w=yt):(x=gt,_=wt,w=Mt);const y=a.dir*(0==a.ori?1:-1);i=O(u,i,o,1),o=O(u,i,o,-1);let M=v(r[1==y?i:o]),S=M,E=[],T=[];for(let l=1==y?i:o;l>=i&&o>=l;l+=y)if(null!=u[l]){let e=v(r[l]);E.push(S=e),T.push(k(u[l]))}const z={stroke:l(E,T,x,_,w,b),fill:null,clip:null,band:null,gaps:null,flags:1},D=z.stroke;let[P,A]=ut(e,n);if(null!=s.fill||0!=P){let l=z.fill=new Path2D(D),t=k(s.fillTo(e,n,s.min,s.max,P));_(l,S,t),_(l,M,t)}if(!s.spanGaps){let l=[];l.push(...ht(r,u,i,o,y,v,t)),z.gaps=l=s.gaps(e,n,i,o,l),z.clip=ct(l,a.ori,d,p,m,g)}return 0!=A&&(z.band=2==A?[ft(e,n,i,o,D,-1),ft(e,n,i,o,D,1)]:ft(e,n,i,o,D,A)),z}))}(At,l)}}return qt}();

// End uPlot.iife-Min


// Start HTMX ws-Min
(function(){if(htmx.version&&!htmx.version.startsWith("1.")){console.warn("WARNING: You are using an htmx 1 extension with htmx "+htmx.version+".  It is recommended that you move to the version of this extension found on https://htmx.org/extensions")}
var api;htmx.defineExtension("ws",{init:function(apiRef){api=apiRef;if(!htmx.createWebSocket){htmx.createWebSocket=createWebSocket}
if(!htmx.config.wsReconnectDelay){htmx.config.wsReconnectDelay="full-jitter"}},onEvent:function(name,evt){var parent=evt.target||evt.detail.elt;switch(name){case "htmx:beforeCleanupElement":var internalData=api.getInternalData(parent)
if(internalData.webSocket){internalData.webSocket.close()}
return;case "htmx:beforeProcessNode":forEach(queryAttributeOnThisOrChildren(parent,"ws-connect"),function(child){ensureWebSocket(child)});forEach(queryAttributeOnThisOrChildren(parent,"ws-send"),function(child){ensureWebSocketSend(child)})}}});function splitOnWhitespace(trigger){return trigger.trim().split(/\s+/)}
function getLegacyWebsocketURL(elt){var legacySSEValue=api.getAttributeValue(elt,"hx-ws");if(legacySSEValue){var values=splitOnWhitespace(legacySSEValue);for(var i=0;i<values.length;i++){var value=values[i].split(/:(.+)/);if(value[0]==="connect"){return value[1]}}}}
function ensureWebSocket(socketElt){if(!api.bodyContains(socketElt)){return}
var wssSource=api.getAttributeValue(socketElt,"ws-connect")
if(wssSource==null||wssSource===""){var legacySource=getLegacyWebsocketURL(socketElt);if(legacySource==null){return}else{wssSource=legacySource}}
if(wssSource.indexOf("/")===0){var base_part=location.hostname+(location.port?':'+location.port:'');if(location.protocol==='https:'){wssSource="wss://"+base_part+wssSource}else if(location.protocol==='http:'){wssSource="ws://"+base_part+wssSource}}
var socketWrapper=createWebsocketWrapper(socketElt,function(){return htmx.createWebSocket(wssSource)});socketWrapper.addEventListener('message',function(event){if(maybeCloseWebSocketSource(socketElt)){return}
var response=event.data;if(!api.triggerEvent(socketElt,"htmx:wsBeforeMessage",{message:response,socketWrapper:socketWrapper.publicInterface})){return}
api.withExtensions(socketElt,function(extension){response=extension.transformResponse(response,null,socketElt)});var settleInfo=api.makeSettleInfo(socketElt);var fragment=api.makeFragment(response);if(fragment.children.length){var children=Array.from(fragment.children);for(var i=0;i<children.length;i++){api.oobSwap(api.getAttributeValue(children[i],"hx-swap-oob")||"true",children[i],settleInfo)}}
api.settleImmediately(settleInfo.tasks);api.triggerEvent(socketElt,"htmx:wsAfterMessage",{message:response,socketWrapper:socketWrapper.publicInterface})});api.getInternalData(socketElt).webSocket=socketWrapper}
function createWebsocketWrapper(socketElt,socketFunc){var wrapper={socket:null,messageQueue:[],retryCount:0,events:{},addEventListener:function(event,handler){if(this.socket){this.socket.addEventListener(event,handler)}
if(!this.events[event]){this.events[event]=[]}
this.events[event].push(handler)},sendImmediately:function(message,sendElt){if(!this.socket){api.triggerErrorEvent()}
if(!sendElt||api.triggerEvent(sendElt,'htmx:wsBeforeSend',{message:message,socketWrapper:this.publicInterface})){this.socket.send(message);sendElt&&api.triggerEvent(sendElt,'htmx:wsAfterSend',{message:message,socketWrapper:this.publicInterface})}},send:function(message,sendElt){if(this.socket.readyState!==this.socket.OPEN){this.messageQueue.push({message:message,sendElt:sendElt})}else{this.sendImmediately(message,sendElt)}},handleQueuedMessages:function(){while(this.messageQueue.length>0){var queuedItem=this.messageQueue[0]
if(this.socket.readyState===this.socket.OPEN){this.sendImmediately(queuedItem.message,queuedItem.sendElt);this.messageQueue.shift()}else{break}}},init:function(){if(this.socket&&this.socket.readyState===this.socket.OPEN){this.socket.close()}
var socket=socketFunc();api.triggerEvent(socketElt,"htmx:wsConnecting",{event:{type:'connecting'}});this.socket=socket;socket.onopen=function(e){wrapper.retryCount=0;api.triggerEvent(socketElt,"htmx:wsOpen",{event:e,socketWrapper:wrapper.publicInterface});wrapper.handleQueuedMessages()}
socket.onclose=function(e){if(!maybeCloseWebSocketSource(socketElt)&&[1006,1012,1013].indexOf(e.code)>=0){var delay=getWebSocketReconnectDelay(wrapper.retryCount);setTimeout(function(){wrapper.retryCount+=1;wrapper.init()},delay)}
api.triggerEvent(socketElt,"htmx:wsClose",{event:e,socketWrapper:wrapper.publicInterface})};socket.onerror=function(e){api.triggerErrorEvent(socketElt,"htmx:wsError",{error:e,socketWrapper:wrapper});maybeCloseWebSocketSource(socketElt)};var events=this.events;Object.keys(events).forEach(function(k){events[k].forEach(function(e){socket.addEventListener(k,e)})})},close:function(){this.socket.close()}}
wrapper.init();wrapper.publicInterface={send:wrapper.send.bind(wrapper),sendImmediately:wrapper.sendImmediately.bind(wrapper),queue:wrapper.messageQueue};return wrapper}
function ensureWebSocketSend(elt){var legacyAttribute=api.getAttributeValue(elt,"hx-ws");if(legacyAttribute&&legacyAttribute!=='send'){return}
var webSocketParent=api.getClosestMatch(elt,hasWebSocket)
processWebSocketSend(webSocketParent,elt)}
function hasWebSocket(node){return api.getInternalData(node).webSocket!=null}
function processWebSocketSend(socketElt,sendElt){var nodeData=api.getInternalData(sendElt);var triggerSpecs=api.getTriggerSpecs(sendElt);triggerSpecs.forEach(function(ts){api.addTriggerHandler(sendElt,ts,nodeData,function(elt,evt){if(maybeCloseWebSocketSource(socketElt)){return}
var socketWrapper=api.getInternalData(socketElt).webSocket;var headers=api.getHeaders(sendElt,api.getTarget(sendElt));var results=api.getInputValues(sendElt,'post');var errors=results.errors;var rawParameters=results.values;var expressionVars=api.getExpressionVars(sendElt);var allParameters=api.mergeObjects(rawParameters,expressionVars);var filteredParameters=api.filterValues(allParameters,sendElt);var sendConfig={parameters:filteredParameters,unfilteredParameters:allParameters,headers:headers,errors:errors,triggeringEvent:evt,messageBody:undefined,socketWrapper:socketWrapper.publicInterface};if(!api.triggerEvent(elt,'htmx:wsConfigSend',sendConfig)){return}
if(errors&&errors.length>0){api.triggerEvent(elt,'htmx:validation:halted',errors);return}
var body=sendConfig.messageBody;if(body===undefined){var toSend=Object.assign({},sendConfig.parameters);if(sendConfig.headers)
toSend.HEADERS=headers;body=JSON.stringify(toSend)}
socketWrapper.send(body,elt);if(evt&&api.shouldCancel(evt,elt)){evt.preventDefault()}})})}
function getWebSocketReconnectDelay(retryCount){var delay=htmx.config.wsReconnectDelay;if(typeof delay==='function'){return delay(retryCount)}
if(delay==='full-jitter'){var exp=Math.min(retryCount,6);var maxDelay=1000*Math.pow(2,exp);return maxDelay*Math.random()}
logError('htmx.config.wsReconnectDelay must either be a function or the string "full-jitter"')}
function maybeCloseWebSocketSource(elt){if(!api.bodyContains(elt)){api.getInternalData(elt).webSocket.close();return!0}
return!1}
function createWebSocket(url){var sock=new WebSocket(url,[]);sock.binaryType=htmx.config.wsBinaryType;return sock}
function queryAttributeOnThisOrChildren(elt,attributeName){var result=[]
if(api.hasAttribute(elt,attributeName)||api.hasAttribute(elt,"hx-ws")){result.push(elt)}
elt.querySelectorAll("["+attributeName+"], [data-"+attributeName+"], [data-hx-ws], [hx-ws]").forEach(function(node){result.push(node)})
return result}
function forEach(arr,func){if(arr){for(var i=0;i<arr.length;i++){func(arr[i])}}}})()
// End HTMX ws-Min






 