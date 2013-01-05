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
		new DisputeWindow(shotInfo.shot.shot_id).open();
	});

	confirmButton.addEventListener('click', function() {
		Ti.App.fireEvent('network:game:shot:decide', {
			shot_id : shotInfo.shot.shot_id,
			shot_upheld : 'True',
			claim : 'Good shot!'
		});
	});

	Ti.App.addEventListener('network:game:join:failure', function() {
		alert('Join failed.  Please enter the game ID and password and try again.');
	});

	Ti.App.addEventListener('network:game:join:success', function() {
		self.close();
	});

	return self;
};

module.exports = ShotViewWindow;
