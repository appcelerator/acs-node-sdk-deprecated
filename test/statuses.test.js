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
	event_id = null,
	status_id,
	message = 'Test - statuses';


describe('Statuses Test', function() {
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
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].username, acsUsername);
				assert(result.cookieString);
				acsApp.setSessionByCookieString(result.cookieString);
				done();
			});
		});

		it('Should create an event successfully', function(done) {
			acsApp.eventsCreate({
				name: 'Test - status(event)',
				start_time: new Date(),
				duration: 8
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				assert(result.body.response.events);
				event_id = result.body.response.events[0].id;
				done();
			});
		});
	});

	describe('positive statuses tests', function() {

		it('Should create a status successfully', function(done) {
			acsApp.statusesCreate({
				message: message
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.statuses[0];
				status_id = obj.id;
				assert.equal(result.body.meta.method_name, 'createStatus');
				done();
			});
		});

		it('Should show a status successfully', function(done) {
			acsApp.statusesShow({
				status_id: status_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.statuses[0];
				assert.equal(obj.message, message);
				assert.equal(result.body.meta.method_name, 'showStatus');
				done();
			});
		});

		it('Should update a status successfully', function(done) {
			var message = 'Test - new status(new)';
			acsApp.statusesUpdate({
				status_id: status_id,
				event_id: event_id,
				message: message
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updateStatus');
				var obj = result.body.response.statuses[0];
				assert.equal(obj.message, 'Test - new status(new)');
				assert.equal(obj.event.id, event_id);
				done();
			});
		});

		it('Should query statuses successfully', function(done) {
			acsApp.statusesQuery({

			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryStatuses');
				var obj = result.body.response.statuses[0];
				assert.equal(obj.message, 'Test - new status(new)');
				done();
			});
		});

		it('Should query 0 status successfully', function(done) {
			acsApp.statusesQuery({
				where: {
					'message': 'message'
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryStatuses');
				var obj = result.body.response.statuses;
				assert.equal(obj.length, 0);
				done();
			});
		});

		it('Should query 1 status successfully', function(done) {
			acsApp.statusesQuery({
				'message': 'Test - new status(new)'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.statuses;
				assert.equal(obj.length > 0, true);
				done();
			});
		});

		it('Should count statuses successfully', function(done) {
			acsApp.statusesCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});
	});

	describe('negative statuses tests', function() {

		it('Should fail to create a status without message', function(done) {
			acsApp.statusesCreate({
				name: 'Test - status'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				done();
			});
		});

		it('Should fail to show a status with invalid status_id', function(done) {
			acsApp.statusesShow({
				status_id: '545c7a36dda095cba2000127'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				done();
			});
		});

		it('Should fail to show a status without status_id', function(done) {
			acsApp.statusesShow({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid status id');
				done();
			});
		});

		it('Should fail to update a status without status_id', function(done) {
			acsApp.statusesUpdate({
				message: message
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid status id');
				done();
			});
		});

		it('Should fail to delete a status with invalid status_id', function(done) {
			acsApp.statusesDelete({
				status_id: '545c7a36dda095cba2000127'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid status id');
				done();
			});
		});

		it('Should fail to delete a status without  status_id', function(done) {
			acsApp.statusesDelete({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid status id');
				done();
			});
		});
	});

	describe('cleanup', function() {

		it('Should delete a status successfully', function(done) {
			acsApp.statusesDelete({
				status_id: status_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteStatus');
				done();
			});
		});

		it('Should fail to delete a batch of statuses', function(done) {
			acsApp.statusesBatchDelete({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 403);
				assert.equal(result.body.meta.message, 'You are not authorized to perform this action.');
				done();
			});
		});

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
