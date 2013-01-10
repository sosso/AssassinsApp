/*
* A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.
* A starting point for tab-based application with multiple top-level windows.
* Requires Titanium Mobile SDK 1.8.0+.
*
* In app.js, we generally take care of a few things:
* - Bootstrap the application with any data we need
* - Check for dependencies like device type, platform version or network connection
* - Require and open our top-level UI component
*
*/

//bootstrap and check dependencies
if (Ti.version < 1.8) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

// This is a single context application with mutliple windows in a stack
(function() {
	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname, version = Ti.Platform.version, height = Ti.Platform.displayCaps.platformHeight, width = Ti.Platform.displayCaps.platformWidth;

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));

	var Window;
	if (isTablet) {
		Window = require('ui/tablet/ApplicationWindow');
	} else {
		Window = require('ui/handheld/ApplicationWindow');
	}

	// Ti.App.addEventListener('paused', function() {
	// if (!service) {
	// var intent = Titanium.Android.createServiceIntent({
	// url : 'services/notification_poller_android.js'
	// });
	// // Service should run its code every 20 seconds.
	// intent.putExtra('interval', 1000 * 20);
	// service = Titanium.Android.createService(intent);
	// }
	// service.start();
	// });

	var intent = Titanium.Android.createServiceIntent({
		url : 'services/notification_poller_android.js'
	});
	// Service should run its code every x miliseconds
	intent.putExtra('interval', 1000 * 60 * 10);
	var service = Titanium.Android.createService(intent);
	service.start();

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup(Window).open();
})();
