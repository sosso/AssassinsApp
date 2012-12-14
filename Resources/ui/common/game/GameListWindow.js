function GameStatusView(game) {
	gameData = {
		title : game.game_friendly_name,
		game_id : game.game_id,
		game_password : game.game_password,
	};
	gameData.alive = (game.alive == 'True');
	gameData.started = (game.started == 'True');
	gameData.completed = (game.completed == 'True');
	gameData.isGameMaster = (game.isGameMaster == 'True');
	var view = Ti.UI.createTableViewRow({
		className : 'GameStatus',
		touchEnabled : true,
		// height : '100%',
		// width : '100%',		data : gameData,
		layout : 'horizontal',
		backgroundColor : 'blue'
	});
	view.add(Ti.UI.createLabel({
		color : 'white',
		text : gameData.title,
		left : 0,
		width : '25%',
		height : 'auto',
		ellipsize : true
	}));
	if (gameData.isGameMaster) {
		var startGameButton = Ti.UI.createButton({
			width : '25%',
			height : '100%',
			title : 'Start Game'
		});
		if (gameData.started) {
			startGameButton.enabled = false;
		}

		startGameButton.addEventListener('click', function() {
			require('network/game_master_functions');
			Ti.App.fireEvent('network:game:start', {
				game_id : gameData.game_id
			});
		});

		view.add(startGameButton);
	}
	return view;
}

function GameListWindow(gamesJSON) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false
	});
	var data = [];
	for (var i = 0; i < gamesJSON.length; i++) {
		data.push(new GameStatusView(gamesJSON[i]));
	}
	// create table view
	var tableview = Titanium.UI.createTableView({
		data : data
	});
	self.add(tableview);
	return self;
};

module.exports = GameListWindow;
