var network = require('network/constants');
var logger = require('utils/logging');

Ti.App.addEventListener('network:game:start', function(params) {
	var startReq = Ti.Network.createHTTPClient();
	startReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			if (!response.reason && response.success == 'success') {
				Ti.App.fireEvent('network:game:start:success');
			} else {
				Ti.App.fireEvent('network:game:start:failure', {
					response : this.responseText
				});
			}
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	startReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:start:failure', {
			response : this.responseText
		});
	};
	var reqParams = {
		game_id : params.game_id,
		game_master_username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', '')
	};

	startReq.open("POST", network.baseurl + '/game/master/start');
	startReq.send(reqParams);
});
