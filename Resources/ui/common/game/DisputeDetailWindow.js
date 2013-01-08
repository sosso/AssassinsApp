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

	var buttonWrapper = Ti.UI.createView({
		backgroundColor : 'black',
		width : '100%',
		height : '20%',
		layout : 'horizontal'
	});
	self.add(buttonWrapper);

	var disputeButton = Titanium.UI.createButton({
		title : 'Reject Kill',
		width : '40%',
		left : '5%',
		right : '5%',
		bottom : '10%',
		borderRadius : 1,
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	buttonWrapper.add(disputeButton);

	var confirmButton = Titanium.UI.createButton({
		title : 'Confirm Kill',
		width : '40%',
		left : '5%',
		right : '5%',
		bottom : '10%',
		borderRadius : 1,
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	buttonWrapper.add(confirmButton);
	self.add(buttonWrapper);

	confirmButton.addEventListener('click', function() {
		Ti.App.fireEvent('network:game:dispute:decide', {
			dispute_id : disputeData.dispute_id,
			dispute_upheld : 'True',
			game_id:disputeData.game_id,
			gm_decision_reason : 'Good shot!'
		});
	});

	disputeButton.addEventListener('click', function() {
		Ti.App.fireEvent('network:game:dispute:decide', {
			dispute_id : disputeData.dispute_id,
			dispute_upheld : 'False',
			game_id:disputeData.game_id,
			gm_decision_reason : 'Kill invalid'
		});
	});

	Ti.App.addEventListener('network:game:dispute:decide:success', function() {
		Ti.App.fireEvent('ui:toast', {
			message : 'Decision submitted.'
		});
		self.close();
	});

	Ti.App.addEventListener('network:game:dispute:decide:failure', function() {
		Ti.App.fireEvent('ui:toast', {
			message : 'Confirmation failed.  Please try again.'
		});
	});

	return self;
}

module.exports = DisputeDetailWindow;
