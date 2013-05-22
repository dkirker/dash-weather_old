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
	name: "DashWeatherWidget",
	kind: "VFlexBox",
	className: "dashboard",
	components: [
		{name: "widgetContainer", kind: "HFlexBox", flex: 1, align: "center", pack:"middle", components: [
			{kind: "HFlexBox", className: "dashContainer", align: "center", onclick: "openApp", style: "height: 46px;", components: [
				{name: "statusIcon", kind: "Image", src: "../images/icon-packs/default/3200.png"},
				{name: "wTemperature", className: "dashTemp", allowHtml: true, content: "00&deg;"},
				{kind: "VFlexBox", className: "dashContainer", align: "center", pack: "middle", components: [
					{name: "wHigh", className: "dashContent highlow", allowHtml: true, content: "00&deg;", style: "margin-bottom: 2px;"},
					{name: "wLow", className: "dashContent highlow", allowHtml: true, content: "00&deg;"}
				]}
			]},
			{kind: "VFlexBox", flex: 1, className: "dashContainer", onclick: "initData", components: [
				{name: "wLine1", className: "dashContent alignRight", style: "margin-bottom: 2px;", content: "Welcome!"},
				{name: "wLine2", className: "dashContent alignRight", content: "Loading..."}
			]}
		]},
		{kind: "ApplicationEvents", onWindowActivated: "dashOpened"},
		{name: "srvGps", kind: "PalmService", service: "palm://com.palm.location/", method: "getCurrentPosition", onResponse: "gotGPS"},
		{name: "srvWoeid", kind: "WebService", url: "", onResponse: "gotWOEID"},
		{name: "srvWeather", kind: "WebService", url: "", onResponse: "gotWeather"},
		{name: "launchApp", kind : "PalmService", service : "palm://com.palm.applicationManager", method : "launch", onFailure : "launchAppFailure"},
		{name: "openWeb", kind : "PalmService", service : "palm://com.palm.applicationManager", method : "open"}
	],
	create: function () {
		this.inherited(arguments);
	},
	openApp: function() {
		enyo.log("openCustomApp: " + "fired");
		var appid = enyo.windowParams.wLaunchId;
		if (appid == "website") {
			var url = "http://m.yahoo.com/w/ygo-weather/forecast.bp?l=" + enyo.windowParams.wWoeid;
			this.$.openWeb.call({"target": url});
		}
		else {
			this.$.launchApp.call({"id": appid});
		}
	},
	initData: function() {
		// enyo.log("initData: " + "Use GPS? " + this.configUseGps);
		if(enyo.windowParams.wBackground == "scenic")
			this.$.widgetContainer.addStyles("background-image: url('images/dash-bg.png');");

		if (enyo.windowParams.wUseGps) {
			this.getLocation();
		}
		else {
			this.getWeather();
		}

	},
	getLocation: function() {
		// enyo.log("getLocation: " + "Use GPS? " + this.configUseGps);
		this.$.wLine2.setContent("Checking GPS...");
		this.$.srvGps.call();
	},
	gotGPS: function(inSender, inResponse) {
		// enyo.log("gotGPS: " + enyo.json.stringify(inResponse));
		if (inResponse.errorCode != 0) {
			this.$.wLine2.setContent("GPS error " + inResponse.errorCode);
			return;
		}

		var urlLocation = "http://where.yahooapis.com/geocode?location=" + inResponse.latitude + "+" + inResponse.longitude + "&gflags=R&appid=" + enyo.windowParams.wApiId;
		this.$.srvWoeid.setUrl(urlLocation);
		this.$.wLine2.setContent("Getting location...");
		this.$.srvWoeid.call();
	},
	gotWOEID: function(inSender, inResponse) {
		var data = (new DOMParser()).parseFromString(inResponse, "text/xml");
		var locCity = data.getElementsByTagName("city")[0].childNodes[0].nodeValue;
		var locWOEID = data.getElementsByTagName("woeid")[0].childNodes[0].nodeValue;
		var locCountry = data.getElementsByTagName("countrycode")[0].childNodes[0].nodeValue;
		enyo.log("gotWOEID: " + locCountry + " " + locCity + " " + locWOEID);

		var units;
		if (enyo.windowParams.wUnits == "auto") {
			if (locCountry == "US")
				units = "f";
		}
		else if (enyo.windowParams.wUnits == "f") {
			units = "f";
		}
		else {
			units = "c";
		}

		this.$.srvWeather.setUrl("http://weather.yahooapis.com/forecastrss?w="+locWOEID+"&u="+units);
		this.$.wLine2.setContent("Getting weather...");
		this.$.srvWeather.call();
	},
	getWeather: function() {
		var units;
		if (enyo.windowParams.wUnits == "auto") {
			if (enyo.windowParams.wCountry == "US")
				units = "f";
			else
				units = "c";
		}
		else {
			if (enyo.windowParams.wUnits == "f")
				units = "f";
			else
				units = "c";
		}

		this.$.srvWeather.setUrl("http://weather.yahooapis.com/forecastrss?w="+enyo.windowParams.wWoeid+"&u="+units);
		this.$.wLine2.setContent("Getting weather...");
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

		var line1 = enyo.windowParams.wLine1;
		if(line1=="city")
			this.$.wLine1.setContent(objectCity);
		else if(line1=="conditions")
			this.$.wLine1.setContent(objectStatusText);
		else if(line1=="wind")
			this.$.wLine1.setContent(windDirection + " at " + objectWindSpeed + " " + objectSpeedUnits);
		else if(line1=="sunrise")
			this.$.wLine1.setContent(objectSunrise);
		else if(line1=="sunset")
			this.$.wLine1.setContent(objectSunset);
		else
			this.$.wLine1.setContent(objectCity);

		var line2 = enyo.windowParams.wLine2;
		if(line2=="city")
			this.$.wLine2.setContent(objectCity);
		else if(line2=="conditions")
			this.$.wLine2.setContent(objectStatusText);
		else if(line2=="wind")
			this.$.wLine2.setContent(windDirection + " at " + objectWindSpeed + " " + objectSpeedUnits);
		else if(line2=="sunrise")
			this.$.wLine2.setContent(objectSunrise);
		else if(line2=="sunset")
			this.$.wLine2.setContent(objectSunset);
		else
			this.$.wLine1.setContent(objectCity);
		
		var iconPack = enyo.windowParams.wIconPack;
		this.$.statusIcon.setSrc("../images/icon-packs/"+iconPack+"/"+objectStatusCode+".png");
	},
	dashOpened: function() {
		this.initData();
	}
});