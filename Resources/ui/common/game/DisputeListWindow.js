function DisputeStatusView(dispute) {
	disputeData = {
		claim : dispute.dispute.claim,
		dispute_id : dispute.dispute.id,
		confirmation_expiration : dispute.dispute.confirmation_expiration,
		timestamp : dispute.dispute.timestamp,
		shot : dispute.shot
	};
	var view = Ti.UI.createTableViewRow({
		className : 'DisputeStatus',
		touchEnabled : true,
		// height : '100%',
		// width : '100%',		data : disputeData,
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
		text : disputeData.claim,
		left : 0,
		width : '90%',
		height : 'auto',
		ellipsize : true,
		bubbleParent : true
	}));

	view.add(Ti.UI.createImageView({
		image : '/images/arrow.png',
		width : '10%',
		height : 'auto',
		bubbleParent : true
	}));

	return view;
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
	DisputeDetailWindow = require('ui/common/game/DisputeDetailWindow');
	tableview.addEventListener('click', function(e) {
		if (e.source.bubbleParent && e.row.hasDetail) {//ignore presses on the button

			new DisputeDetailWindow(e.row.data).open();
		}
	});

	self.add(tableview);
	return self;
};

module.exports = DisputeListWindow;
