var network = require('network/constants');
var logger = require('utils/logging');

Ti.App.addEventListener('network:account:createuser', function(params) {
	var createReq = Ti.Network.createHTTPClient();
	Titanium.Media.showCamera({
		success : function(event) {
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				var image = event.media
				createReq.open("POST", network.baseurl + '/account/createuser');
				var reqParams = {
					profile_picture : image,
					username : params.username,
					email : params.email,
					password : params.password
				}
				createReq.send(reqParams);
			} else {
				alert("Photographs only" + event.mediaType);
			}
		},
		cancel : function(error) {
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Please run this test on device');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		error : function(error) {
			// called when there's an error
			var a = Titanium.UI.createAlertDialog({
				title : 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Please run this test on device');
			} else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		},
		saveToPhotoGallery : false,
		allowEditing : false,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});

	createReq.onload = function() {
		try {
			var json = this.responseText;
			var response = JSON.parse(json);
			if (!response.reason && response.success == 'success') {
				Ti.App.fireEvent('network:account:createuser:success');
				Ti.App.Properties.setString('username', params.username);
				Ti.App.Properties.setString('secret_token', params.password);
			} else {
				Ti.App.fireEvent('app:accountCreationFailure', {
					response : this.responseText
				});
			}
		} catch(exception) {
			logger.error('Error creating account');
		}
	}
	createReq.onerror = function() {
		var resp = this.responseText;
	}
});

Ti.App.addEventListener('network:account:login', function(params) {

	var loginReq = Ti.Network.createHTTPClient();
	loginReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			if (!response.reason && response.success == 'success') {
				Ti.App.Properties.setString('username', params.params.username);
				Ti.App.Properties.setString('secret_token', params.params.password);
				Ti.App.fireEvent('network:account:login:success');
			} else {
				Ti.App.fireEvent('app:loginFailure', {
					response : this.responseText
				});
			}
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	loginReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:account:login:failure', {
			response : this.responseText
		});
	};
	Ti.App.fireEvent('app:showiOSLoadingIndicator', {
		message : 'Logging you in. . .',
		reason : 'login attempt'
	});
	loginReq.open("POST", network.baseurl + '/account/login');
	loginReq.send(params.params);
});
