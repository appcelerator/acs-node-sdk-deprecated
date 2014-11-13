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
	message = 'Node ACS SDK Redesign Test - chats',
	acsUser1_id = null,
	chat_group_id = null,
	chat_id = null;


describe('Chats Test', function() {
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

	describe('Positive chats tests', function() {

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

		it('Should send message to user 1 successfully - create', function(done) {
			acsApp.chatsCreate({
				to_ids: acsUser1_id,
				message: message,
				response_json_depth: 3
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createChatMessage');
				var obj = result.body.response.chats[0];
				assert.equal(obj.message, message);
				assert(result.cookieString);
				chat_group_id = obj.chat_group.id;
				chat_id = obj.id;
				done();
			});
		});

		it('Should send message to chat group successfully - create', function(done) {
			acsApp.chatsCreate({
				chat_group_id: chat_group_id,
				message: message
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createChatMessage');
				var obj = result.body.response.chats[0];
				assert.equal(obj.message, message);
				done();
			});
		});

		it('Should query chats successfully - query', function(done) {
			acsApp.chatsQuery({
				participate_ids: acsUser1_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryChatMessages');
				var obj = result.body.response.chats[0];
				assert.equal(obj.message, message);
				assert(result.cookieString);
				done();
			});
		});

		it('Should get chat groups that user 1 participates in successfully - get_chat_groups', function(done) {
			acsApp.chatsGetChatGroups({

			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'getChatGroups');
				var obj = result.body.response.chat_groups[0];
				assert.equal(obj.message, message);
				assert(result.cookieString);
				done();
			});
		});

		it('Should fail to query chat groups - query_chat_groups', function(done) {
			acsApp.chatsQueryChatGroups({

			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 403);
				done();
			});
		});

		it('Should get the count of chats successfully - count', function(done) {
			acsApp.chatsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'chatsCount');
				done();
			});
		});

		it('Should delete chat that user 1 participates in successfully - delete', function(done) {
			acsApp.chatsDelete({
				chat_id: chat_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteChat');
				done();
			});
		});
	});

	describe('Negative chats tests', function() {

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

		it('Should fail to send message to user 1 successfully - create', function(done) {
			acsApp.chatsCreate({
				//                to_ids: acsUser1_id,
				message: message
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Required field: to_ids or chat_group_id');
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
