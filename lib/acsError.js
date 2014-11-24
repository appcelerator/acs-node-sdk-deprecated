// Error handler class

var util = require('util'),
	_ = require('lodash');
const ACS_ERROR_NAME = 'ACS Node SDK Error';

var ACSError = function(errorEntry, parameters) {
	Error.captureStackTrace(this);
	this.errorCode = errorEntry.errorCode || 0;
	this.docUrl = errorEntry.docUrl || null;
	this.message = _.clone(errorEntry.message || ACS_ERROR_NAME);
	for (var parameter in parameters) {
		this.message = this.message.replace('%' + parameter + '%', parameters[parameter]);
	}
};
util.inherits(ACSError, Error);
ACSError.prototype.name = ACS_ERROR_NAME;
module.exports = ACSError;
