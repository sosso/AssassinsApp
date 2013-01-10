function GameMenuWindow(title) {
	GameListWindow = require('ui/common/game/GameListWindow');
	var ButtonStyle = require('ui/styles/Styles').ButtonStyle;
	var self = Ti.UI.createWindow({
		title : title,
		backgroundColor : 'white',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT],
		layout : 'vertical'
	});

	var gameListButton = Ti.UI.createButton({
		height : ButtonStyle.buttonHeight,
		width : ButtonStyle.buttonWidth,
		title : 'View my games',
		top : ButtonStyle.buttonSpacing
	});
	self.add(gameListButton);

	gameListButton.addEventListener('click', function() {
		require('network/game_membership_functions');
		Ti.App.fireEvent('network:game:getall');
	});

	Ti.App.addEventListener('network:game:getall:success', function(gamesJSON) {
		var gw = new GameListWindow(gamesJSON.games);
		if (self.tab) {
			self.tab.open(gw);
		} else {
			self.containingTab.open(gw);
		}

	});

	var gameJoinButton = Ti.UI.createButton({
		height : ButtonStyle.buttonHeight,
		width : ButtonStyle.buttonWidth,
		title : 'Join game',
		top : ButtonStyle.buttonSpacing
	});
	self.add(gameJoinButton);

	gameJoinButton.addEventListener('click', function() {
		JoinGameWindow = require('ui/common/game/JoinGameWindow');
		self.containingTab.open(new JoinGameWindow());
	});
	var gameCreateButton = Ti.UI.createButton({
		height : ButtonStyle.buttonHeight,
		width : ButtonStyle.buttonWidth,
		title : 'Create game',
		top : ButtonStyle.buttonSpacing
	});
	self.add(gameCreateButton);

	gameCreateButton.addEventListener('click', function() {
		GameMakerWindow = require('ui/common/game/GameMakerWindow');
		self.containingTab.open(new GameMakerWindow());
	});

	return self;
}

module.exports = GameMenuWindow;
