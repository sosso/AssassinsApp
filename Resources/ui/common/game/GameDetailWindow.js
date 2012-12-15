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
		layout : 'vertical'
	});

	var gameStatus = 'Game title: ' + gameData.title + '\n';
	gameStatus += 'Game ID: ' + gameData.game_id + '\n';
	gameStatus += 'Game password: ' + gameData.game_password + '\n';
	gameStatus += 'Alive/dead: ' + (gameData.alive ? 'Alive' : 'Dead') + '\n';
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
