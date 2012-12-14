function ApplicationTabGroup(Window) {
	//create module instance
	LoginCreateAccountChoose = require('ui/common/LoginCreateAccountChoose');
	AccountMakerWindow = require('ui/common/AccountMakerWindow');
	LoginWindow = require('ui/common/LoginWindow');
	GameCreatorWindow = require('ui/common/GameMakerWindow');
	var self = Ti.UI.createTabGroup();

	//create app tabs
	var win1 = new LoginCreateAccountChoose();
	var win2 = new GameCreatorWindow();
	// var win2 = new LoginWindow();
	// var win2 = new AccountMakerWindow();
	//Window(L('home'));

	var tab2 = Ti.UI.createTab({
		title : L('home'),
		icon : '/images/KS_nav_views.png',
		window : win2
	});
	win2.containingTab = tab1;

	var tab1 = Ti.UI.createTab({
		title : L('settings'),
		icon : '/images/KS_nav_ui.png',
		window : win1
	});
	win1.containingTab = tab2;

	self.addTab(tab2);
	self.addTab(tab1);

	return self;
};

module.exports = ApplicationTabGroup;
