function AccountMakerWindow() {
	var self = Titanium.UI.createWindow({
		backgroundColor : 'black'
	});

	var scrollView = Titanium.UI.createScrollView({
		contentWidth : 'auto',
		contentHeight : 'auto',
		top : 0,
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false
	});
	self.add(scrollView);

	var email = Titanium.UI.createTextField({
		color : '#336699',
		center : {
			x : '50%',
			y : ' 5%'
		},
		width : '80%',
		height : '15%',
		hintText : 'Username',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	scrollView.add(email);

	var password1 = Titanium.UI.createTextField({
		color : '#336699',
		width : '80%',
		center : {
			x : '50%',
			y : '30%'
		},
		height : '15%',
		hintText : 'Password',
		passwordMask : true,
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	scrollView.add(password1);

	var password2 = Titanium.UI.createTextField({
		color : '#336699',
		width : '80%',
		center : {
			x : '50%',
			y : '50%'
		},
		height : '15%',
		hintText : 'Password Again',
		passwordMask : true,
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	scrollView.add(password2);

	var createBtn = Titanium.UI.createButton({
		title : 'Create Account',
		top : '80%',
		width : '80%',
		height : '15%',
		borderRadius : 1,
		font : {
			fontFamily : 'Arial',
			fontWeight : 'bold',
			fontSize : 14
		}
	});
	scrollView.add(createBtn);

	function checkemail(emailAddress) {
		var testresults;
		var str = emailAddress;
		var filter = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if (filter.test(str)) {
			testresults = true;
		} else {
			testresults = false;
		}
		return (testresults);
	};

	var createReq = Titanium.Network.createHTTPClient();
	createReq.onload = function() {
		try {
			var json = this.responseText;
			var response = JSON.parse(json);
			if (!response.errorcode && response.auth) {
				Ti.App.fireEvent('app:accountCreationSuccess');
				Ti.App.Properties.setString('newFEOToken', response.auth);
				self.close();
			} else {
				Ti.App.fireEvent('app:accountCreationFailure', {
					response : this.responseText
				});
			}
		} catch(exception) {
			FEO.error('Error creating account');
		}
	};

	createBtn.addEventListener('click', function(e) {
		if (email.value !== '' && password1.value !== '' && password2.value !== '') {
			if (password1.value !== password2.value) {
				alert("Your passwords do not match");
			} else {
				if (!checkemail(email.value)) {
					alert("Please enter a valid email address");
				} else {
					createReq.open("POST", FEO.app.api.apiBaseURL + "auth/");
					var params = {
						app_api : ($$.os === 'iphone' ? '462b76e5f4fda377b02bf993e4231cbd4a5047a9' : 'e2aae8ab04d3da646230badd7ac1fdecc4d67916'),
						username : email.value,
						version : Ti.App.version,
						password : password1.value
					};
					createReq.send(params);
				}
			}
		} else {
			alert("All fields are required");
		}
	});

	return self;
};

module.exports = AccountMakerWindow;
