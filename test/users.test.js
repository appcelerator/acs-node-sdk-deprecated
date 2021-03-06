var assert = require('assert'),
	testUtil = require('./testUtil');

var acsEntryPoint = (process.env.ACS_ENTRYPOINT ? process.env.ACS_ENTRYPOINT : 'https://api.cloud.appcelerator.com');
var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('ACS Entry Point: %s', acsEntryPoint);
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var ACSNode = require('../index'),
	acsApp = new ACSNode(acsKey, {
		apiEntryPoint: acsEntryPoint,
		prettyJson: true
	}),
	acsAppManualSession = new ACSNode(acsKey, {
		apiEntryPoint: acsEntryPoint,
		prettyJson: true,
		autoSessionManagement: false
	}),
	acsUsername = null,
	acsUsernameManualSession = null,
	manualSessionCookieString = null,
	acsPassword = 'cocoafish',
	acsUserCount = 0;

describe('Users Test', function() {
	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			console.log('\tGenerated acs user: %s', acsUsername);

			testUtil.generateUsername(function(username) {
				acsUsernameManualSession = username;
				console.log('\tGenerated acs user for manual session tests: %s', acsUsernameManualSession);
				done();
			});
		});
	});

	describe('.queryAndCountUsers', function() {
		it('Should return all users', function(done) {
			this.timeout(20000);
			acsApp.usersQuery({
				limit: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryUsers');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users.length >= 0);
				assert(result.body.response.users.length <= 100);
				done();
			});
		});

		it('Should return the correct user number as queried before', function(done) {
			this.timeout(20000);
			acsApp.usersCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				// A bug of https://jira.appcelerator.org/browse/CLOUDSRV-4022
				// assert.equal(result.body.meta.method_name, 'countUser');
				assert.equal(result.body.meta.method_name, 'usersCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				acsUserCount = result.body.meta.count;
				console.log('\tCurrent users count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsUserCount);
				done();
			});
		});
	});

	describe('.createUser', function() {
		it('Should create user successfully', function(done) {
			this.timeout(20000);
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
				done();
			});
		});

		it('User count should be increased', function(done) {
			this.timeout(20000);
			acsApp.usersCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				// A bug of https://jira.appcelerator.org/browse/CLOUDSRV-4022
				// assert.equal(result.body.meta.method_name, 'countUser');
				assert.equal(result.body.meta.method_name, 'usersCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				assert.equal(typeof result.body.meta.count, 'number');
				console.log('\tCurrent users count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsUserCount + 1);
				done();
			});
		});

		it('Should query user correctly', function(done) {
			this.timeout(20000);
			acsApp.usersQuery({
				where: {
					username: acsUsername
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryUsers');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].username, acsUsername);
				done();
			});
		});
	});

	describe('.loginUser', function() {
		it('Newly created user should be able to login successfully', function(done) {
			this.timeout(20000);
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
				done();
			});
		});

		it('Should show logged in user correctly with stored cookie string', function(done) {
			this.timeout(20000);
			acsApp.usersShowMe(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showMe');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].username, acsUsername);
				done();
			});
		});
	});

	describe('.updateUser', function() {
		it('Should update user successfully with custom_fields as a hash', function(done) {
			this.timeout(20000);
			acsApp.usersUpdate({
				custom_fields: {
					test: true
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updateUser');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert(result.body.response.users[0].custom_fields);
				assert(result.body.response.users[0].custom_fields.test);
				assert.equal(result.body.response.users[0].custom_fields.test, true);
				done();
			});
		});

		it('Should update user successfully with custom_fields as a string via rest call', function(done) {
			this.timeout(20000);
			acsApp.put('/v1/users/update.json', {
				custom_fields: '{"test":true}'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updateUser');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert(result.body.response.users[0].custom_fields.test);
				assert.equal(result.body.response.users[0].custom_fields.test, true);
				done();
			});
		});
	});

	describe('.deleteUser', function() {
		it('Should delete current user successfully', function(done) {
			this.timeout(20000);
			acsApp.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});

		it('User count should be decreased via rest call', function(done) {
			this.timeout(20000);
			// Delayed job and need time to wait for
			setTimeout(function() {
				acsApp.get('/v1/users/count.json', function(err, result) {
					assert.ifError(err);
					assert(result.body);
					assert(result.body.meta);
					assert.equal(result.body.meta.code, 200);
					// A bug of https://jira.appcelerator.org/browse/CLOUDSRV-4022
					// assert.equal(result.body.meta.method_name, 'countUser');
					assert.equal(result.body.meta.method_name, 'usersCount');
					assert(result.body.meta.count || (result.body.meta.count === 0));
					assert.equal(typeof result.body.meta.count, 'number');
					console.log('\tCurrent users count: %s', result.body.meta.count);
					assert.equal(result.body.meta.count, acsUserCount);
					done();
				});
			}, 2000);
		});
	});

	describe('Manual Session Manamement', function () {
		it('Should create user successfully', function(done) {
			this.timeout(20000);
			acsAppManualSession.usersCreate({
				username: acsUsernameManualSession,
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
				assert.equal(result.body.response.users[0].username, acsUsernameManualSession);
				done();
			});
		});

		it('Newly created user should be able to login successfully', function(done) {
			this.timeout(20000);
			acsAppManualSession.usersLogin({
				login: acsUsernameManualSession,
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
				assert.equal(result.body.response.users[0].username, acsUsernameManualSession);
				acsAppManualSession.sessionCookieString = result.cookieString;
				manualSessionCookieString = result.cookieString;
				done();
			});
		});

		it('Should create a keyvalue successfully', function(done) {
			acsAppManualSession.keyValuesSet({
				name: 'foo',
				value: 'bar'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'setKeyvalue');
				done();
			});
		});

		it('Should delete a keyvalue successfully', function(done) {
			acsAppManualSession.keyValuesDelete({
				name: 'foo'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteKeyvalue');
				done();
			});
		});

		it('Should nullify session', function(done) {
			acsAppManualSession.sessionCookieString = null;
			done();
		});

		it('Should fail to create a keyvalue', function(done) {
			acsAppManualSession.keyValuesSet({
				name: 'foo',
				value: 'bar'
			}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				done();
			});
		});

		it('Should delete current user successfully', function(done) {
			this.timeout(20000);
			acsAppManualSession.sessionCookieString = manualSessionCookieString;
			acsAppManualSession.usersRemove(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteUser');
				done();
			});
		});
	});
});
