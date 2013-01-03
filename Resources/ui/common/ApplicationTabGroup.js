function ApplicationTabGroup(Window) {
	//create module instance
	LoginCreateAccountChoose = require('ui/common/LoginCreateAccountChoose');
	AccountMakerWindow = require('ui/common/account/AccountMakerWindow');
	LoadingIndicator = require('ui/common/LoadingIndicator');
	Toast = require('ui/common/Toast');
	var loadingIndicator = new LoadingIndicator();

	LoginWindow = require('ui/common/account/LoginWindow');
	GameMenuWindow = require('ui/common/GameMenuWindow');
	var self = Ti.UI.createTabGroup();

	//create app tabs
	var win1 = new LoginCreateAccountChoose();
	var win2 = new GameMenuWindow();
	// var win2 = new LoginWindow();
	// var win2 = new AccountMakerWindow();
	//Window(L('home'));

	var tab2 = Ti.UI.createTab({
		title : 'Game Menu',
		icon : '/images/KS_nav_views.png',
		window : win2
	});
	win1.containingTab = tab2;
	loadingIndicator.tab = tab2;

	var tab1 = Ti.UI.createTab({
		title : 'Account',
		icon : '/images/KS_nav_ui.png',
		window : win1
	});
	win2.containingTab = tab1;

	//If they're already logged in, start them on the game screen.'
	if (Ti.App.Properties.getString('username', '') != '' && Ti.App.Properties.getString('secret_token', '') != '') {
		self.addTab(tab2);
		self.addTab(tab1);
	} else {
		self.addTab(tab1);
		self.addTab(tab2);
	}

	return self;
};

module.exports = ApplicationTabGroup;
