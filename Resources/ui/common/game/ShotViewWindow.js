ShotViewWindow = function(shotInfo) {
	var self = Titanium.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT],
		layout : 'vertical'
	});

	var shotPicture = Ti.UI.createImageView({
		image : shotInfo.shot.shot_picture,
		height : '80%',
		width : 'auto'
	});
	self.add(shotPicture);

	var buttonWrapper = Ti.UI.createView({
		backgroundColor : 'black',
		width : '100%',
		height : '20%',
		layout : 'horizontal'
	});
	self.add(buttonWrapper);

	var disputeButton = Titanium.UI.createButton({
		title : 'Dispute Kill',
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

	disputeButton.addEventListener('click', function() {
		DisputeWindow = require('ui/common/game/DisputeWindow');
		if (self.tab) {
			self.tab.open(new DisputeWindow(shotInfo.shot.shot_id));
		} else {
			self.containingTab.open(new DisputeWindow(shotInfo.shot.shot_id));
		}
	});

	confirmButton.addEventListener('click', function() {
		Ti.App.fireEvent('network:game:shot:decide', {
			shot_id : shotInfo.shot.shot_id,
			shot_upheld : 'True',
			claim : 'Good shot!'
		});
	});

	Ti.App.addEventListener('network:game:shot:decide:success', function() {
		Ti.App.fireEvent('ui:toast', {
			message : 'Kill confirmed.'
		});
		self.close();
	});

	Ti.App.addEventListener('network:game:shot:decide:failure', function() {
		Ti.App.fireEvent('ui:toast', {
			message : 'Confirmation failed.  Please try again.'
		});
	});

	return self;
};

module.exports = ShotViewWindow;
