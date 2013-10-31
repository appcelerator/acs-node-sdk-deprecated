// stub out simple Titanium based APIs that we want to support server side

exports.App  = require('./app.js');
exports.API  = require('./api.js');
exports.Platform = require('./platform.js');
exports.Network = require('./network.js');



exports.setService = function(s)
{
	for (var k in exports)
	{
		var fn = exports[k].setService;
		if (typeof (fn) == 'function')
		{
			fn(s);
		}
	}
}