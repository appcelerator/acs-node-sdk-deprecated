var assert = require('assert'),
	testUtil = require('./testUtil');

var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var acsApp = require('../index')(acsKey),
	acsUsername_1 = null,
	acsPassword = 'cocoafish',
	acsUsername_2 = null,
	subject = 'New SDK!',
	body = 'Node ACS SDK Redesign Test - messages',
	acsUser1_id = null,
	message_id = null,
	reply_message_id = null,
	thread_id = null;


describe('Messages Test', function() {
	this.timeout(50000);
	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername_1 = username;
			console.log('\tGenerated acs user 1: %s', acsUsername_1);
			testUtil.generateUsername(function(username) {
				acsUsername_2 = username;
				console.log('\tGenerated acs user 2: %s', acsUsername_2);
				done();
			});
		});
	});

	describe('create user', function() {
		it('Should create user 1 successfully', function(done) {
			acsApp.usersCreate({
				username: acsUsername_1,
				password: acsPassword,
				password_confirmation: acsPassword
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createUser');
				var obj = result.body.response.users[0];
				assert.equal(obj.username, acsUsername_1);
				assert(result.cookieString);
				acsUser1_id = obj.id;
				done();
			});
		});

		it('Should create user 2 successfully', function(done) {
			acsApp.usersCreate({
				username: acsUsername_2,
				password: acsPassword,
				password_confirmation: acsPassword
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createUser');
				var obj = result.body.response.users[0];
				assert.equal(obj.username, acsUsername_2);
				assert(result.cookieString);
				done();
			});
		});
	});

	describe('Positive messages tests', function() {

		it('User 2 should be able to login successfully', function(done) {
			acsApp.usersLogin({
				login: acsUsername_2,
				password: acsPassword
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'loginUser');
				var obj = result.body.response.users[0];
				assert.equal(obj.username, acsUsername_2);
				assert(result.cookieString);
				assert.equal(typeof result.cookieString, 'string');
				acsApp.setSessionByCookieString(result.cookieString);
				assert.equal(result.cookieString, acsApp.appOptions.cookieString);
				done();
			});
		});

		it('Should send message to user 1 successfully', function(done) {
			acsApp.messagesCreate({
				to_ids: acsUser1_id,
				body: body,
				subject: subject
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createMessage');
				var obj = result.body.response.messages[0];
				message_id = obj.id;
				thread_id = obj.thread_id;
				assert.equal(obj.body, body);
				assert.equal(obj.subject, subject);
				done();
			});
		});

		it('Should show a message successfully', function(done) {
			acsApp.messagesShow({
				message_id: message_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showMessage');
				var obj = result.body.response.messages[0];
				message_id = obj.id;
				assert.equal(obj.body, body);
				assert.equal(obj.subject, subject);
				done();
			});
		});

		it('Should show sent messages successfully', function(done) {
			acsApp.messagesShowSent({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showMessagesSent');
				var obj = result.body.response.messages[0];
				message_id = obj.id;
				assert.equal(obj.body, body);
				assert.equal(obj.subject, subject);
				assert.equal(obj.status, 'sent');
				done();
			});
		});

		it('Should show a message thread successfully', function(done) {
			acsApp.messagesShowThread({
				thread_id: thread_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showThreadMessages');
				var obj = result.body.response.messages[0];
				assert.equal(obj.body, body);
				assert.equal(obj.subject, subject);
				assert.equal(obj.status, 'sent');
				done();
			});
		});

		it('Should query messages successfully', function(done) {
			acsApp.messagesQuery({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryMessages');
				done();
			});
		});

		it('User 1 should be able to login successfully', function(done) {
			acsApp.usersLogin({
				login: acsUsername_1,
				password: acsPassword
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'loginUser');
				var obj = result.body.response.users[0];
				assert.equal(obj.username, acsUsername_1);
				assert(result.cookieString);
				assert.equal(typeof result.cookieString, 'string');
				acsApp.setSessionByCookieString(result.cookieString);
				assert.equal(result.cookieString, acsApp.appOptions.cookieString);
				done();
			});
		});

		it('Should show message threads successfully', function(done) {
			acsApp.messagesShowThreads({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showThreads');
				var obj = result.body.response.messages[0];
				assert.equal(obj.body, body);
				assert.equal(obj.subject, subject);
				assert.equal(obj.status, 'unread');
				done();
			});
		});

		it('Should show inbox messages successfully', function(done) {
			acsApp.messagesShowInbox({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);

				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showMessagesInbox');
				var obj = result.body.response.messages[0];
				assert.equal(obj.body, body);
				assert.equal(obj.subject, subject);
				assert.equal(obj.status, 'unread');
				done();
			});
		});

		it('Should reply a message to user 2 successfully', function(done) {
			var body = 'Thanks for your invitation.';
			acsApp.messagesReply({
				message_id: message_id,
				body: 'Thanks for your invitation.'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'replyMessage');
				var obj = result.body.response.messages[0];
				reply_message_id = obj.id;
				assert.equal(obj.body, body);
				assert.equal(obj.status, 'sent');
				done();
			});
		});

		it('Should count messages successfully', function(done) {
			acsApp.messagesCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});

		it('Should delete a thread successfully', function(done) {
			acsApp.messagesDeleteThread({
				thread_id: thread_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteMessageThread');
				done();
			});
		});
	});

	describe('Negative messages tests', function() {

		it('Should fail to send message to user 1 without body', function(done) {
			acsApp.messagesReply({
				message_id: message_id
			}, function(err, result) {
				//                assert.equal(err !== undefined, true);
				//                assert.equal(err.message, 'Required parameter body is missing.');
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'replyMessage');
				done();
			});
		});

		it('Should fail to send message to user 1 without message_id', function(done) {
			acsApp.messagesReply({
				body: body
			}, function(err, result) {
				//                assert.equal(err !== undefined, true);
				//                assert.equal(err.message, 'Required parameter message_id is missing.');
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'replyMessage');
				done();
			});
		});

		it('Should fail to send message to user 1 without body', function(done) {
			acsApp.messagesCreate({
				to_ids: acsUser1_id,
				subject: subject
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Failed to send message: Validation failed - Body can\'t be blank.');
				done();
			});
		});

		it('Should fail to show a message without message_id', function(done) {
			acsApp.messagesShow({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Required field: message_id');
				done();
			});
		});

		it('Should reply a message to user 2 successfully', function(done) {
			acsApp.messagesReply({
				message_id: message_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'replyMessage');
				done();
			});
		});

		it('Should fail delete a thread without thread_id', function(done) {
			acsApp.messagesDeleteThread({}, function(err, result) {
				//                assert.equal(err !== undefined, true);
				//                assert.equal(err.message, 'Required parameter thread_id is missing.');
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'deleteMessageThread');
				done();
			});
		});
	});

	describe('cleanup', function() {

		it('Should delete a message successfully', function(done) {
			acsApp.messagesDelete({
				message_id: message_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'deleteMessage');
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
