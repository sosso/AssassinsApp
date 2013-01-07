

function GameStatusView(game) {
	gameData = {
		title : game.game_friendly_name,
		game_id : game.game_id,
		game_password : game.game_password,
		alive : game.alive,
		started : game.started,
		completed : game.completed,
		isGameMaster : game.is_game_master,
		pending_shot : game.pending_shot
	};
	var view = Ti.UI.createTableViewRow({
		className : 'GameStatus',
		touchEnabled : true,
		// height : '100%',
		// width : '100%',		data : gameData,
		layout : 'horizontal',
		backgroundColor : 'black',
		hasDetail : true,
		bubbleParent : true,
		height : Ti.UI.SIZE
	});
	view.add(Ti.UI.createView({
		backgroundColor : 'black',
		width : 0,
		height : '30%'
	}));
	view.add(Ti.UI.createLabel({
		color : 'white',
		text : gameData.title,
		left : 0,
		width : '40%',
		height : 'auto',
		ellipsize : true,
		bubbleParent : true
	}));
	var color, status;
	if (gameData.alive == true) {
		color = 'green';
		status = 'Alive';
	} else if (gameData.alive == false) {
		color = 'red';
		status = 'Dead';
	} else {
		color = 'orange';
		status = 'Shot!';
	}
	var playerLabel = Ti.UI.createLabel({
		color : color,
		text : status,
		width : '25%',
		height : 'auto',
		ellipsize : true,
		bubbleParent : true
	});
	view.add(playerLabel);

	if (!gameData.started) {
		playerLabel.text = 'Not started';
		playerLabel.color = 'pink';
	}
	if (gameData.isGameMaster) {
		playerLabel.color = 'yellow';
		playerLabel.text = 'Game Master';

		var startGameButton = Ti.UI.createButton({
			width : '25%',
			height : Ti.UI.FILL,
			title : 'Start Game',
			bubbleParent : false
		});

		Ti.App.addEventListener('network:game:start:success' + gameData.game_id, function() {
			view.remove(startGameButton);
		});
		if (gameData.started) {
			startGameButton.enabled = false;
			startGameButton.title = 'Started';
		}

		startGameButton.addEventListener('click', function() {
			require('network/game_master_functions');
			Ti.App.fireEvent('network:game:start', {
				game_id : gameData.game_id
			});
		});
		view.add(startGameButton);
	}

	view.add(Ti.UI.createImageView({
		image : '/images/arrow.png',
		width : '10%',
		height : 'auto',
		bubbleParent : true
	}));

	Ti.App.addEventListener('network:game:start:failure' + gameData.game_id, function(e) {
		alert(e.reason);
	});

	return view;
}

function WTF(title) {
	return Ti.UI.createWindow({
		backgroundColor : 'white'
	});
}

function GameListWindow(gamesJSON) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false
	});
	var data = [];
	for (var i = 0, len = gamesJSON.length; i < len; i++) {
		data.push(GameStatusView(gamesJSON[i]));
	}
	// create table view
	var tableview = Titanium.UI.createTableView({
		data : data
	});
	
	var GameDetailWindow = require('ui/common/game/GameDetailWindow');
	tableview.addEventListener('click', function(e) {
		if (e.source.bubbleParent && e.row.hasDetail) {//ignore presses on the button
			var mywin = GameDetailWindow(e.row.data);
			mywin.open();
		}
	});

	self.add(tableview);
	return self;
}

module.exports = GameListWindow;

