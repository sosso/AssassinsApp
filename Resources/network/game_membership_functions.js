var network = require('network/constants');
var logger = require('utils/logging');

Ti.App.addEventListener('network:game:join', function(params) {
	var joinReq = Ti.Network.createHTTPClient();
	joinReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			if (!response.reason && response.success == 'success') {
				Ti.App.fireEvent('network:game:join:success');
			} else {
				Ti.App.fireEvent('network:game:join:failure', {
					response : this.responseText
				});
			}
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	joinReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:join:failure', {
			response : this.responseText
		});
	};
	params.params.username = Ti.App.Properties.getString('username', '');
	params.params.secret_token = Ti.App.Properties.getString('secret_token', '');
	joinReq.open("POST", network.baseurl + '/game/');
	joinReq.send(params.params);
});

Ti.App.addEventListener('network:game:getall', function(params) {

	var getReq = Ti.Network.createHTTPClient();
	getReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			if (!response.reason) {
				Ti.App.fireEvent('network:game:getall:success', {
					games : response
				});
			}
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	getReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:getall:failure', {
			response : this.responseText
		});
	};
	var getParams = {
		username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', '')
	};
	getReq.open("GET", network.baseurl + '/game/');
	getReq.send(getParams);
});
