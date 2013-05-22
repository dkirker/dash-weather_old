enyo.kind({
	name: "Launcher",
	kind: "Component",
	components: [
		{kind: "ApplicationEvents", onLoad: "loadApp", onApplicationRelaunch: "loadApp"}
	],
	create: function() {
		this.inherited(arguments);
		this.log();
	},
	loadApp: function() {
		if (window.PalmSystem) {
			var deviceInfo = JSON.parse(PalmSystem.deviceInfo);
			var majorVersion = deviceInfo["platformVersionMajor"];
			enyo.log("Device Check: " + majorVersion);
			if (majorVersion >= 3)
				enyo.windows.openWindow("touchpad.html","DashWeatherTouchpad",{});
			else
				enyo.windows.openWindow("phone.html","DashWeatherPhone",{});
		}
	}
});