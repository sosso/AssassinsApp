function Toast(){};
function createiOSToastNotification(message) {
	var window = Ti.UI.createWindow({
		backgroundColor : 'transparent',
		opacity : 0.7,
		touchEnabled : false,
		top : 0
	});
	var view = Ti.UI.createView({
		height : '10%',
		width : '25%',
		center : {
			x : '50%',
			y : '80%'
		},
		backgroundColor : 'black',
		zIndex : 5,
		borderRadius : 5
	});
	var label = Ti.UI.createLabel({
		height : 'auto',
		textAlign : 'center',
		text : message.message,
		color : '#FFFFFF'
	});
	view.add(label);
	window.add(view);
	return window;
};

Ti.App.addEventListener('ui:toast', function(e) {
	if (Ti.Platform.osname == 'android') {
		var toast = Ti.UI.createNotification({
			message : e.message,
			duration : Ti.UI.NOTIFICATION_DURATION_LONG
		});
		toast.show();
	} else {
		var notification = createiOSToastNotification({
			message : e.message
		});
		notification.open();
		if (e.duration) {
			setTimeout(function() {
				notification.close();
			}, e.duration);
		} else {
			setTimeout(function() {
				notification.close();
			}, 2000);
		}
	}

});

exports.Toast = Toast;
