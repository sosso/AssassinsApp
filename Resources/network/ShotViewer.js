var network = require('network/constants');
var logger = require('utils/logging');

Ti.App.addEventListener('network:game:shot:view', function(params) {
	var getReq = Ti.Network.createHTTPClient();
	getReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			Ti.App.fireEvent('network:game:shot:view:success', {
				shot : response
			});
		} catch(exception) {
			logger.error(exception);
		}

	};
	getReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:shot:view:failure', {
			response : this.responseText
		});
	};
	var getParams = {
		username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', ''),
		shot_id : params.shot_id
	};
	getReq.open("GET", network.baseurl + '/game/shot?' + network.getURL(getParams));
	getReq.send();
});

Ti.App.addEventListener('network:game:shot:decide', function(params) {
	var postReq = Ti.Network.createHTTPClient();
	postReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			Ti.App.fireEvent('network:game:shot:decide:success', {
				mission : response
			});
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	postReq.onerror = function(error) {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:shot:decide:failure', {
			response : this.responseText
		});
	};
	var postParams = {
		username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', ''),
		shot_id : params.shot_id,
		shot_upheld : params.shot_upheld,
		claim : params.claim || ''
	};
	postReq.open("POST", network.baseurl + '/game/shot');
	postReq.send(postParams);
}); 