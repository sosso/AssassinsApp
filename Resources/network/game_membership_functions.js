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
	params.username = Ti.App.Properties.getString('username', '');
	params.secret_token = Ti.App.Properties.getString('secret_token', '');
	createReq.open("POST", network.baseurl + '/game');
	createReq.send(params);

});
