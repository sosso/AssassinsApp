var network = require('network/constants');
var logger = require('utils/logging');

Ti.App.addEventListener('network:game:assassinate', function(params) {
	var postReq = Ti.Network.createHTTPClient();
	postReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			Ti.App.fireEvent('network:game:assassinate:success', {
				mission : response
			});
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	postReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:assassinate:failure', {
			response : this.responseText
		});
	};
	var postParams = {
		username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', ''),
		game_id : params.game_id,
		shot_picture : params.shot_picture,
		target_username : params.target_username
	};
	postReq.open("POST", network.baseurl + '/game/assassinate');
	postReq.send(postParams);
});

