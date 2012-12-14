function ApplicationWindow(title) {
	AccountMakerWindow = require('ui/common/AccountMakerWindow');
	LoginWindow = require('ui/common/LoginWindow');
	GameListWindow = require('ui/common/game/GameListWindow');
	var self = Ti.UI.createWindow({
		title : title,
		backgroundColor : 'white'
	});

	var loginButton = Ti.UI.createButton({
		height : 44,
		width : 200,
		title : 'Log in',
		top : 20
	});
	self.add(loginButton);

	loginButton.addEventListener('click', function() {
		self.containingTab.open(new LoginWindow());
	});

	var accountCreatorButton = Ti.UI.createButton({
		height : 44,
		width : 200,
		title : 'Create Account',
		top : 84
	});
	self.add(accountCreatorButton);

	accountCreatorButton.addEventListener('click', function() {
		self.containingTab.open(new AccountMakerWindow());
	});

	var gameListButton = Ti.UI.createButton({
		height : 44,
		width : 200,
		title : 'View my games',
		top : 124
	});
	self.add(gameListButton);

	gameListButton.addEventListener('click', function() {
		require('network/game_membership_functions');
		Ti.App.fireEvent('network:game:getall');
	});

	Ti.App.addEventListener('network:game:getall:success', function(gamesJSON) {
		self.containingTab.open(new GameListWindow(gamesJSON.games));
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

	return self;
};

module.exports = ApplicationWindow;
