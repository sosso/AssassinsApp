var masterLogBool = true;
var errorBool = true;
var debugBool = true;
var infoBool = true;
var devBool = true;

exports.error = function(message) {
	if (masterLogBool && errorBool) {
		Ti.API.error('\t\t' + (new Date().getTime()) + '[error] ' + message);
	}
};

exports.info = function(message) {
	if (masterLogBool && infoBool) {
		Ti.API.info('\t\t' + (new Date().getTime()) + '[info] ' + message);
	}
};

exports.debug = function(message) {
	if (masterLogBool && debugBool) {
		Ti.API.debug('\t\t' + (new Date().getTime()) + '[debug] ' + message);
	}
};
