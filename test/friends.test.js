var assert = require('assert'),
	testUtil = require('./testUtil');

var acsApp = testUtil.getTestACSApp(),
	acsUsername = null,
	acsUserId,
	acsPassword = 'cocoafish',
	acsCookieString,
	acsFriendUsername,
	acsFriendUserId,
	acsFriendCookieString;


describe('Friends Test', function() {
	before(function(done) {
		acsApp.clearSession();
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			acsFriendUsername = acsUsername + '_friend';
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('.createUser', function() {
		it('Should create user as friend successfully', function(done) {
			this.timeout(20000);
			acsApp.usersCreate({
				username: acsFriendUsername,
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
				assert.equal(result.body.response.users[0].username, acsFriendUsername);
				assert(result.body.response.users[0].id);
				acsFriendUserId = result.body.response.users[0].id;
				assert(result.cookieString);
				acsFriendCookieString = result.cookieString;
				done();
			});
		});

		it('Should create general user successfully', function(done) {
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
				assert(result.body.response.users[0].id);
				acsUserId = result.body.response.users[0].id;
				assert(result.cookieString);
				acsCookieString = result.cookieString;
				acsApp.setSessionByCookieString(result.cookieString);
				done();
			});
		});
	});

	describe('.createFriends', function() {
		it('Should create friend successfully', function(done) {
			this.timeout(20000);
			acsApp.friendsAdd({
				user_ids: acsFriendUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'addFriends');
				done();
			});
		});
	});

	describe('.viewAndApproveFriends', function() {
		it('Should show pending friend successfully', function(done) {
			this.timeout(20000);
			acsApp.setSessionByCookieString(acsFriendCookieString);
			acsApp.friendsRequests(function(err, result) {
				acsApp.setSessionByCookieString(acsCookieString);
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'friendRequests');
				assert(result.body.response);
				assert(result.body.response.friend_requests);
				assert(result.body.response.friend_requests[0]);
				assert.equal(result.body.response.friend_requests[0].user_id, acsUserId);
				assert(result.body.response.friend_requests[0].user);
				assert.equal(result.body.response.friend_requests[0].user.id, acsUserId);
				assert.equal(result.body.response.friend_requests[0].user.username, acsUsername);
				done();
			});
		});

		it('Should approve pending friend successfully', function(done) {
			this.timeout(20000);
			acsApp.setSessionByCookieString(acsFriendCookieString);
			acsApp.friendsApprove({
				user_ids: acsUserId
			}, function(err, result) {
				acsApp.setSessionByCookieString(acsCookieString);
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'approveFriends');
				done();
			});
		});

		it('Should return approved friend successfully', function(done) {
			this.timeout(20000);
			acsApp.friendsQuery({
				limit: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryFriends');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].id, acsFriendUserId);
				assert.equal(result.body.response.users[0].username, acsFriendUsername);
				done();
			});
		});
	});

	describe('.searchFriends', function() {
		it('Should return search result successfully', function(done) {
			this.timeout(20000);
			acsApp.friendsSearch(function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'searchFriends');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].id, acsFriendUserId);
				assert.equal(result.body.response.users[0].username, acsFriendUsername);
				done();
			});
		});
	});

	describe('.removeFriends', function() {
		it('Should remove friend successfully', function(done) {
			this.timeout(20000);
			acsApp.friendsRemove({
				user_ids: acsFriendUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'removeFriends');
				done();
			});
		});

		it('Should have deleted friend', function(done) {
			this.timeout(20000);
			acsApp.friendsQuery({
				limit: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryFriends');
				assert(result.body.response);
				assert(!result.body.response.users);
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

		it('Should delete friend successfully', function(done) {
			this.timeout(20000);
			acsApp.setSessionByCookieString(acsFriendCookieString);
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
