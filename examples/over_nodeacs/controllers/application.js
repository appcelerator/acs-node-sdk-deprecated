var u = require('../lib/util');

var acsAppKey = u.getConfig().acs_appkey;
if (acsAppKey) {
	var acsApp = require('../../../index')(acsAppKey);
}

function index(req, res) {
	res.render('index', {
		hasACSAppKey: (acsAppKey ? true : false)
	});
}

function login(req, res) {
	acsApp.usersLogin({
		req: req,
		res: res
	}, function(err, result) {
		res.send(result.response.statusCode, result.body);
	});
}

function showMe(req, res) {
	acsApp.usersShowMe({
		req: req,
		res: res
	}, function(err, result) {
		res.send(result.response.statusCode, result.body);
	});
}
