function DisputeDetailWindow(disputeData) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false,
		layout : 'vertical',
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});

	var disputeStatus = 'Dispute ID: ' + disputeData.dispute_id + '\n';
	disputeStatus += 'Dispute confirmation deadline: ' + disputeData.confirmation_expiration + '\n';
	disputeStatus += 'Dispute created on: ' + disputeData.timestamp + '\n';
	disputeStatus += 'Dispute claim: ' + disputeData.claim + '\n';
	disputeStatus += 'Assassin: ' + disputeData.shot.assassin_username + '\n';
	disputeStatus += 'Target: ' + disputeData.shot.target_username + '\n';
	disputeStatus += 'Shot: ';

	self.add(Ti.UI.createLabel({
		color : 'white',
		text : disputeStatus,
		width : '100%',
		height : 'auto',
		ellipsize : false
	}));

	self.add(Ti.UI.createImageView({
		width : 'auto',
		height : '60%',
		image : disputeData.shot.shot_picture
	}));

	// if (status == 'Shot!') {
	// var resolveShotButton = Ti.UI.createButton({
	// title : 'Confirm/dispute that you were shot and killed',
	// width : '100%',
	// height : 'auto',
	// });
	//
	// resolveShotButton.addEventListener('click', function() {
	// Ti.App.fireEvent('app:showiOSLoadingIndicator', {
	// message : 'Getting shot information. . .'
	// });
	// require('network/ShotViewer');
	// Ti.App.fireEvent('network:dispute:shot:view', {
	// shot_id : disputeData.pending_shot
	// });
	//
	// Ti.App.addEventListener('network:dispute:shot:view:success', function(shotInfo) {
	// ShotViewWindow = require('ui/common/dispute/ShotViewWindow');
	// new ShotViewWindow(shotInfo).open();
	// });
	// });
	// self.add(resolveShotButton);
	//
	// }

	return self;
}

function DisputeListWindow(disputesJSON) {
	var self = Ti.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false
	});
	var data = [];
	for (var i = 0, len = disputesJSON.length; i < len; i++) {
		data.push(new DisputeStatusView(disputesJSON[i]));
	}
	// create table view
	var tableview = Titanium.UI.createTableView({
		data : data
	});

	tableview.addEventListener('click', function(e) {
		if (e.row.hasDetail) {
			DisputeDetailWindow = require('ui/common/dispute/DisputeDetailWindow');
			new DisputeDetailWindow(e.row.data).open();
		}
	});

	self.add(tableview);
	return self;
};

module.exports = DisputeDetailWindow;
