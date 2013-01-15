exports.baseurl = 'http://10.0.2.2:5002';
exports.getURL = function(obj) {
	var str = [];
	for (var p in obj) {
		str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	}
	return str.join("&");
};
