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
	acsPassword = 'cocoafish',
	name = 'SN',
	value = '098765432';


describe('Keyvalues Test', function() {
	this.timeout(50000);
	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('create user and event', function() {
		it('Should create user successfully', function(done) {
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
				var obj = result.body.response.users[0];
				assert.equal(obj.username, acsUsername);
				assert(result.cookieString);
				acsApp.setSessionByCookieString(result.cookieString);
				done();
			});
		});
	});

	describe('positive keyvalues tests', function() {
		it('Should create a keyvalue successfully', function(done) {
			acsApp.keyValuesSet({
				name: name,
				value: value
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'setKeyvalue');
				done();
			});
		});

		it('Should append a keyvalue successfully', function(done) {
			var appended_value = '1234567890';
			acsApp.keyValuesAppend({
				name: name,
				value: appended_value
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'appendKeyvalue');
				var obj = result.body.response.keyvalues[0];
				assert.equal(obj.name, name);
				assert.equal(obj.value, value + appended_value);
				done();
			});
		});

		it('Should get a keyvalue successfully', function(done) {
			acsApp.keyValuesGet({
				name: name
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'getKeyvalue');
				var obj = result.body.response.keyvalues[0];
				assert.equal(obj.name, name);
				done();
			});
		});

		it('Should delete a keyvalue successfully', function(done) {
			acsApp.keyValuesDelete({
				name: name
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteKeyvalue');
				done();
			});
		});

		it('Should get a keyvalue successfully', function(done) {
			acsApp.keyValuesGet({
				name: name
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);

				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				done();
			});
		});

		it('Should create a keyvalue with value is integer successfully', function(done) {
			acsApp.keyValuesSet({
				name: name,
				value: 5
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'setKeyvalue');
				done();
			});
		});

		it('Should increase a keyvalue with a positive integer successfully', function(done) {
			acsApp.keyValuesIncrby({
				name: name,
				value: 2
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'incrbyKeyvalue');
				var obj = result.body.response.keyvalues[0];
				assert.equal(obj.name, name);
				assert.equal(obj.value, 7);
				done();
			});
		});

		it('Should increase a keyvalue with a negative integer successfully', function(done) {
			acsApp.keyValuesIncrby({
				name: name,
				value: -5
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'incrbyKeyvalue');
				var obj = result.body.response.keyvalues[0];
				assert.equal(obj.name, name);
				assert.equal(obj.value, 2);
				done();
			});
		});

		it('Should query keyvalues successfully', function(done) {
			acsApp.keyValuesQuery({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryKeyValues');
				assert.equal(result.body.response.keyvalues.length, 1);
				var obj = result.body.response.keyvalues[0];
				assert.equal(obj.value, 2);
				done();
			});
		});

		it('Should count keyvalues successfully', function(done) {
			acsApp.keyValuesCount({

			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'keyvaluesCount');
				done();
			});
		});

		it('Should delete a keyvalue successfully', function(done) {
			acsApp.keyValuesDelete({
				name: name
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteKeyvalue');
				done();
			});
		});
	});

	describe('negative keyvalues tests', function() {
		it('Should fail to create a keyvalue without value', function(done) {
			acsApp.keyValuesSet({
				name: name
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Key-value value required');
				done();
			});
		});

		it('Should fail to create a keyvalue without name', function(done) {
			acsApp.keyValuesSet({
				value: value
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Key-value name required');
				done();
			});
		});
	});

	describe('cleanup', function() {

		it('Should delete current user successfully', function(done) {
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
	});
});
