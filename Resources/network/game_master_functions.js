var network = require('network/constants');
var logger = require('utils/logging');

Ti.App.addEventListener('network:game:start', function(params) {
	var startReq = Ti.Network.createHTTPClient();
	startReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		var response;
		try {
			response = JSON.parse(json);
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}
		if (!response.reason && response.success == 'success') {
			Ti.App.fireEvent('network:game:start:success' + reqParams.game_id);
		} else {
			Ti.App.fireEvent('network:game:start:failure' + reqParams.game_id, {
				reason : response.reason
			});
		}

	};
	startReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:start:failure' + reqParams.game_id, {
			reason : this.responseText
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

Ti.App.addEventListener('network:game:creategame', function(params) {
	var createReq = Ti.Network.createHTTPClient();
	createReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			if (!response.reason && response.success == 'success') {
				Ti.App.fireEvent('network:game:creategame:success');
			} else {
				Ti.App.fireEvent('network:game:creategame:failure', {
					response : this.responseText
				});
			}
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	createReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:creategame:failure', {
			response : this.responseText
		});
	};
	var reqParams = {
		game_master_username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', ''),
		game_password : params.game_password,
		friendly_name : params.friendly_name,
		base_money : params.base_money
	};

	createReq.open("POST", network.baseurl + '/game/creategame');
	createReq.send(reqParams);
});
