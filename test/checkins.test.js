var assert = require('assert'),
	fs = require('fs'),
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
	checkin_id = null,
	checkin_id2 = null,
	message = 'Test - checkins(event)';


describe('Checkins Test', function() {
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
				name: 'Test - checkins(event)',
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

	describe('positive checkin tests', function() {

		it('Should create a checkin successfully - create', function(done) {
			acsApp.checkinsCreate({
				name: 'Test - checkins',
				event_id: event_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.checkins[0];
				checkin_id = obj.id;
				assert.equal(result.body.meta.method_name, 'createCheckin');
				done();
			});
		});

		it('Should show a checkin successfully - show', function(done) {
			acsApp.checkinsShow({
				checkin_id: checkin_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				assert(result.body.response.checkins);
				assert.equal(result.body.meta.method_name, 'showCheckins');
				done();
			});
		});

		it('Should update a checkin successfully - update', function(done) {
			var message = 'Test - new checkins(event)';
			acsApp.checkinsUpdate({
				checkin_id: checkin_id,
				message: message
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updateCheckin');
				var obj = result.body.response.checkins[0];
				assert.equal(obj.message, message);
				done();
			});
		});

		it('Should query checkins successfully - query', function(done) {
			acsApp.checkinsQuery({

			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryCheckins');
				var obj = result.body.response.checkins[0];
				assert.equal(obj.message, 'Test - new checkins(event)');
				done();
			});
		});

		it('Should query 0 checkin successfully - query', function(done) {
			acsApp.checkinsQuery({
				where: {
					'message': message
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryCheckins');
				var obj = result.body.response.checkins;
				assert.equal(obj.length, 0);
				done();
			});
		});

		it('Should query 1 checkin successfully - query', function(done) {
			acsApp.checkinsQuery({
				where: {
					'message': 'Test - new checkins(event)'
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.checkins;
				assert.equal(obj.length, 1);
				done();
			});
		});

		it('Should count checkins successfully - count', function(done) {
			acsApp.checkinsCount({

			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'checkinsCount');
				done();
			});
		});

		it('Should create a checkin with a photo successfully - create', function(done) {
			acsApp.checkinsCreate({
				event_id: event_id,
				response_json_depth: 3,
				photo: fs.createReadStream(__dirname + '/files/appcelerator.png')
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createCheckin');
				var obj = result.body.response.checkins[0];
				checkin_id2 = obj.id;
				testUtil.processWait(acsApp, 'photo', obj.photo.id, done, 5000);
			});
		});

		it('Should show a checkin which has photo successfully - show', function(done) {
			acsApp.checkinsShow({
				checkin_id: checkin_id2,
				response_json_depth: 3
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				assert.equal(result.body.meta.method_name, 'showCheckins');
				var obj = result.body.response.checkins[0];
				assert.equal(obj.photo.processed, true);
				done();
			});
		});

		it('Should create a checkin without name successfully - create', function(done) {
			acsApp.checkinsCreate({
				event_id: event_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createCheckin');
				done();
			});
		});

		it('Should count checkins successfully', function(done) {
			acsApp.checkinsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});
	});

	describe('negative checkin tests', function() {

		it('Should fail to create a checkin without both place_id and event_id - create', function(done) {
			acsApp.checkinsCreate({
				name: 'Test - checkins'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'createCheckin');
				assert.equal(result.body.meta.message, 'Failed to create a checkin: Validation failed - Place or event id is required.');
				done();
			});
		});

		it('Should fail to create a checkin with an invalid event_id - create', function(done) {
			acsApp.checkinsCreate({
				name: 'Test - checkins',
				event_id: '5459d218dda09549a3000083'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'createCheckin');
				assert.equal(result.body.meta.message, 'Invalid event id');
				done();
			});
		});

		it('Should fail to create a checkin with an invalid place_id - create', function(done) {
			acsApp.checkinsCreate({
				name: 'Test - checkins',
				place_id: '5459d218dda09549a3000083'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'createCheckin');
				assert.equal(result.body.meta.message, 'Invalid place id');
				done();
			});
		});

		it('Should fail to delete a checkin without checkin_id - delete', function(done) {
			acsApp.checkinsDelete({}, function(err) {
				assert.equal(err !== undefined, true);
				assert.equal(err.message, 'Required parameter checkin_id is missing.');
				done();
			});
		});

		it('Should fail to show a checkin without checkin_id - show', function(done) {
			acsApp.checkinsShow({}, function(err) {
				assert.equal(err !== undefined, true);
				assert.equal(err.message, 'Required parameter checkin_id is missing.');
				done();
			});
		});

		it('Should fail to update a checkin without checkin_id - update', function(done) {
			acsApp.checkinsUpdate({}, function(err) {
				assert.equal(err !== undefined, true);
				assert.equal(err.message, 'Required parameter checkin_id is missing.');
				done();
			});
		});


	});

	describe('cleanup', function() {

		it('Should delete a checkin successfully - delete', function(done) {
			acsApp.checkinsDelete({
				checkin_id: checkin_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteCheckin');
				done();
			});
		});

		it('Should fail to delete a batch of checkins - batch_delete', function(done) {
			acsApp.checkinsBatchDelete({
				where: {
					'message': 'Test - new checkins(event)'
				}
			}, function(err, result) {
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
