Ti.App.addEventListener('ui:assassinate', function(missionInfo) {
	// myWin.add(reticuleOverlay);
	// myWin.open();
	takeShot(missionInfo);
});

function cameraError(error) {
	// called when there's an error
	var a = Titanium.UI.createAlertDialog({
		title : 'Camera'
	});
	if (error && error.code && error.code == Titanium.Media.NO_CAMERA) {
		a.setMessage('Please run this test on device');
	} else {
		a.setMessage('Unexpected error: ' + error.code);
	}
	a.show();
};

function takeShot(missionInfo) {
	var overlayView = Ti.UI.createView({
		height : '100%',
		width : '100%',
	});

	var shootButton = Ti.UI.createButton({
		touchEnabled : true,
		width : '100%',
		bottom : 0,
		zIndex : 2,
		height : '15%',
		title : 'Shoot',
		backgroundColor : 'black',
		color : 'white'
	});

	overlayView.add(shootButton);
	shootButton.addEventListener('click', function() {
		Ti.Media.takePicture();
	});

	var reticuleOverlay = Ti.UI.createImageView({
		width : '100%',
		touchEnabled : false,
		opacity : 0.8,
		image : '/images/reticule2.png'
	});

	overlayView.add(reticuleOverlay);

	Titanium.Media.showCamera({
		overlay : overlayView,
		saveToPhotoGallery : false,
		success : function(event) {
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
				var image = event.media;
				require('network/Assassinate');
				Ti.App.fireEvent('network:game:assassinate', {
					target_username : missionInfo.target_username,
					shot_picture : image,
					game_id : missionInfo.game_id
				});
			}
		},
		cancel : cameraError,
		error : cameraError,
		saveToPhotoGallery : false,
		allowEditing : false,
		mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
	});
};