function ApplicationWindow(title) {
	AccountMakerWindow = require('ui/common/AccountMakerWindow');
	LoginWindow = require('ui/common/LoginWindow');

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

	return self;
};

module.exports = ApplicationWindow;
