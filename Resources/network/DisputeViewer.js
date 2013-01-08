var network = require('network/constants');
var logger = require('utils/logging');

Ti.App.addEventListener('network:game:dispute:view', function(params) {
	var getReq = Ti.Network.createHTTPClient();
	getReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			Ti.App.fireEvent('network:game:dispute:view:success', {
				disputes : response
			});
		} catch(exception) {
			logger.error(exception);
		}

	};
	getReq.onerror = function(error) {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:dispute:view:failure', {
			response : this.responseText
		});
	};
	var getParams = {
		username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', ''),
		game_id : params.game_id
	};
	getReq.open("GET", network.baseurl + '/game/disputes');
	getReq.send(getParams);
});

Ti.App.addEventListener('network:game:dispute:decide', function(params) {
	var postReq = Ti.Network.createHTTPClient();
	postReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			Ti.App.fireEvent('network:game:dispute:decide:success', {
				mission : response
			});
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	postReq.onerror = function(error) {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:dispute:decide:failure', {
			response : this.responseText
		});
	};
	var postParams = {
		username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', ''),
		dispute_id : params.dispute_id,
		dispute_upheld : params.dispute_upheld,
		gm_decision_reason : params.gm_decision_reason || '',
		game_id : params.game_id
	};
	postReq.open("POST", network.baseurl + '/game/disputes');
	postReq.send(postParams);
});

module.exports = {};
