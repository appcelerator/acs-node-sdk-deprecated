var acs = require('../lib/acs');

var sdk = acs.createACSSDK('');
//var sdk = acs.createACSSDK('', '');
//var sdk = acs.createACSSDK('', '', '');

var login = {
		"login": "test",
		"password": "test"
	};

	var data = {
			"firstName": "Steve",
			"lastname": "Jobs",
			"phone": {
				"work": "123-456-7890",
				"mobile": "098-765-4321",
				"home": "111-222-3333"
			}
		};
		
	console.log("Login");
	sdk.sendRequest('users/login.json', 'POST', login, function(e){
		console.log(e);
		console.log("Sending REST Create");
		sdk.sendRequest('objects/Provider/create.json', 
			'POST',
			{fields: JSON.stringify(data)}, 
			callback);
	});
			


	function callback(data) {
		console.log("Entering sendRequest callback");
		console.log(data);
		if (data) {
			if (data.meta) {
				var meta = data.meta;
				if (meta.status == 'ok' && meta.code == 200 && meta.method_name == 'createObject') {
					console.log("Hell Ya!")
				}
			}
		}
	}