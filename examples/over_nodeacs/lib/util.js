var path = require('path');
var fs = require('fs');

var config = null;

var getConfig = function() {
	if (config) {
		return config;
	}
	var configFile = path.join(__dirname, '..', 'config.json');
	config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	return config;
}
module.exports.getConfig = getConfig;

exports = module.exports;
