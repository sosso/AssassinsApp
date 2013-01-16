function GameDetailWindow(gameData) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false,
		layout : 'vertical',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});
	var targetUsername, game_id;
	var scrollView = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		top : 0,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
	});
	self.add(scrollView);

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

	scrollView.add(Ti.UI.createLabel({
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
				Ti.App.fireEvent('app:showiOSLoadingIndicator', {
					message : 'Getting shot information. . .'
				});
				require('network/ShotViewer');
				Ti.App.fireEvent('network:game:shot:view', {
					shot_id : gameData.pending_shot
				});

				Ti.App.addEventListener('network:game:shot:view:success', function(shotInfo) {
					ShotViewWindow = require('ui/common/game/ShotViewWindow');
					if (self.tab) {
						self.tab.open(new ShotViewWindow(shotInfo));
					} else {
						self.containingTab.open(new ShotViewWindow(shotInfo));
					}
				});
			});
			scrollView.add(resolveShotButton);
		} else if (status == 'Alive' && gameData.started) {
			var getMissionButton = Ti.UI.createButton({
				title : 'Get current target',
				width : '100%',
				height : 'auto',
			});
			scrollView.add(getMissionButton);
			var currentMissionLabel = Ti.UI.createLabel({
				color : 'white',
				text : 'Click button to get current mission',
				width : '100%',
				height : 'auto',
				ellipsize : false
			});
			scrollView.add(currentMissionLabel);
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
			scrollView.add(targetImage);
			scrollView.add(shootTargetButton);

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
	} else {
		var resolveDisputeButton = Ti.UI.createButton({
			title : 'Confirm/reject disputes',
			width : '100%',
			height : 'auto',
		});

		require('network/DisputeViewer');

		resolveDisputeButton.addEventListener('click', function() {
			Ti.App.fireEvent('app:showiOSLoadingIndicator', {
				message : 'Getting dispute information. . .'
			});

			Ti.App.fireEvent('network:game:dispute:view', {
				game_id : gameData.game_id
			});

			Ti.App.addEventListener('network:game:dispute:view:success', function(disputeInfo) {
				DisputeListWindow = require('ui/common/game/DisputeListWindow');
				new DisputeListWindow(disputeInfo.disputes).open();
			});
		});
		scrollView.add(resolveDisputeButton);
	}

	return self;
}

module.exports = GameDetailWindow;
