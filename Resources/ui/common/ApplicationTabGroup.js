function ApplicationTabGroup(Window) {
	//create module instance
	LoginCreateAccountChoose = require('ui/common/LoginCreateAccountChoose');
	AccountMakerWindow = require('ui/common/AccountMakerWindow');
	LoadingIndicator = require('ui/common/LoadingIndicator');
	var loadingIndicator = new LoadingIndicator();

	LoginWindow = require('ui/common/LoginWindow');
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

	self.addTab(tab1);
	self.addTab(tab2);
	return self;
};

module.exports = ApplicationTabGroup;
