var network = require('network/constants');
var logger = require('utils/logging');

function getURL(obj) {
	var str = [];
	for (var p in obj) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	}
	return str.join("&");
}

Ti.App.addEventListener('network:game:join', function(params) {
	Ti.App.fireEvent('app:showiOSLoadingIndicator', {
		message : 'Joining game. . .'
	});
	var joinReq = Ti.Network.createHTTPClient();
	joinReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			if (!response.reason && response.success == 'success') {
				Ti.App.fireEvent('ui:toast', {
					message : 'Game joined successfully'
				});
				Ti.App.fireEvent('network:game:join:success');
			} else {
				Ti.App.fireEvent('ui:toast', {
					message : 'Failed to join game.  Reason: ' + response.reason
				});
				Ti.App.fireEvent('network:game:join:failure', {
					response : this.responseText
				});
			}
		} catch(exception) {
			logger.error(exception.msg);
		}

	};
	joinReq.onerror = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:join:failure', {
			response : this.responseText
		});
	};
	params.params.username = Ti.App.Properties.getString('username', '');
	params.params.sec2ret_token = Ti.App.Properties.getString('secret_token', '');
	joinReq.open("POST", network.baseurl + '/game/');
	joinReq.send(params.params);
});

Ti.App.addEventListener('network:game:getall', function(params) {

	var getReq = Ti.Network.createHTTPClient();
	Ti.App.fireEvent('app:showiOSLoadingIndicator', {
		message : 'Getting your games. . .'
	});
	getReq.onload = function() {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		var json = this.responseText;
		try {
			var response = JSON.parse(json);
			Ti.App.fireEvent('network:game:getall:success', {
				games : response
			});
		} catch(exception) {
			logger.error('Failed to parse auth json');
		}

	};
	getReq.onerror = function(error) {
		Ti.App.fireEvent('app:hideiOSLoadingIndicator');
		Ti.App.fireEvent('network:game:getall:failure', {
			response : this.responseText
		});

	};

	var getParams = {
		username : Ti.App.Properties.getString('username', ''),
		secret_token : Ti.App.Properties.getString('secret_token', '')
	};
	var addedToURL = getURL(getParams);
	getReq.open("GET", network.baseurl + '/game/?' + addedToURL);
	getReq.send();
});
