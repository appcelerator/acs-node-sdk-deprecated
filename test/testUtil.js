var crypto = require('crypto');

var generateUsername = function(callback) {
	crypto.randomBytes(5, function(ex, buf) {
		var acsUsername = 'acsuser_' + buf.toString('hex');
		return callback ? callback(acsUsername) : null;
	});
};
var md5 = function(originalString) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(originalString);
	return md5sum.digest('hex');
};

module.exports.generateUsername = generateUsername;
module.exports.md5 = md5;
