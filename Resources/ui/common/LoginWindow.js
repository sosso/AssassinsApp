LoginWindow = function() {
	var self = Titanium.UI.createWindow({
		backgroundColor : 'black'
	});

	var headerView = Ti.UI.createView({
		top : 10,
		backgroundColor : 'black'
	});

	Ti.Gesture.addEventListener('orientationchange', function(e) {
		if (e.orientation === Ti.UI.PORTRAIT || e.orientation === Ti.UI.UPSIDE_PORTRAIT) {
			image.left = FEO.os({
				iphone : -10,
				ipad : 35
			});
			image.top = 0;
		} else if (e.orientation === Ti.UI.LANDSCAPE_LEFT || e.orientation === Ti.UI.LANDSCAPE_RIGHT) {
			image.left = FEO.os({
				iphone : 20,
				ipad : -30
			});
			image.top = 5;
			//15;
		}
	});

	self.add(headerView);
	self.addEventListener('open', function() {//try to auth them first
		if (Ti.App.Properties.getString('newFEOToken', '') !== '') {
			Ti.App.fireEvent('app:loginAttempt', {
				params : {
					version : Ti.App.version,
					auth : Ti.App.Properties.getString('newFEOToken', ''),
					app_api : ($$.os === 'iphone' ? '462b76e5f4fda377b02bf993e4231cbd4a5047a9' : 'e2aae8ab04d3da646230badd7ac1fdecc4d67916'),
				}
			});
		}
	});

	Ti.App.addEventListener('app:authTokenLoginSuccess', function() {
		self.close();
	});
	var email = Titanium.UI.createTextField({
		color : '#336699',
		top : '25%',
		left : 10,
		width : 300,
		height : 40,
		hintText : 'E-mail address',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocorrect : false
	});
	self.add(email);

	var password = Titanium.UI.createTextField({
		color : '#336699',
		top : '30%',
		left : 10,
		width : 300,
		height : 40,
		hintText : 'Password',
		passwordMask : true,
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
		autocorrect : false
	});
	self.add(password);

	var loginBtn = Titanium.UI.createButton({
		title : 'Login',
		top : '35%',
		width : 90,
		height : 35,
		borderRadius : 1,
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	self.add(loginBtn);

	var acctBtn = Titanium.UI.createButton({
		title : 'Register',
		top : '50%',
		width : 90,
		height : 35,
		borderRadius : 1,
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	self.add(acctBtn);
	acctBtn.addEventListener('click', function(e) {
		FEO.ui.createFEOAcctMakerWindow().open();
	});

	loginBtn.addEventListener('click', function(e) {
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
		loginReq.onload = function() {
			Ti.App.fireEvent('app:hideiOSLoadingIndicator');
			var json = this.responseText;
			try {
				var response = JSON.parse(json);
				if (!response.errorcode && response.auth) {
					Ti.App.fireEvent('app:authTokenLoginSuccess');
					Ti.App.Properties.setString('newFEOToken', response.auth);
				} else {
					Ti.App.fireEvent('app:loginFailure', {
						response : this.responseText
					});
				}
			} catch(exception) {
				FEO.error('Failed to parse auth json');
			}

		};
		loginReq.onerror = function() {
			Ti.App.fireEvent('app:hideiOSLoadingIndicator');
			Ti.App.fireEvent('app:authTokenLoginFailure', {
				response : this.responseText
			});
		};
		loginReq.open("GET", FEO.network.generateGetURL(FEO.app.api.apiBaseURL + 'auth/', e.params));
		loginReq.send();
	});

	return self;

};

module.exports = LoginWindow;
