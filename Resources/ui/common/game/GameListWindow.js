function GameStatusView(game) {
	gameData = {
		title : game.game_friendly_name,
		game_id : game.game_id,
		game_password : game.game_password,
	};
	gameData.alive = (game.alive == 'True');
	gameData.started = (game.started == 'True');
	gameData.completed = (game.completed == 'True');
	gameData.isGameMaster = game.is_game_master;
	var view = Ti.UI.createTableViewRow({
		className : 'GameStatus',
		touchEnabled : true,
		// height : '100%',
		// width : '100%',		data : gameData,
		layout : 'horizontal',
		backgroundColor : 'black'
	});
	view.add(Ti.UI.createLabel({
		color : 'white',
		text : gameData.title,
		left : 0,
		width : '35%',
		height : 'auto',
		ellipsize : true
	}));
	var playerLabel = Ti.UI.createLabel({
		color : (gameData.alive ? 'green' : 'red'),
		text : (gameData.alive ? 'Alive' : 'Dead'),
		width : '35%',
		height : 'auto',
		ellipsize : true
	});
	view.add(playerLabel);

	if (!gameData.started) {
		playerLabel.text = 'Not started';
		playerLabel.color = 'orange';
	}
	Ti.App.addEventListener('network:game:start:success' + gameData.game_id, function() {
		view.remove(startGameButton);
	});
	Ti.App.addEventListener('network:game:start:failure' + gameData.game_id, function(e) {
		alert(e.reason);
	});

	if (gameData.isGameMaster) {
		playerLabel.color = 'yellow';
		playerLabel.text = 'Game Master';

		var startGameButton = Ti.UI.createButton({
			width : '30%',
			height : 'auto',
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
	for (var i = 0, len = gamesJSON.length; i < len; i++) {
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
