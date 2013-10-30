var u = require('../util/util.js'),
	uuid = require("node-uuid"),
	fs = require('fs'),
	path = require('path')
;

var Properties = 
{
	getString: function(k, def)
	{
		var props = u.serviceConfig[exports.service.name];
		return props[k] || def;
	},
	setString: function(k,v)
	{
		//FIXME
	}
};


//exports.guid = u.getMacAddress;	//FIXME - this is async
exports.analytics = false;
exports.deployType = 'production'; //FIXME
exports.sessionId = uuid.v4();
exports.Properties = Properties;

exports.setService = function(s)
{
	exports.service = s;
}
