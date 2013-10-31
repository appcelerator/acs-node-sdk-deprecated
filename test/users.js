var acs = require('../lib/acs');

var sdk = acs.initACS('', '');

var user_id = null;
var filePath = "/Users/bill/2012-07.xls";
var photoPath = "/Users/bill/photo.JPG";
var useSecure = true;

sdk.sendRequest('users/create.json', 'POST', {username:'test1', password:'test1', password_confirmation:'test1'}, function(data){
	console.log(JSON.stringify(data, null, 2));
	user_id = data.response.users[0].id;
	
	sdk.sendRequest('files/create.json', 'POST', {name: 'abcd', file: filePath}, function(data){
		console.log(JSON.stringify(data, null, 2));
		
		sdk.sendRequest('users/logout.json', 'DELETE',null, function(data){
			console.log(JSON.stringify(data, null, 2));
			
			sdk.sendRequest('users/login.json', 'POST', {login:'test1', password:'test1'}, function(data){
				console.log(JSON.stringify(data, null, 2));
				
				sdk.sendRequest('photos/create.json', 'POST', {photo: photoPath}, function(data){
					console.log(JSON.stringify(data, null, 2));
					
					sdk.sendRequest('users/update.json', 'PUT', {first_name: 'abcd'}, function(data){
						console.log(JSON.stringify(data, null, 2));
						
						sdk.sendRequest('users/delete.json', 'DELETE', null, function(data){
							console.log(JSON.stringify(data, null, 2));
							
							sdk.sendRequest('users/show.json', 'GET', {'user_id': user_id}, function(data){
								console.log(JSON.stringify(data, null, 2));
								
							}, useSecure);
						}, useSecure);
					}, useSecure);
				}, useSecure);
			}, useSecure);
		}, useSecure);
	}, useSecure);
}, useSecure);


