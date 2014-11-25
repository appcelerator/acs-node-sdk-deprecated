var crypto = require('crypto'),
	testACSApp = null;

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

function overwriteLine(chunk) {
	if (process.stdout._type === 'tty') {
		process.stdout.clearLine();
		process.stdout.cursorTo(0);
		var lastLine = chunk.toString().replace(/\n*$/, '').match(/[^\n]*$/)[0];
		process.stdout.write(lastLine.substring(0, process.stdout.getWindowSize()[0]));
	}
}

function countdown(func, text, timeout) {
	var remaining = Math.floor(timeout / 1000);
	overwriteLine(text + remaining);
	var counter = setInterval(function() {
		remaining--;
		if (remaining <= 0) {
			clearInterval(counter);
		}
		overwriteLine(remaining ? text + remaining : '');
	}, 1000);
	setTimeout(func, timeout);
}

function processWait(acs, type, id, cb, interval, maxTries, i) {
	if (!i) {
		i = 0;
	}
	if (!maxTries) {
		maxTries = 10;
	}
	if (!interval) {
		interval = 2000;
	}

	var showMethod = type + 'sShow';
	if (type == 'photo') {
		acs[showMethod]({
			file_id: id,
			photo_id: id
		}, function(err, result) {
			i++;
			if (result && result.body && result.body.meta && result.body.response && result.body.meta.code == 200 && result.body.response[type + 's'][0].processed) {
				cb();
			} else if (i == maxTries) {
				cb(new Error('The ' + type + ' ' + id + ' was not processed'));
			} else {
				countdown(function() {
					processWait(acs, type, id, cb, interval, maxTries, i);
				}, 'Waiting for ' + type + ' to be processed. Attempted ' + i + '/' + maxTries + ' - ', interval);
			}
		});
	}
}

function getTestACSApp() {
	if (!testACSApp) {
		var acsKey = process.env.ACS_APPKEY;
		var acsEntryPoint = (process.env.ACS_ENTRYPOINT ? process.env.ACS_ENTRYPOINT : 'https://api.cloud.appcelerator.com');
		if (!acsKey) {
			console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
			process.exit(1);
		}
		console.log('ACS Entry Point: %s', acsEntryPoint);
		console.log('MD5 of ACS_APPKEY: %s', md5(acsKey));

		testACSApp = require('../index')(acsKey, {
			apiEntryPoint: acsEntryPoint,
			prettyJson: true
		});
	}
	return testACSApp;
}

module.exports.generateUsername = generateUsername;
module.exports.md5 = md5;
module.exports.processWait = processWait;
module.exports.getTestACSApp = getTestACSApp;
