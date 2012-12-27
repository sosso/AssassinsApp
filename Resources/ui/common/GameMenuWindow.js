function GameMenuWindow(title) {
	GameListWindow = require('ui/common/game/GameListWindow');
	var self = Ti.UI.createWindow({
		title : title,
		backgroundColor : 'white',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});

	var gameListButton = Ti.UI.createButton({
		height : 44,
		width : 200,
		title : 'View my games',
		top : 124
	});
	self.add(gameListButton);

	gameListButton.addEventListener('click', function() {
		Ti.App.fireEvent('app:showiOSLoadingIndicator', {
			reason : 'Fetching your games. . .'
		});
		require('network/game_membership_functions');
		Ti.App.fireEvent('network:game:getall');
	});

	Ti.App.addEventListener('network:game:getall:success', function(gamesJSON) {
		var gw = new GameListWindow(gamesJSON.games);
		self.tab.open(gw);
	});

	var gameJoinButton = Ti.UI.createButton({
		height : 44,
		width : 200,
		title : 'Join game',
		top : 164
	});
	self.add(gameJoinButton);

	gameJoinButton.addEventListener('click', function() {
		JoinGameWindow = require('ui/common/game/joingame');
		self.containingTab.open(new JoinGameWindow());
	});
	var gameCreateButton = Ti.UI.createButton({
		height : 44,
		width : 200,
		title : 'Create game',
		top : 204
	});
	self.add(gameCreateButton);

	gameCreateButton.addEventListener('click', function() {
		GameMakerWindow = require('ui/common/GameMakerWindow');
		self.containingTab.open(new GameMakerWindow());
	});

	return self;
};

module.exports = GameMenuWindow;
