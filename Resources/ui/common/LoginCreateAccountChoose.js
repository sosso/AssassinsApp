function ApplicationWindow(title) {
	AccountMakerWindow = require('ui/common/account/AccountMakerWindow');
	LoginWindow = require('ui/common/account/LoginWindow');
	var self = Ti.UI.createWindow({
		title : 'Account',
		backgroundColor : 'white',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});

	var loginButton = Ti.UI.createButton({
		height : 44,
		width : 200,
		title : 'Log in',
		top : 20
	});
	self.add(loginButton);

	loginButton.addEventListener('click', function() {
		if (self.tab) {
			self.tab.open(new LoginWindow());
		} else {
			self.containingTab.open(new LoginWindow());
		}
	});

	var accountCreatorButton = Ti.UI.createButton({
		height : 44,
		width : 200,
		title : 'Create Account',
		top : 84
	});
	self.add(accountCreatorButton);

	accountCreatorButton.addEventListener('click', function() {
		if (self.tab) {
			self.tab.open(new AccountMakerWindow());
		} else {
			self.containingTab.open(new AccountMakerWindow());
		}
	});

	return self;
};

module.exports = ApplicationWindow;
