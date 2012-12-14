LoginWindow = function() {
	var self = Titanium.UI.createWindow({
		backgroundColor : 'black',
		exitOnClose : false
	});

	Ti.App.addEventListener('app:authTokenLoginSuccess', function() {
		self.close();
	});
	var username = Titanium.UI.createTextField({
		color : '#336699',
		center : {
			x : '50%',
			y : '5%'
		},
		width : '80%',
		height : '10%',
		hintText : 'Username',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocorrect : false
	});
	self.add(username);

	self.addEventListener('open', function() {//try to auth them first
		if (Ti.App.Properties.getString('newFEOToken', '') !== '') {
			Ti.App.fireEvent('network:account:login', {
				params : {
					username : username.value,
					auth : Ti.App.Properties.getString('secret_token', ''),
					app_api : ($$.os === 'iphone' ? '462b76e5f4fda377b02bf993e4231cbd4a5047a9' : 'e2aae8ab04d3da646230badd7ac1fdecc4d67916'),
				}
			});
		}
	});

	var password = Titanium.UI.createTextField({
		color : '#336699',
		width : '80%',
		center : {
			x : '50%',
			y : '15%'
		},
		height : '10%',
		hintText : 'Password',
		passwordMask : true,
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocorrect : false
	});
	self.add(password);

	var loginBtn = Titanium.UI.createButton({
		title : 'Log in',
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

	var acctBtn = Titanium.UI.createButton({
		title : 'Create account',
		center : {
			x : '50%',
			y : '40%'
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
	self.add(acctBtn);
	acctBtn.addEventListener('click', function(e) {
		AccountMakerWindow = require('ui/common/AccountMakerWindow');
		new AccountMakerWindow().open();
	});

	loginBtn.addEventListener('click', function() {
		if (email.value != '' && password.value != '') {
			var params = {
				version : Ti.App.version,
				username : email.value,
				password : password.value,
				app_api : (Ti.Platform.osname === 'iphone' ? '462b76e5f4fda377b02bf993e4231cbd4a5047a9' : 'e2aae8ab04d3da646230badd7ac1fdecc4d67916'),
			};
			Ti.App.fireEvent('app:loginAttempt', {
				params : params
			});
		} else {
			alert("Email/Password are required");
		}
	});

	Ti.App.addEventListener('app:loginFailure', function() {
		alert('Login failed.  Please enter your email and password and try again.');
	});

	Ti.App.addEventListener('app:loginAttempt', function(e) {
		Ti.App.fireEvent('app:showiOSLoadingIndicator', {
			message : 'Logging you in. . .',
			reason : 'login attempt'
		});
		var loginReq = Titanium.Network.createHTTPClient();

		loginReq.open("GET", FEO.network.generateGetURL(FEO.app.api.apiBaseURL + 'auth/', e.params));
		loginReq.send();
	});

	return self;

};

module.exports = LoginWindow;
