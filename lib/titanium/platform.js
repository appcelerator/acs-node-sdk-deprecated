var u = require('../util/util.js'),
	uuid = require("node-uuid")
;

exports.id = u.getMacAddress;	//FIXME: this is async
exports.createUUID = uuid.v4;
