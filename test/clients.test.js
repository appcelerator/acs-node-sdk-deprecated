var assert = require('assert'),
	testUtil = require('./testUtil');

var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var acsApp = require('../index')(acsKey),
	acsUsername = null,
	acsPassword = 'cocoafish';

var timeout = 50000;

describe.skip('Clients Test', function() {
	this.timeout(timeout);

	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	before(function(done) {
		acsApp.usersCreate({
			username: acsUsername,
			password: acsPassword,
			password_confirmation: acsPassword
		}, function(err, result) {
			assert.ifError(err);
			assert(result.body);
			assert(result.body.meta);
			assert.equal(result.body.meta.code, 200);
			assert.equal(result.body.meta.method_name, 'createUser');
			assert(result.body.response);
			assert(result.body.response.users);
			assert(result.body.response.users[0]);
			assert.equal(result.body.response.users[0].username, acsUsername);
			assert(result.cookieString);
			done();
		});
	});

	before(function(done) {
		acsApp.usersLogin({
			login: acsUsername,
			password: acsPassword
		}, function(err, result) {
			assert.ifError(err);
			assert(result.body);
			assert(result.body.meta);
			assert.equal(result.body.meta.code, 200);
			assert.equal(result.body.meta.method_name, 'loginUser');
			assert(result.body.response);
			assert(result.body.response.users);
			assert(result.body.response.users[0]);
			assert.equal(result.body.response.users[0].username, acsUsername);
			assert(result.cookieString);
			assert.equal(typeof result.cookieString, 'string');
			acsApp.setSessionByCookieString(result.cookieString);
			assert.equal(result.cookieString, acsApp.appOptions.cookieString);
			done();
		});
	});

	describe('Test clients geolocate', function() {
		it('Should return clients geolocate info', function(done) {
			acsApp.clientsGeolocate({
				ip_address: '106.39.153.78'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'geolocateClient');
				assert(result.body.response);
				assert(result.body.response.ip_address);
				var geolocate_info = result.body.response;
				assert.equal(geolocate_info.ip_address, '106.39.153.78');
				assert(result.body.response.location);
				assert(result.body.response.location.country_code);
				assert(result.body.response.location.city);
				assert(result.body.response.location.state);
				assert(result.body.response.location.postal_code);
				assert(result.body.response.location.latitude);
				assert(result.body.response.location.longitude);
				done();
			});
		});
	});
});
