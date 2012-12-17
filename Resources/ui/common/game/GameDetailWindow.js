function GameDetailWindow(gameData) {
	// gameData = {
	// title : game.game_friendly_name,
	// game_id : game.game_id,
	// game_password : game.game_password,
	// };
	// gameData.alive = (game.alive == 'True');
	// gameData.started = (game.started == 'True');
	// gameData.completed = (game.completed == 'True');
	// gameData.isGameMaster = game.is_game_master;

	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false,
		layout : 'vertical',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});

	var gameStatus = 'Game title: ' + gameData.title + '\n';
	gameStatus += 'Game ID: ' + gameData.game_id + '\n';
	gameStatus += 'Game password: ' + gameData.game_password + '\n';
	if(gameData.isGameMaster){
		gameStatus += 'Alive/dead: N/A\n';
	}else{
		gameStatus += 'Alive/dead: ' + (gameData.alive ? 'Alive' : 'Dead') + '\n';	
	}
	
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
	var getMissionButton = Ti.UI.createButton({
		title : 'Get current target',
		width : '100%',
		height : 'auto'
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
		backgroundColor : 'black'
	});
	self.add(targetImage);

	Ti.App.addEventListener('network:game:viewmission:success', function(missionInfo) {
		text = 'Username: ' + missionInfo.mission.target_username + '\n';
		text += 'Date assigned: ' + missionInfo.mission.assigned + '\n';
		text += 'Date completed: ' + (missionInfo.mission.completed ? missionInfo.mission.completed : 'Not yet completed') + '\n';
		text += 'Target profile picture: ';
		currentMissionLabel.text = text;
		targetImage.image = missionInfo.mission.profile_picture;
	});

	Ti.App.addEventListener('network:game:viewmission:failure', function(missionInfo) {
		currentMissionLabel.text = 'Failed to load mission information.  Try again?';
	});

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
