DisputeWindow = function(shot_id) {
	var self = Titanium.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT],
		layout : 'vertical'
	});

	var claim = Titanium.UI.createTextField({
		color : '#336699',
		width : '90%',
		height : '10%',
		hintText : 'Why is the kill invalid?',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocorrect : true
	});
	self.add(claim);

	var submitButton = Titanium.UI.createButton({
		title : 'Submit your dispute',
		width : '80%',
		height : '10%',
		top : '15%',
		borderRadius : 1,
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	self.add(submitButton);

	submitButton.addEventListener('click', function() {
		if (claim.value != '') {
			Ti.App.fireEvent('network:game:shot:decide', {
				shot_id : shot_id,
				shot_upheld : 'False',
				claim : claim.value
			});
		} else {
			Ti.App.fireEvent('ui:toast', {
				message : "You must give a reason why the shot is invalid."
			});
		}
	});

	Ti.App.addEventListener('network:game:shot:decide:failure', function() {
		Ti.App.fireEvent('ui:toast', {
			message : 'Submission failed.  Please try again.'
		});
	});

	Ti.App.addEventListener('network:game:shot:decide:success', function() {
		Ti.App.fireEvent('ui:toast', {
			message : 'Dispute submitted.'
		});
		self.close();
	});
	return self;

};

module.exports = DisputeWindow;
