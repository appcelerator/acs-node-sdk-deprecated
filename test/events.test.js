var assert = require('assert'),
	fs = require('fs'),
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
		prettyJson: true,
		responseJsonDepth: 1
	}),
	acsUsername = null,
	acsPassword = 'cocoafish',
	event_id = null,
	photo_id = null;

describe('Events Test', function() {
	this.timeout(50000);
	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('create user', function() {
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

				acsApp.usersLogin({
					login: acsUsername,
					password: acsPassword
				}, function (err, result) {
					assert.ifError(err);
					assert(result);
					done();
				});
			});
		});
	});

	describe('positive event tests', function() {
		it('Should create an event(start_time: new Date()) successfully - create', function(done) {
			acsApp.eventsCreate({
				name: 'Test - events',
				photo: fs.createReadStream(__dirname + '/files/appcelerator.png'),
				start_time: new Date(),
				duration: 3
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				var obj = result.body.response.events[0];
				event_id = obj.id;
				photo_id = obj.photo_id;
				testUtil.processWait(acsApp, 'photo', photo_id, done, 5000);
			});
		});

		it('Should create an event(start_time: "2014-011-05T20:59:50+0000") successfully', function(done) {
			acsApp.eventsCreate({
				name: 'Test - events2',
				photo_id: photo_id,
				start_time: '2014-011-05T20:59:50+0000',
				duration: 9
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.events[0];
				event_id = obj.id;
				assert.equal(obj.photo_id, photo_id);
				assert.equal(obj.name, 'Test - events2');
				done();
			});
		});

		it('Should create an event(start_time: new Date()) successfully - create', function(done) {
			acsApp.eventsCreate({
				name: 'Test - events()',
				photo: fs.createReadStream(__dirname + '/files/appcelerator.png'),
				start_time: new Date(),
				duration: 3
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				testUtil.processWait(acsApp, 'photo', photo_id, done, 5000);
			});
		});

		it('Should update an event successfully', function(done) {
			var event_name = 'Test - new events';
			acsApp.eventsUpdate({
				event_id: event_id,
				name: event_name,
				start_time: new Date(),
				duration: 6
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.events[0];
				event_id = obj.id;
				assert.equal(obj.id, event_id);
				assert.equal(obj.name, event_name);
				assert.equal(obj.duration, 6);
				assert.equal(obj.id, event_id);
				done();
			});
		});

		it('Should show an event successfully', function(done) {
			acsApp.eventsShow({
				event_id: event_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				assert(result.body.response.events);
				assert.equal(result.body.meta.method_name, 'showEvents');
				done();
			});
		});

		it('Should show an event occurrences successfully', function(done) {
			acsApp.eventsShowOccurrences({
				event_id: event_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				assert(result.body.response.event_occurrences);
				assert.equal(result.body.meta.method_name, 'showEventOccurrences');
				done();
			});
		});

		it('Should query events successfully', function(done) {
			acsApp.eventsQuery({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				assert(result.body.response.events);
				done();
			});
		});

		it('Should query event occurrences successfully', function(done) {
			acsApp.eventsQueryOccurrences({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryEventOccurrences');
				done();
			});
		});

		it('Should search events successfully', function(done) {
			acsApp.eventsSearch({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				assert(result.body.response.events);
				done();
			});
		});

		it('Should search event occurrences successfully', function(done) {
			acsApp.eventsSearchOccurrences({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'searchEventOccurrences');
				done();
			});
		});

		it('Should count event successfully', function(done) {
			acsApp.eventsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);

				done();
			});
		});

	});

	describe('negative event tests', function() {
		it('Should fail to create an event without start_time - create', function(done) {
			acsApp.eventsCreate({
				name: 'Test - events'
			}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				done();
			});
		});

		it('Should fail to create an event without name - create', function(done) {
			acsApp.eventsCreate({
				start_time: new Date()
			}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				assert.equal(err.body.meta.message, 'Failed to create event: Validation failed - Name can\'t be blank.');
				done();
			});
		});

		it('Should fail to create an event with invalid start_time', function(done) {
			acsApp.eventsCreate({
				name: 'Test - events',
				start_time: '2011'
			}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				assert.equal(err.body.meta.message, 'Invalid calender schedule  invalid date');
				done();
			});
		});

		it('Should fail to update an event without event_id', function(done) {
			var event_name = 'Test - new events';
			acsApp.eventsUpdate({
				name: event_name,
				start_time: new Date(),
				duration: 6
			}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				assert.equal(err.body.meta.message, 'Invalid event id');
				done();
			});
		});

		it('Should fail to update an event with invalid start_time - update', function(done) {
			acsApp.eventsUpdate({
				event_id: event_id,
				start_time: '2011',
				duration: 8
			}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				assert.equal(err.body.meta.message, 'Invalid calender schedule  invalid date');
				done();
			});
		});

		it('Should fail to update an event with invalid duration - update', function(done) {
			acsApp.eventsUpdate({
				event_id: event_id,
				start_time: '2011',
				duration: '8'
			}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				assert.equal(err.body.meta.message, 'Invalid calender schedule  invalid date');
				done();
			});
		});
	});

	describe('cleanup', function() {
		it('Should delete an event successfully', function(done) {
			acsApp.eventsDelete({
				event_id: event_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteEvent');
				done();
			});
		});

		it('Should delete a batch of events successfully', function(done) {
			acsApp.eventsBatchDelete({}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 403);
				assert.equal(err.body.meta.message, 'You are not authorized to perform this action.');
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
