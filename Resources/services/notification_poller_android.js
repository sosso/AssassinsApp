var cache = require('utils/Cache').Cache;
var network = require('network/constants');

var username = Ti.App.Properties.getString('username', '');
var getReq = Ti.Network.createHTTPClient();

function sendAlert(message) {
	var intent = Ti.Android.createIntent({
		flags : Ti.Android.FLAG_ACTIVITY_CLEAR_TOP | Ti.Android.FLAG_ACTIVITY_NEW_TASK,
		// Substitute the correct classname for your application
		className : 'com.sosso.assassins.AssassinsActivity',
	});
	intent.addCategory(Ti.Android.CATEGORY_LAUNCHER);

	// Create a PendingIntent to tie together the Activity and Intent
	var pending = Titanium.Android.createPendingIntent({
		intent : intent,
		flags : Titanium.Android.FLAG_UPDATE_CURRENT
	});

	// Create the notification
	var notification = Titanium.Android.createNotification({
		// icon is passed as an Android resource ID -- see Ti.App.Android.R.
		// icon : Ti.App.Android.R.drawable.my_icon,
		contentTitle : message,
		contentText : 'Click to return to CameraAssassins!',
		contentIntent : pending
	});
	// Send the notification.
	Titanium.Android.NotificationManager.notify(1, notification);
}

function alertOfGameStarted(gameTitle) {
	// Intent object to launch the application
	sendAlert(gameTitle + ' has been started!');
}

function alertOfAliveAgain(gameTitle) {
	sendAlert('You are alive again in ' + gameTitle + '!');
}

function alertOfShotOrKilled(gameTitle) {
	sendAlert('You have been shot or killed in ' + gameTitle + '!');
}

getReq.onload = function() {
	var json = this.responseText;
	try {
		var response = JSON.parse(json);
		for (var i = 0; i < response.length; i++) {
			var game = response[i];
			var gameCacheString = username + ':' + 'game:' + game.game_id;
			var gameFromCache = cache.get(gameCacheString);
			if (gameFromCache) {
				if (!gameFromCache.started && game.started) {
					alertOfGameStarted(game.game_friendly_name);
				} else if (gameFromCache.alive == true && !game.alive) {
					alertOfShotOrKilled(game.game_friendly_name);
				} else if (!gameFromCache.alive && game.alive) {
					alertOfAliveAgain(game.game_friendly_name);
				}
			}
			cache.put(gameCacheString, game, 60 * 60);
		}

	} catch(exception) {
	}

};
getReq.onerror = function(error) {
	Ti.API.info('Error');
};

var getParams = {
	username : username,
	secret_token : Ti.App.Properties.getString('secret_token', '')
};
getReq.open("GET", network.baseurl + '/game/');
getReq.send(getParams);
