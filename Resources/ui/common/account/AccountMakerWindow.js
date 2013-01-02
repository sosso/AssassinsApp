function AccountMakerWindow() {
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

	var username = Titanium.UI.createTextField({
		color : '#336699',
		center : {
			x : '50%',
			y : ' 5%'
		},
		width : '80%',
		height : '10%',
		hintText : 'Username',
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	scrollView.add(username);

	var email = Titanium.UI.createTextField({
		color : '#336699',
		center : {
			x : '50%',
			y : '15%'
		},
		width : '80%',
		height : '10%',
		hintText : 'Email address',
		keyboardType : Titanium.UI.KEYBOARD_EMAIL,
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
		height : '10%',
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
			y : '40%'
		},
		height : '10%',
		hintText : 'Confirm password',
		passwordMask : true,
		keyboardType : Titanium.UI.KEYBOARD_DEFAULT,
		returnKeyType : Titanium.UI.RETURNKEY_DEFAULT,
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	scrollView.add(password2);

	var createBtn = Titanium.UI.createButton({
		title : 'Create Account',
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

	var createReq = require('network/account');

	createBtn.addEventListener('click', function(e) {
		if (email.value !== '' && password1.value !== '' && password2.value !== '') {
			if (password1.value !== password2.value) {
				alert("Your passwords do not match");
			} else {
				if (!checkemail(email.value)) {
					alert("Please enter a valid email address");
				} else {
					var params = {
						username : username.value,
						email : email.value,
						password : password1.value
					};
					Ti.App.fireEvent('network:account:createuser', params);
				}
			}
		} else {
			alert("All fields are required");
		}
	});

	Ti.App.addEventListener('network:account:createuser:success', function() {
		self.close();
	});

	return self;
};

module.exports = AccountMakerWindow;
