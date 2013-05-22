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
	name: "DashWeatherPhone",
	kind: "VFlexBox",
	className: "phone-main",
	components: [
		{kind: "Pane", transitionKind: "enyo.transitions.Simple", flex: 1, components:[
			{name: "paneMain", kind: "VFlexBox", className: "pane-styles", flex: 1, components: [
				{kind: "enyo.Scroller", flex: 1, horizontal: false, autoHorizontal: false, components: [
					{style: "height: 15px;"},
					{className: "txtTitle", content: "Welcome!"},
					{className: "txtContent", content: "Let me explain how this all works. This app creates a widget in your notification dashboard. It will automatically find your location and figure out which units to use, so no need to worry about setting anything up. You can manually set your location and units in the Settings menu if you'd like though. Actually, you should probably go check out the Settings menu anyway. I've added a lot of nifty options in there for you to customize your weather widget."},
					{className: "txtContent", content: "Your location and weather data are refreshed every time you open the notification dashboard. It is also refreshed when you tap the right half of the widget, which comes in handy when you want to update it from the lockscreen. You can tap the left half of the widget to launch your favorite weather app or the Yahoo Weather website. Don't forget to pick the app you want to launch in the Settings menu!"},
					{className: "txtContent", content: "That's all you really need to know! Why don't you tap the button below and launch your fancy new widget? You can throw away this card after you do that."}
				]},
				{kind: "Button", caption: "Launch Widget", className: "btn-launch", style: "background-color: #000; color: #fff;", onclick: "initWidget"}
			]},
			{name: "paneSettings", kind: "VFlexBox", lazy: true, flex: 1, components:[
				{kind: "enyo.Scroller", flex: 1, horizontal: false, autoHorizontal: false, components: [
					{style: "height: 15px;"},
					{className: "txtTitle", content: "Settings"},
					{kind: "RowGroup", caption: "Location", components: [
						{kind: "HFlexBox", align: "center", components: [
							{className: "enyo-label", content: "Use GPS Location", flex: 1},
							{name: "btnUseGps", kind: "ToggleButton", state: true, onLabel: "YES", offLabel: "NO", style: "margin-right: -5px;", onChange: "gpsToggleChanged"}
						]},
						{name: "searchInput", kind: "Input", spellcheck: false, autocorrect: false, selectAllOnFocus: true, hint: "Enter your city", components: [
							{name: "searchButton", kind: "Button", caption: "Search", className: "enyo-button-dark search-button", style: "margin-right: -5px;", onclick: "searchWoeid"}
						]},
						{kind: "VFlexBox", components: [
							{name: "searchResult", allowHtml: true, content: "Search Result"}
						]}
					]},
					{kind: "RowGroup", caption: "App", components: [
						{kind: "HFlexBox", align: "center", components: [
							{className: "enyo-label", content: "Launch Widget", flex: 1},
							{name: "selLaunchWidget", kind: "ListSelector", contentPack: "end", items: [
								{caption: "Manual", value: "manual"},
								{caption: "On App Start", value: "appStart"}
							]}
						]}
					]},
					{kind: "RowGroup", caption: "Widget", components: [
						{kind: "HFlexBox", align: "center", components: [
							{className: "enyo-label", content: "App Launch", flex: 1},
							{name: "selLaunchApp", kind: "ListSelector", contentPack: "end", items: [
								{caption: "Yahoo Website", value: "website"},
								{caption: "AccuWeather", value: "com.accuweather.accuweather"},
								{caption: "AccuWeather Premium", value: "com.accuweather.palm.purchased"},
								{caption: "aniWeather", value: "com.forwebos.aniweather"},
								{caption: "Clear Weather", value: "com.madreporite.clearweather"},
								{caption: "ReWeather", value: "com.recursive.reweather"},
								{caption: "The Weather Channel", value: "com.weather.palm"},
								{caption: "WeatherBug Elite", value: "com.aws.weatherbug"},
								{caption: "weatherIcon", value: "com.abesapps.weather"},
								{caption: "Weather Window", value: "com.hiddenworldhut.weatherwindow"}
							]}
						]},
						{kind: "HFlexBox", align: "center", components: [
							{className: "enyo-label", content: "Icon Pack", flex: 1},
							{name: "selIconPack", kind: "ListSelector", contentPack: "end", items: [
								{caption: "White", value: "default"},
								{caption: "Color", value: "vclouds"}
							]}
						]},
						{kind: "HFlexBox", align: "center", components: [
							{className: "enyo-label", content: "Background", flex: 1},
							{name: "selWidgetBackground", kind: "ListSelector", contentPack: "end", items: [
								{caption: "Scenic", value: "scenic"},
								{caption: "Black", value: "black"}
							]}
						]},
						{kind: "HFlexBox", align: "center", components: [
							{className: "enyo-label", content: "Units", flex: 1},
							{name: "selUnits", kind: "ListSelector", contentPack: "end", items: [
								{caption: "Auto", value: "auto"},
								{caption: "Fahrenheit", value: "f"},
								{caption: "Celsius", value: "c"}
							]}
						]},
						{kind: "HFlexBox", align: "center", components: [
							{className: "enyo-label", content: "Line 1", flex: 1},
							{name: "selLine1", kind: "ListSelector", contentPack: "end", items: [
								{caption: "City", value: "city"},
								{caption: "Conditions", value: "conditions"},
								{caption: "Wind Speed", value: "wind"},
								{caption: "Sunrise", value: "sunrise"},
								{caption: "Sunset", value: "sunset"}
							]}
						]},
						{kind: "HFlexBox", align: "center", components: [
							{className: "enyo-label", content: "Line 2", flex: 1},
							{name: "selLine2", kind: "ListSelector", contentPack: "end", items: [
								{caption: "City", value: "city"},
								{caption: "Conditions", value: "conditions"},
								{caption: "Wind Speed", value: "wind"},
								{caption: "Sunrise", value: "sunrise"},
								{caption: "Sunset", value: "sunset"}
							]}
						]}
					]}
				]},
				{kind: "Button", caption: "Done", className: "btn-launch", style: "background-color: #000; color: #fff;", onclick: "closeSettingsPane"}
			]},
			{name: "paneContact", kind: "VFlexBox", className: "pane-styles", flex: 1, components: [
				{kind: "enyo.Scroller", flex: 1, horizontal: false, autoHorizontal: false, components: [
					{style: "height: 15px;"},
					{className: "txtTitle", content: "Contact"},
					{className: "txtContent", content: "Have an idea for a cool feature you'd like to see? Is there something about this app that you think could be a little better? Feel free to get in contact with me! I'm always open for suggestions and feedback."},
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
					]}
				]},
				{kind: "Button", caption: "Close", className: "btn-launch", style: "background-color: #000; color: #fff;", onclick: "closeContactPane"}
			]},
			{name: "paneAbout", kind: "VFlexBox", className: "pane-styles", flex: 1, components: [
				{kind: "enyo.Scroller", flex: 1, horizontal: false, autoHorizontal: false, components: [
					{style: "height: 15px;"},
					{className: "txtTitle", content: "About"},
					{className: "txtContent", content: "Dash Weather was coded and designed by Choorp Studios. It is licensed under the Apache v2.0 license."},
					{className: "txtContent", content: "Installed version: 1.3.0"},
					{className: "txtSubTitle", content: "Changelog"},
					{className: "txtSubSubTitle", content: "1.3.0"},
					{className: "txtChangelog", allowHtml: true, content: "- New UI and more content for the About, Contact, and Help menus<br>- You can now set the widget to automatically launch when the app is opened<br>- Tap the left side of the widget to launch the weather app of your choice<br>- Added a setting for Widget Background. Options available are 'Scenic' and 'Black'<br>- Adjusted the widget's padding so that it looks better when you have multiple notifications<br>- Added a setting for Icon Pack. Options available are 'White' and 'Color'<br>- Updated the text on main page to reflect the new features"},
					{className: "txtSubSubTitle", content: "1.2.0"},
					{className: "txtChangelog", allowHtml: true, content: "- Now supports all webOS phones running Enyo<br>- Added more options in the Settings menu on phones"},
					{className: "txtSubSubTitle", content: "1.1.0"},
					{className: "txtChangelog", allowHtml: true, content: "- New name (Dash Weather)<br>- New, more polished UI<br>- Added Settings menu<br>- Added option for dashboard size<br>- Tap to refresh widget. Best for updating it from the lock screen<br>- Added all the bits needed to be a proper AppCat-quality app"},
					{className: "txtSubSubTitle", content: "1.0.0"},
					{className: "txtChangelog", allowHtml: true, content: "- Initial release"}
					
				]},
				{kind: "Button", caption: "Close", className: "btn-launch", style: "background-color: #000; color: #fff;", onclick: "closeAboutPane"}
			]},
			{name: "paneHelp", kind: "VFlexBox", className: "pane-styles", flex: 1, components: [
				{kind: "enyo.Scroller", flex: 1, horizontal: false, autoHorizontal: false, components: [
					{style: "height: 15px;"},
					{className: "txtTitle", content: "Help"},
					{className: "txtContent", content: "Need some help with all these fancy features? I got you covered."},
					{className: "txtSubTitle", content: "Using the Widget"},
					{className: "txtContent", content: "There are two ways you can interact with the widget. You can tap on the left half to open the app you chose in Settings, or you can tap on the right half to force a refresh of the location (if GPS is enabled) and weather data. The widget will automatically refresh itself every time you open the notification dashboard."},
					{className: "txtSubTitle", content: "The Settings Menu"},
					{className: "txtContent", allowHtml: true, content: "Most of these settings should be pretty self explanatory, but I'll go over them anyway."},
					{className: "txtSubSubTitle", content: "Use GPS Location"},
					{className: "txtChangelog", allowHtml: true, content: "Enabling this will make the widget use you device's GPS to determine your location. When this is enabled, the search box below will be disabled."},
					{className: "txtSubSubTitle", content: "Search Box"},
					{className: "txtChangelog", allowHtml: true, content: "Just enter the name of your town and state (example: Philadelphia PA) and click the search button. For some reason, Yahoo's city search doesn't like commas so try to avoid using them. Once your correct location is displayed below this box, you're all set to go!"},
					{className: "txtSubSubTitle", content: "Launch Widget"},
					{className: "txtChangelog", allowHtml: true, content: "'Default' just means that you need to press the button on the main page to launch the widget. 'On App Start' will automatically launch the widget when the app is opened."},
					{className: "txtSubSubTitle", content: "App Launch"},
					{className: "txtChangelog", allowHtml: true, content: "This is the app or website that is launched when you tap on the left half of the widget."},
					{className: "txtSubSubTitle", content: "Icon Pack"},
					{className: "txtChangelog", allowHtml: true, content: "Choose which style of icons you want to be displayed."},
					{className: "txtSubSubTitle", content: "Background"},
					{className: "txtChangelog", allowHtml: true, content: "Choose what you want to use for the widget's background."},
					{className: "txtSubSubTitle", content: "Units"},
					{className: "txtChangelog", allowHtml: true, content: "This option doesn't need any explanaion."},
					{className: "txtSubSubTitle", content: "Line 1/2"},
					{className: "txtChangelog", allowHtml: true, content: "Choose what you want displayed on right side of the widget. Line 1 is the top, line 2 is the bottom."}
				]},
				{kind: "Button", caption: "Close", className: "btn-launch", style: "background-color: #000; color: #fff;", onclick: "closeHelpPane"}
			]}
		]},

		{kind: "ApplicationEvents", onLoad: "loadPrefs"},
		{kind: "AppMenu", components: [
			{caption: "Settings", onclick: "openSettingsPane"},
			{caption: "Contact", onclick: "openContactPane"},
			{caption: "Help", onclick: "openHelpPane"},
			{caption: "About", onclick: "openAboutPane"}
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
			{content: "v1.2.0"},
			{content: "Last updated: 11/29/12"},
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
	configWoeid: 2502265,
	configCountry: "US",
	apiAppId: "GoF4p0_V34EwfF20CrgaLr1jaorOozfo0LhXQaDYLNMf2MPmCCalBPqcR8nM",
	create: function () {
		this.inherited(arguments);
	},
	savePrefs: function () {
		enyo.application.appPrefs = {
			woeid: this.configWoeid,
			country: this.configCountry,
			location: this.$.searchResult.getContent(),
			units: this.$.selUnits.getValue(),
			useGps: this.$.btnUseGps.getState(),
			firstUse: false,
			line1: this.$.selLine1.getValue(),
			line2: this.$.selLine2.getValue(),
			launchId: this.$.selLaunchApp.getValue(),
			launchWidget: this.$.selLaunchWidget.getValue(),
			iconPack: this.$.selIconPack.getValue(),
			widgetBackground: this.$.selWidgetBackground.getValue()
		};
		enyo.setCookie("appPrefs", enyo.json.stringify(enyo.application.appPrefs));
	},
	loadPrefs: function() {
		enyo.application.appPrefs = {
			homebrew: false,
			woeid: 2502265,
			country: "US",
			location: "Search Result",
			units: "auto",
			useGps: true,
			firstUse: true,
			line1: "city",
			line2: "conditions",
			launchId: "website",
			launchWidget: "manual",
			iconPack: "default",
			widgetBackground: "scenic"
		};
		var cookie = enyo.getCookie("appPrefs");
		if(cookie) {
			enyo.application.appPrefs = enyo.mixin(enyo.application.appPrefs, enyo.json.parse(cookie));
		}
		
		var startWidget = enyo.application.appPrefs.launchWidget;
		if (startWidget == "appStart")
			this.initWidget();
	},
	gpsToggleChanged: function() {
		var gpsToggleStatus = this.$.btnUseGps.getState();
		this.$.searchInput.setDisabled(gpsToggleStatus);
		this.$.searchButton.setDisabled(gpsToggleStatus);
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

		this.configWoeid = locWOEID;
		this.configCountry = locCountryCode;
		this.$.searchResult.setContent(locCity + "<br>" + locState + "<br>" + locCountry);
	},
	initWidget: function() {
		var config = enyo.application.appPrefs;
		var widgetPrefs = {
			wApiId: this.apiAppId,
			wWoeid: config.woeid,
			wCountry: config.country,
			wUnits: config.units,
			wUseGps: config.useGps,
			wLine1: config.line1,
			wLine2: config.line2,
			wLaunchId: config.launchId,
			wIconPack: config.iconPack,
			wBackground: config.widgetBackground
		};

		var customIcon = "../images/icon-packs/vclouds/icon-mini.png";
		enyo.windows.openDashboard("widget-phone/index.html", "dashWeatherWidget", widgetPrefs, {clickableWhenLocked:true, smallIcon:customIcon});
	},
	openHelpPane: function() {
		this.$.pane.selectViewByName("paneHelp");
	},
	closeHelpPane: function() {
		this.$.pane.selectViewByName("paneMain");
	},
	openAboutPane: function() {
		this.$.pane.selectViewByName("paneAbout");
	},
	closeAboutPane: function() {
		this.$.pane.selectViewByName("paneMain");
	},
	openContactPane: function() {
		this.$.pane.selectViewByName("paneContact");
	},
	closeContactPane: function() {
		this.$.pane.selectViewByName("paneMain");
	},
	openSettingsPane: function(inSender) {
		this.$.pane.selectViewByName("paneSettings");

		var config = enyo.application.appPrefs;
		this.$.searchResult.setContent(config.location);
		this.$.selUnits.setValue(config.units);
		this.$.btnUseGps.setState(config.useGps);
		this.$.selLine1.setValue(config.line1);
		this.$.selLine2.setValue(config.line2);
		this.$.selLaunchApp.setValue(config.launchId);
		this.$.selLaunchWidget.setValue(config.launchWidget);
		this.$.selIconPack.setValue(config.iconPack);
		this.$.selWidgetBackground.setValue(config.widgetBackground);
		this.gpsToggleChanged();
	},
	closeSettingsPane: function() {
		this.savePrefs();
		this.$.pane.selectViewByName("paneMain");
	},
	contactEmail: function() {
		this.$.launchApp.call({"target": "mailto: Choorp@gmail.com"});
	},
	contactTwitter: function() {
		this.$.launchApp.call({"target": "http://www.twitter.com/Choorp"});
	}
});