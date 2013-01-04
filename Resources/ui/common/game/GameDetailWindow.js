function GameDetailWindow(gameData) {

	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false,
		layout : 'vertical',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	var targetUsername, game_id;

	var gameStatus = 'Game title: ' + gameData.title + '\n';
	gameStatus += 'Game ID: ' + gameData.game_id + '\n';
	gameStatus += 'Game password: ' + gameData.game_password + '\n';

	var status;
	if (gameData.isGameMaster) {
		status = 'N/A';
	} else if (gameData.alive == true) {
		status = 'Alive';
	} else if (gameData.alive == false) {
		status = 'Dead';
	} else {
		status = 'Shot!';
	}
	gameStatus += 'Alive/dead/shot: ' + status + '\n';

	gameStatus += 'Game started: ' + gameData.started + '\n';
	gameStatus += 'Game completed: ' + gameData.completed + '\n';
	gameStatus += 'Player or Game Master: ' + (gameData.isGameMaster ? 'Game Master' : 'Player') + '\n';

	self.add(Ti.UI.createLabel({
		color : 'white',
		text : gameStatus,
		width : '100%',
		height : 'auto',
		ellipsize : false
	}));

	if (!gameData.isGameMaster) {
		if (status == 'Shot!') {
			var resolveShotButton = Ti.UI.createButton({
				title : 'Confirm/dispute that you were shot and killed',
				width : '100%',
				height : 'auto',
			});

			resolveShotButton.addEventListener('click', function() {
				alert('resolving shot');
			});
			self.add(resolveShotButton);
		} else {
			var getMissionButton = Ti.UI.createButton({
				title : 'Get current target',
				width : '100%',
				height : 'auto',
			});
			self.add(getMissionButton);
			var currentMissionLabel = Ti.UI.createLabel({
				color : 'white',
				text : 'Click button to get current mission',
				width : '100%',
				height : 'auto',
				ellipsize : false
			});
			self.add(currentMissionLabel);
			getMissionButton.addEventListener('click', function() {
				Ti.App.fireEvent('app:showiOSLoadingIndicator', {
					message : 'Getting your mission. . .'
				});
				require('network/GameMissionFunctions');
				currentMissionLabel.text = 'Loading. . .';
				Ti.App.fireEvent('network:game:viewmission', {
					game_id : gameData.game_id
				});
			});
			var targetImage = Ti.UI.createImageView({
				height : '35%',
				width : 'auto',
				image : '',
				backgroundColor : 'black',
				visible : false
			});

			var shootTargetButton = Ti.UI.createButton({
				title : 'Assassinate target',
				visible : false
			});

			shootTargetButton.addEventListener('click', function() {
				require('ui/common/game/AssassinateWindow');
				Ti.App.fireEvent('ui:assassinate', {
					target_username : target_username,
					game_id : gameData.game_id
				});
			});
			self.add(targetImage);
			self.add(shootTargetButton);

			Ti.App.addEventListener('network:game:viewmission:success', function(missionInfo) {
				text = 'Username: ' + missionInfo.mission.target_username + '\n';
				text += 'Date assigned: ' + missionInfo.mission.assigned + '\n';
				text += 'Date completed: ' + (missionInfo.mission.completed ? missionInfo.mission.completed : 'Not yet completed') + '\n';
				text += 'Target profile picture: ';
				if (!missionInfo.mission.completed) {
					shootTargetButton.visible = true;
				}
				targetImage.visible = true;
				currentMissionLabel.text = text;
				target_username = missionInfo.mission.target_username;
				game_id = missionInfo.mission.game_id;
				targetImage.image = missionInfo.mission.profile_picture;
			});

			Ti.App.addEventListener('network:game:viewmission:failure', function(missionInfo) {
				target_username = null;
				game_id = null;
				shootTargetButton.visible = false;
				targetImage.visible = false;
				currentMissionLabel.text = 'Failed to load mission information.  Try again?';
			});
		}

	}

	return self;
}

function GameListWindow(gamesJSON) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false
	});
	var data = [];
	for (var i = 0, len = gamesJSON.length; i < len; i++) {
		data.push(new GameStatusView(gamesJSON[i]));
	}
	// create table view
	var tableview = Titanium.UI.createTableView({
		data : data
	});

	tableview.addEventListener('click', function(e) {
		if (e.row.hasDetail) {
			GameDetailWindow = require('ui/common/game/GameDetailWindow');
			new GameDetailWindow(e.row.data).open();
		}
	});

	self.add(tableview);
	return self;
};

module.exports = GameDetailWindow;
