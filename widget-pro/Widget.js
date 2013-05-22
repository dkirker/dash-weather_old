/*
 *	Copyright 2012 Choorp Studios (Garrett Downs)
 *	
 *	Licensed under the Apache License, Version 2.0 (the "License");
 *	you may not use this file except in compliance with the License.
 *	You may obtain a copy of the License at
 *	
 *	   http://www.apache.org/licenses/LICENSE-2.0
 *	
 *	Unless required by applicable law or agreed to in writing, software
 *	distributed under the License is distributed on an "AS IS" BASIS,
 *	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *	See the License for the specific language governing permissions and
 *	limitations under the License.
 */

enyo.kind({
	name: "DashWeatherProWidget",
	kind: "VFlexBox",
	className: "dashboard",
	components: [
		{kind: "HFlexBox", flex: 1, align: "center", pack:"middle", onclick: "initData", components: [
			{kind: "VFlexBox", flex: 1, components: [
				{kind: "HFlexBox", style: "margin-bottom: 3px;", components: [
					{name: "statusIcon", kind: "Image", src: "../images/icon-packs/default/3200.png", style: "height: 52px; width: 52px;"},
					{name: "wTemperature", className: "dashTemp", allowHtml: true, content: "00&deg;"},
					{kind: "VFlexBox", className: "dashContainer", align: "center", pack: "middle", style: "padding-top: 4px;", components: [
						{name: "wHigh", className: "dashContent highlow", allowHtml: true, content: "00&deg;"},
						{name: "wLow", className: "dashContent highlow", allowHtml: true, content: "00&deg;"}
					]}
				]},
				{name: "wCity", className: "dashContent"},
				{name: "wConditions", className: "dashContent"}
			]},
			{kind: "VFlexBox", flex: 1, pack: "middle", align: "right", className: "dashContainer", onclick: "initData", components: [
				{kind: "HFlexBox", pack: "end", className: "text-row", components: [
					{name: "wSunrise", className: "dashContent iconText", content: "12:00 am"},
					{kind: "Image", src: "images/icon-sun.png", style: "height: 18px; width: 18px;"}
				]},
				{kind: "HFlexBox", pack: "end", className: "text-row", components: [
					{name: "wSunset", className: "dashContent iconText", content: "12:00 pm"},
					{kind: "Image", src: "images/icon-moon.png", style: "height: 18px; width: 18px;"}
				]},
				{kind: "HFlexBox", pack: "end", className: "text-row", components: [
					{name: "wWind", className: "dashContent iconText", content: "Var at 0 mph"},
					{kind: "Image", src: "images/icon-wind.png", style: "height: 18px; width: 18px;"}
				]},
				{kind: "HFlexBox", pack: "end", className: "text-row", components: [
					{name: "wHumidity", className: "dashContent iconText", content: "0%"},
					{kind: "Image", src: "images/icon-steam.png", style: "height: 18px; width: 18px;"}
				]}
			]}
		]},
		{kind: "ApplicationEvents", onWindowActivated: "dashOpened", onWindowDeactivated: "dashClosed", onWindowParamsChange: "handleWindowParams", onUnload: "dashExited"},
		{name: "srvGps", kind: "PalmService", service: "palm://com.palm.location/", method: "getCurrentPosition", onResponse: "gotGPS"},
		{name: "srvWoeid", kind: "WebService", url: "", onResponse: "gotWOEID"},
		{name: "srvWeather", kind: "WebService", url: "", onResponse: "gotWeather"}
	],
	configWoeid: 2502265,
	configCountry: "US",
	configUnits: "auto",
	configUseGps: true,
	apiAppId: "GoF4p0_V34EwfF20CrgaLr1jaorOozfo0LhXQaDYLNMf2MPmCCalBPqcR8nM",
	create: function () {
		this.inherited(arguments);
	},
	handleWindowParams: function() {
		this.configWoeid = enyo.windowParams.wWoeid;
		this.configCountry = enyo.windowParams.wCountry;
		this.configUnits = enyo.windowParams.wUnits;
		this.configUseGps = enyo.windowParams.wUseGps;
	},
	initData: function() {
		enyo.log("initData: " + "Use GPS? " + this.configUseGps);
		if (this.configUseGps) {
			this.getLocation();
		}
		else {
			this.getWeather();
		}

	},
	getLocation: function() {
		enyo.log("getLocation: " + "Use GPS? " + this.configUseGps);
		this.$.wConditions.setContent("Checking GPS...");
		this.$.srvGps.call();
	},
	gotGPS: function(inSender, inResponse) {
		enyo.log("gotGPS: " + enyo.json.stringify(inResponse));
		if (inResponse.errorCode != 0) {
			this.$.wConditions.setContent("GPS error " + inResponse.errorCode);
			return;
		}

		var urlLocation = "http://where.yahooapis.com/geocode?location=" + inResponse.latitude + "+" + inResponse.longitude + "&gflags=R&appid=XXIlad62";
		this.$.srvWoeid.setUrl(urlLocation);
		this.$.wConditions.setContent("Getting location...");
		this.$.srvWoeid.call();
	},
	gotWOEID: function(inSender, inResponse) {
		var data = (new DOMParser()).parseFromString(inResponse, "text/xml");
		var locCity = data.getElementsByTagName("city")[0].childNodes[0].nodeValue;
		var locWOEID = data.getElementsByTagName("woeid")[0].childNodes[0].nodeValue;
		var locCountry = data.getElementsByTagName("countrycode")[0].childNodes[0].nodeValue;
		enyo.log("gotWOEID: " + locCountry + " " + locCity + " " + locWOEID);

		var units;
		if (this.configUnits == "auto") {
			if (locCountry == "US")
				units = "f";
		}
		else if (this.configUnits == "f") {
			units = "f";
		}
		else {
			units = "c";
		}

		this.$.srvWeather.setUrl("http://weather.yahooapis.com/forecastrss?w="+locWOEID+"&u="+units);
		this.$.wConditions.setContent("Getting weather...");
		this.$.srvWeather.call();
	},
	getWeather: function() {
		enyo.log("getWeather: " + "getWeather Called");
		var units;
		if (this.configUnits == "auto") {
			if (this.configCountry == "US")
				units = "f";
			else
				units = "c";
		}
		else {
			if (this.configUnits == "f")
				units = "f";
			else
				units = "c";
		}

		this.$.srvWeather.setUrl("http://weather.yahooapis.com/forecastrss?w="+this.configWoeid+"&u="+units);
		this.$.wConditions.setContent("Getting weather...");
		this.$.srvWeather.call();
	},
	gotWeather: function(inSender, inResponse) {
		var data = (new DOMParser()).parseFromString(inResponse, "text/xml");
		var objectTemp = data.getElementsByTagName("condition")[0].getAttribute("temp");
		var objectStatusCode = data.getElementsByTagName("condition")[0].getAttribute("code");
		var objectStatusText = data.getElementsByTagName("condition")[0].getAttribute("text");
		var objectTempUnits = data.getElementsByTagName("units")[0].getAttribute("temperature");
		var objectSpeedUnits = data.getElementsByTagName("units")[0].getAttribute("speed");
		var objectLow = data.getElementsByTagName("forecast")[0].getAttribute("low");
		var objectHigh = data.getElementsByTagName("forecast")[0].getAttribute("high");
		var objectCity = data.getElementsByTagName("location")[0].getAttribute("city");
		//var objectWindChill = data.getElementsByTagName("wind")[0].getAttribute("chill");
		var objectWindDirection = data.getElementsByTagName("wind")[0].getAttribute("direction");
		var objectWindSpeed = data.getElementsByTagName("wind")[0].getAttribute("speed");
		var objectSunrise = data.getElementsByTagName("astronomy")[0].getAttribute("sunrise");
		var objectSunset = data.getElementsByTagName("astronomy")[0].getAttribute("sunset");
		var objectHumidity = data.getElementsByTagName("atmosphere")[0].getAttribute("humidity");

		objectWindDirection = parseInt(objectWindDirection);
		if(objectWindDirection == 0)
			windDirection = "Var";
		else if (objectWindDirection >= 338 || objectWindDirection <= 22)
			windDirection = "N";
		else if (objectWindDirection >= 23 && objectWindDirection <= 67)
			windDirection = "NE";
		else if (objectWindDirection >= 68 && objectWindDirection <= 112)
			windDirection = "E";
		else if (objectWindDirection >= 113 && objectWindDirection <= 157)
			windDirection = "SE";
		else if (objectWindDirection >= 158 && objectWindDirection <= 202)
			windDirection = "S";
		else if (objectWindDirection >= 203 && objectWindDirection <= 247)
			windDirection = "SW";
		else if (objectWindDirection >= 248 && objectWindDirection <= 292)
			windDirection = "W";
		else if (objectWindDirection >= 293 && objectWindDirection <= 337)
			windDirection = "NW";
		else
			windDirection = "?";

		this.$.wTemperature.setContent(objectTemp + "&deg;" + objectTempUnits);
		this.$.wHigh.setContent(objectHigh + "&deg;");
		this.$.wLow.setContent(objectLow + "&deg;");
		this.$.wCity.setContent(objectCity);
		this.$.wConditions.setContent(objectStatusText);

		this.$.wSunrise.setContent(objectSunrise);
		this.$.wSunset.setContent(objectSunset);
		this.$.wWind.setContent(windDirection + " at " + objectWindSpeed + " " + objectSpeedUnits);
		this.$.wHumidity.setContent(objectHumidity + "%");

		var iconPack = "default";
		this.$.statusIcon.setSrc("../images/icon-packs/"+iconPack+"/"+objectStatusCode+".png");
	},
	dashOpened: function() {
		this.initData();
	},
	dashClosed: function() {
		//this.dashStatus = "closed";
	},
	dashExited: function() {
		//this.$.screenState.destroy();
	}
});