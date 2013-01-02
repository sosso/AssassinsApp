function GameMakerWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor : 'black',
		windowSoftInputMode : Ti.UI.Android.SOFT_INPUT_ADJUST_PAN,
		orientationModes : [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT]
	});

	var scrollView = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		top : 0,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		windowSoftInputMode : Ti.UI.Android.SOFT_INPUT_ADJUST_PAN
	});
	self.add(scrollView);

	var friendlyName = Titanium.UI.createTextField({
		color : '#336699',
		center : {
			x : '50%',
			y : ' 5%'
		},
		width : '80%',
		height : '10%',
		hintText : 'Game description',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	scrollView.add(friendlyName);

	var startingMoney = Titanium.UI.createTextField({
		color : '#336699',
		center : {
			x : '50%',
			y : '15%'
		},
		width : '80%',
		height : '10%',
		hintText : 'Starting money (1-10)',
		keyboardType : Titanium.UI.KEYBOARD_NUMBER_PAD,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	scrollView.add(startingMoney);

	var password1 = Titanium.UI.createTextField({
		color : '#336699',
		width : '80%',
		center : {
			x : '50%',
			y : '30%'
		},
		height : '10%',
		hintText : 'Game password',
		passwordMask : true,
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	scrollView.add(password1);

	var createBtn = Titanium.UI.createButton({
		title : 'Create Game',
		width : '80%',
		height : '10%',
		center : {
			x : '50%',
			y : '50%'
		},
		borderRadius : 1,
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	scrollView.add(createBtn);

	createBtn.addEventListener('click', function(e) {
		if (friendlyName.value !== '' && password1.value !== '') {
			var params = {
				friendly_name : friendlyName.value,
				game_password : password1.value,
				base_money : startingMoney.value,
				secret_token : Ti.App.Properties.getString('secret_token', ''),
				game_master_username : Ti.App.Properties.getString('username', '')
			};
			require('network/game_master_functions');
			Ti.App.fireEvent('network:game:creategame', params);
		} else {
			alert("All fields are required");
		}
	});

	Ti.App.addEventListener('network:game:creategame:success', function() {
		self.close();
	});

	return self;
};

module.exports = GameMakerWindow;
