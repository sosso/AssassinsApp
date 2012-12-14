JoinGameWindow = function() {
	var self = Titanium.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false
	});

	Ti.App.addEventListener('app:authTokenLoginSuccess', function() {
		self.close();
	});
	var gameid = Titanium.UI.createTextField({
		color : '#336699',
		center : {
			x : '50%',
			y : '5%'
		},
		width : '80%',
		height : '10%',
		hintText : 'Game ID',
		keyboardType : Titanium.UI.KEYBOARD_NUMBER_PAD,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocorrect : false
	});
	self.add(gameid);

	var password = Titanium.UI.createTextField({
		color : '#336699',
		width : '80%',
		center : {
			x : '50%',
			y : '15%'
		},
		height : '10%',
		hintText : 'Game Password',
		passwordMask : true,
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocorrect : false
	});
	self.add(password);

	var loginBtn = Titanium.UI.createButton({
		title : 'Join game',
		center : {
			x : '50%',
			y : '50%'
		},
		width : '80%',
		height : '10%',
		borderRadius : 1,
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	self.add(loginBtn);

	loginBtn.addEventListener('click', function() {
		if (gameid.value != '' && password.value != '') {
			var params = {
				game_id : gameid.value,
				game_password : password.value
			};
			Ti.App.fireEvent('network:game:join', {
				params : params
			});
		} else {
			alert("Game ID/Game Password are required");
		}
	});

	Ti.App.addEventListener('network:game:join:failure', function() {
		alert('Login failed.  Please enter your email and password and try again.');
	});

	return self;

};

module.exports = JoinGameWindow;
