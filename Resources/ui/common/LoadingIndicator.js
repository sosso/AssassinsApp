function LoadingIndicator() {
	var logging = require('utils/logging');
	var loadingWindow;
	var loadingIndicatorVisible = false;
	createLoadingIndicator = function(displayMessage) {
		var window = Ti.UI.createWindow({
			backgroundColor : 'transparent',
			// start the window off very small and completely transparent
			fullscreen : true,
			opacity : 0.5
		});
		var view = Ti.UI.createView({
			top : 0,
			bottom : 0,
			backgroundColor : 'black',
			// borderRadius: 10,
			borderWidth : 4,
			zIndex : -1
		});
		window.add(view);

		var loadingIndicator = Ti.UI.createActivityIndicator({
			height : 50,
			width : 10,
			color : 'white'
		});
		if (displayMessage) {
			loadingIndicator.message = displayMessage;
		} else {
			loadingIndicator.message = 'Please wait. . .';
		}
		window.add(loadingIndicator);

		loadingIndicator.show();
		window.die = function() {
			loadingIndicator.hide();
			window.close();
		};
		// window.addEventListener('close', function() {
		// loadingIndicator.hide();
		// });
		return window;
	};

	Ti.App.addEventListener('app:showiOSLoadingIndicator', function(e) {
		if (e && e.reason) {
			logging.debug('Loading indicator request; Reason: ' + e.reason);
		}
		if (!loadingIndicatorVisible) {
			if (e.message) {
				iosShowFunction({
					message : e.message
				});
			} else {
				iosShowFunction();
			}
		} else {
			logging.debug('Loading indicator already visible, not creating another');
		}
	});
	Ti.App.addEventListener('app:hideiOSLoadingIndicator', function(e) {
		if (e.reason) {
			logging.debug('Hiding loading indicator; reason : ' + e.reason);
		}
		iosHideFunction();
	});
	var iosShowFunction = function(msg) {
		if (msg) {
			if (msg.message) {
				loadingWindow = createLoadingIndicator(msg.message);
			}
		} else {
			loadingWindow = createLoadingIndicator();
		}
		loadingIndicatorVisible = true;
	};
	var iosHideFunction = function() {
		if (loadingWindow) {
			loadingWindow.die();
			loadingWindow.visible = false;
			logging.debug('closed loading indicator');
		} else {
			logging.debug('There was no loading indicator visible');
		}
		loadingWindow = null;
		loadingIndicatorVisible = false;
	};
};

module.exports = LoadingIndicator;
