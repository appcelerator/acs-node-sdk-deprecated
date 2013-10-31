var _ = require('underscore')._,
	logger = require('../util/logger.js')
;

exports.info = logger.info;
exports.debug = logger.debug;
exports.trace = logger.debug;
exports.warn = logger.warn;
exports.error = logger.error;
exports.fatal = logger.error;
