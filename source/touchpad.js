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
	name: "DashWeatherTouchpad",
	kind: "HFlexBox",
	className: "main",
	components: [
		{kind: "VFlexBox", flex: 1, align: "center", pack: "middle", components: [
			{name: "helperBox", kind: "VFlexBox", className: "helper-box", components: [
				{kind: "Image", src: "images/arrow-up.png", height: "24px", width: "24px", style: "margin-left: 30px;"},
				{className: "helper-text", content: "Hey! Want to manually set your location or unit preferences? Check out the Settings menu above."}
			]},
			{flex: 1}
		]},
		{kind: "VFlexBox", style: "width: 520px; background: rgba(0,0,0,.2); padding: 0 10px 0 10px;", align: "center", pack: "middle", components: [
			{flex: 1},
			{className: "txtTitle", content: "Welcome!"},
			{className: "txtContent", content: "Let me explain how this all works. This app creates a widget in your notification dashboard. It will automatically find your location and figure out which units to use, so no need to worry about setting anything up. You can manually set your location and units in the Settings menu if you'd like though."},
			{className: "txtContent", content: "Your location and weather data are refreshed every time you open the notification dashboard. It is also refreshed when it is tapped, which comes in handy when you want to update it from the lockscreen."},
			{className: "txtTitle", content: "How do I use read it?"},
			{name: "sampleWidget", kind: "Image", src: "images/widget-example-small.png"},
			{className: "txtContent", content: "Now, let's take a look at the widget itself. I included a sample widget above as a reference. I even added some fancy labels to describe everything you see here."},
			{className: "txtContent", content: "That's all you really need to know! Why don't you tap the button below and launch your fancy new widget? You can throw away this card after you do that. You'll need to close the widget before you can open this card again."},
			{kind: "Button", caption: "Launch Widget", className: "enyo-button-affirmative", style: "width: 200px;", onclick: "initWidget"},
			{flex: 1}
		]},
		{flex: 1},

		{kind: "ApplicationEvents", onLoad: "loadPrefs"},
		{kind: "AppMenu", components: [
			{caption: "Settings", onclick: "openSettingsPopup"},
			{caption: "Contact", onclick: "openContactPopup"},
			{caption: "Help", onclick: "openHelpPopup"},
			{caption: "About", onclick: "openAboutPopup"}
		]},
		{name: "popupSettings", kind: "ModalDialog", caption: "Widget Settings", className: "popupStyle", components: [
			{kind: "RowGroup", components: [
				{name: "searchInput", kind: "Input", spellcheck: false, autocorrect: false, hint: "Enter your city"},
				{kind: "VFlexBox", components: [
					{name: "searchResult", allowHtml: true, content: ""},
					{name: "searchButton", kind: "Button", caption: "Set Location", onclick: "searchWoeid"}
				]},
				{kind: "HFlexBox", align: "center", components: [
					{className: "enyo-label", content: "Use GPS Location", flex: 1},
					{name: "btnUseGps", kind: "ToggleButton", state: true, onLabel: "YES", offLabel: "NO", style: "margin-right: -10px;", onChange: "gpsToggleChanged"}
				]}
			]},
			{kind: "RowGroup", components: [
				{kind: "HFlexBox", align: "center", components: [
					{className: "enyo-label", content: "Units"},
					{name: "selUnits", kind: "ListSelector", contentPack: "end", flex: 1, items: [
						{caption: "Auto", value: "auto"},
						{caption: "Fahrenheit", value: "f"},
						{caption: "Celsius", value: "c"}
					]}
				]},
				{kind: "HFlexBox", align: "center", components: [
					{className: "enyo-label", content: "Enable LunaCE Dash", flex: 1},
					{name: "btnLunaceDash", kind: "ToggleButton", state: false, onLabel: "YES", offLabel: "NO", style: "margin-right: -10px;", onChange: "lunaceToggleChanged"}
				]}
			]},
			{kind: "Button", caption: "Done", className: "enyo-button-affirmative", onclick: "closeSettingsPopup"}
		]},
		{name: "popupContact", kind: "Popup", className: "popupStyle", components: [
			{className: "popupTitle", content: "Contact"},
			{kind: "HFlexBox", style: "margin: 10px 0 20px 0;", components: [
				{flex:1},
				{kind: "VFlexBox", components: [
					{kind: "Image", src: "images/email.png", onclick: "contactEmail"},
					{content: "Email", style: "text-align: center;"}
				]},
				{flex:1},
				{kind: "VFlexBox", components: [
					{kind: "Image", src: "images/twitter.png", onclick: "contactTwitter"},
					{content: "Twitter", style: "text-align: center;"}
				]},
				{flex:1}
			]},
			{kind: "Button", caption: "Close", onclick: "closeContactPopup"}
		]},
		{name: "popupHelp", kind: "Popup", className: "popupStyle", style: "width: 400px;", components: [
			{className: "popupTitle", content: "Help!", onmousehold: "openProPopup"},
			{content: "If you're having issues getting your device to find your location, please make sure Location Services is turned on. If you're still having issues, you should try restarting your device. If that doesn't work, then it's out of my control. However, you can always manually set your location in the Settings menu."},
			{kind: "Button", caption: "Close", onclick: "closeHelpPopup"}
		]},
		{name: "popupAbout", kind: "Popup", className: "popupStyle", components: [
			{className: "popupTitle", content: "About"},
			{content: "Dash Weather"},
			{content: "v1.1.0"},
			{content: "Last updated: 9/11/12"},
			{kind: "Button", caption: "Close", onclick: "closeAboutPopup"}
		]},
		{name: "popupPro", kind: "Popup", className: "popupStyle", components: [
			{className: "popupTitle", content: "Pro"},
			{content: "Oh, hello there! If you're a homebrew user and already have LunaCE installed, click the button. If not, you should probably go download Preware Homebrew Documentation from the App Catalog."},
			{style: "height: 20px;"},
			{kind: "Button", caption: "Enable Pro Widget", className: "enyo-button-affirmative", onclick: "enableProFeatures"},
			{kind: "Button", caption: "Disable Pro Widget", className: "enyo-button-negative", onclick: "disableProFeatures"},
			{kind: "Button", caption: "Close", onclick: "closeProPopup"}
		]},
		{name: "launchApp", kind: "PalmService", service: "palm://com.palm.applicationManager/", method: "open"},
		{name: "getWOEID", kind: "WebService", url: "", onResponse: "gotWOEID"}
	],
	proStatus: false,
	configWoeid: 2502265,
	configCountry: "US",
	configLocationDetail: "",
	configUnits: "auto",
	configUseGps: true,
	apiAppId: "GoF4p0_V34EwfF20CrgaLr1jaorOozfo0LhXQaDYLNMf2MPmCCalBPqcR8nM",
	create: function () {
		this.inherited(arguments);
	},
	savePrefs: function () {
		enyo.application.appPrefs = {
			homebrew: this.proStatus,
			woeid: this.configWoeid,
			country: this.configCountry,
			location: this.configLocationDetail,
			units: this.configUnits,
			useGps: this.configUseGps,
			firstUse: false
		}
		enyo.setCookie("appPrefs", enyo.json.stringify(enyo.application.appPrefs));
	},
	loadPrefs: function() {
		enyo.application.appPrefs = {
			homebrew: false,
			woeid: 2502265,
			country: "US",
			location: "None",
			units: "auto",
			useGps: true,
			firstUse: true
		}
		var cookie = enyo.getCookie("appPrefs");
		if(cookie) {
			enyo.application.appPrefs = enyo.mixin(enyo.application.appPrefs, enyo.json.parse(cookie));
		}
		
		var config = enyo.application.appPrefs;
		enyo.log("loadPrefs: " + config.homebrew + " " + config.woeid + " " + config.country + " " + config.units + " " + config.useGps + " " + config.location);
		this.proStatus = config.homebrew;
		this.configWoeid = config.woeid;
		this.configCountry = config.country;
		this.configLocationDetail = config.location,
		this.configUnits = config.units;
		this.configUseGps = config.useGps;

		if(this.proStatus)
			this.$.sampleWidget.setSrc("images/widget-example-pro.png");

		if(config.firstUse)
			this.$.helperBox.setShowing(true);
		else
			this.$.helperBox.setShowing(false);
	},
	gpsToggleChanged: function() {
		var gpsToggleStatus = this.$.btnUseGps.getState();
		this.$.searchInput.setDisabled(gpsToggleStatus);
		this.$.searchButton.setDisabled(gpsToggleStatus);
	},
	lunaceToggleChanged: function() {
		var lunaceToggleState = this.$.btnLunaceDash.getState();
		if (lunaceToggleState)
			this.$.sampleWidget.setSrc("images/widget-example-pro.png");
		else
			this.$.sampleWidget.setSrc("images/widget-example-small.png");
	},
	searchWoeid: function() {
		var searchTerm = this.$.searchInput.getValue();
		var searchUrl = "http://where.yahooapis.com/v1/places.q("+searchTerm+")?appid="+this.apiAppId;
		this.$.getWOEID.setUrl(searchUrl);
		this.$.getWOEID.call();
	},
	gotWOEID: function(inSender, inResponse) {
		var data = (new DOMParser()).parseFromString(inResponse, "text/xml");
		var locWOEID = data.getElementsByTagName("woeid")[0].childNodes[0].nodeValue;
		var locCity = data.getElementsByTagName("name")[0].childNodes[0].nodeValue;
		var locState = data.getElementsByTagName("admin1")[0].childNodes[0].nodeValue;
		var locCountry = data.getElementsByTagName("country")[0].childNodes[0].nodeValue;
		var locCountryCode = data.getElementsByTagName("country")[0].getAttribute("code");
		enyo.log("WOEID Search: " + locCity + " " + locState + " " + locCountry + " " + locWOEID);

		this.configWoeid = locWOEID;
		this.configCountry = locCountryCode;
		this.$.searchResult.setContent(locCity + "<br>" + locState + "<br>" + locCountry);
	},
	enableProFeatures: function() {
		this.proStatus = true;
		
		//this.savePrefs();
	},
	disableProFeatures: function() {
		this.proStatus = false;
		
		//this.savePrefs();
	},
	initWidget: function() {
		var prefs = {
			wWoeid: this.configWoeid,
			wCountry: this.configCountry,
			wUnits: this.configUnits,
			wUseGps: this.configUseGps
		}

		if (this.proStatus)
			enyo.windows.openDashboard("widget-pro/index.html", "dashWeatherProWidget", prefs, {clickableWhenLocked:true, dashHeight: 120});
		else
			enyo.windows.openDashboard("widget/index.html", "dashWeatherWidget", prefs, {clickableWhenLocked:true});
	},
	openSettingsPopup: function() {
		this.$.popupSettings.openAtCenter();
		this.$.searchResult.setContent(this.configLocationDetail);
		this.$.selUnits.setValue(this.configUnits);
		this.$.btnUseGps.setState(this.configUseGps);
		this.$.btnLunaceDash.setState(this.proStatus);
		this.gpsToggleChanged();
		this.lunaceToggleChanged();
	},
	openHelpPopup: function() {
		this.$.popupHelp.openAtCenter();
	},
	openAboutPopup: function() {
		this.$.popupAbout.openAtCenter();
	},
	openProPopup: function() {
		this.$.popupAbout.close();
		this.$.popupPro.openAtCenter();
	},
	openContactPopup: function() {
		this.$.popupContact.openAtCenter();
	},
	closeSettingsPopup: function() {
		this.configLocationDetail = this.$.searchResult.getContent();
		this.configUnits = this.$.selUnits.getValue();
		this.configUseGps = this.$.btnUseGps.getState();
		this.proStatus = this.$.btnLunaceDash.getState();
		this.savePrefs();

		this.$.popupSettings.close();
	},
	closeContactPopup: function() {
		this.$.popupContact.close();
	},
	closeHelpPopup: function() {
		this.$.popupHelp.close();
	},
	closeAboutPopup: function(inSender) {
		this.$.popupAbout.close();
	},
	closeProPopup: function() {
		this.$.popupPro.close();
	},
	contactEmail: function() {
		this.$.launchApp.call({"target": "mailto: Choorp@gmail.com"});
	},
	contactTwitter: function() {
		this.$.launchApp.call({"target": "http://www.twitter.com/Choorp"});
	}
});