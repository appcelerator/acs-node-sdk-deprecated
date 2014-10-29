var util = require('util');
const ACS_ERROR_NAME = 'ACS Node SDK Error';

var ACSError = function(errorEntry, parameters) {
	Error.captureStackTrace(this);
	this.errorCode = errorEntry.errorCode || 0;
	this.docUrl = errorEntry.docUrl || null;
	for (var parameter in parameters) {
		errorEntry.message = errorEntry.message.replace('%' + parameter + '%', parameters[parameter]);
	}
	this.message = errorEntry.message || ACS_ERROR_NAME;
};
util.inherits(ACSError, Error);
ACSError.prototype.name = ACS_ERROR_NAME;
module.exports = ACSError;
