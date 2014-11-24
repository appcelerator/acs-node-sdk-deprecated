var assert = require('assert'),
	testUtil = require('./testUtil');

var acsApp = testUtil.getTestACSApp(),
	acsUsername = null,
	acsPassword = 'cocoafish',
	acsReaderUsername,
	acsReaderUserId,
	acsReaderCookieString,
	acsWriterUsername,
	acsWriterUserId,
	acsWriterCookieString,
	acsACLName = 'aclTest',
	acsACLsCount = 0;


describe('ACLs Test', function() {
	before(function(done) {
		acsApp.clearSession();
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			acsReaderUsername = acsUsername + '_reader';
			acsWriterUsername = acsUsername + '_writer';
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('.createUser', function() {
		it('Should create user as ACL reader successfully', function(done) {
			this.timeout(20000);
			acsApp.usersCreate({
				username: acsReaderUsername,
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
				assert.equal(result.body.response.users[0].username, acsReaderUsername);
				assert(result.body.response.users[0].id);
				acsReaderUserId = result.body.response.users[0].id;
				assert(result.cookieString);
				acsReaderCookieString = result.cookieString;
				done();
			});
		});

		it('Should create user as ACL writer successfully', function(done) {
			this.timeout(20000);
			acsApp.usersCreate({
				username: acsWriterUsername,
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
				assert.equal(result.body.response.users[0].username, acsWriterUsername);
				assert(result.body.response.users[0].id);
				acsWriterUserId = result.body.response.users[0].id;
				assert(result.cookieString);
				acsWriterCookieString = result.cookieString;
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
				assert(result.cookieString);
				acsApp.setSessionByCookieString(result.cookieString);
				done();
			});
		});
	});

	describe('.queryAndCountACLs', function() {
		it('Should return all ACLs', function(done) {
			this.timeout(20000);
			acsApp.aclsQuery({
				limit: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryACL');
				assert(result.body.response);
				assert(result.body.response.acls);
				acsACLsCount = result.body.response.acls.length;
				assert.equal(typeof acsACLsCount, 'number');
				done();
			});
		});

		it('Should return the correct ACL number as queried before', function(done) {
			this.timeout(20000);
			acsApp.aclsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'aclsCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent acls count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsACLsCount);
				done();
			});
		});
	});

	describe('.addACL', function() {
		it('Should add ACL successfully', function(done) {
			this.timeout(20000);
			acsApp.aclsAddUser({
				name: acsACLName,
				reader_ids: acsReaderUserId,
				writer_ids: acsWriterUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createAcl');
				assert(result.body.response);
				assert(result.body.response.acls);
				assert(result.body.response.acls[0]);
				assert.equal(result.body.response.acls[0].name, acsACLName);
				done();
			});
		});

		it('ACLs count should be increased', function(done) {
			this.timeout(20000);
			acsApp.aclsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'aclsCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				assert.equal(typeof result.body.meta.count, 'number');
				console.log('\tCurrent acls count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsACLsCount + 1);
				done();
			});
		});

		it('Should query ACL correctly', function(done) {
			this.timeout(20000);
			acsApp.aclsQuery({
				where: {
					name: acsACLName
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryACL');
				assert(result.body.response);
				assert(result.body.response.acls);
				assert(result.body.response.acls[0]);
				assert.equal(result.body.response.acls[0].name, acsACLName);
				done();
			});
		});
	});

	describe('.checkACL', function() {
		it('Should check ACL successfully', function(done) {
			this.timeout(20000);
			acsApp.aclsCheckUser({
				name: acsACLName,
				user_id: acsWriterUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'checkAcl');
				assert(result.body.response);
				assert(result.body.response.permission);
				assert.equal(result.body.response.permission.read_permission, false);
				assert.equal(result.body.response.permission.write_permission, true);
				done();
			});
		});
	});

	describe('.removeACL', function() {
		it('Should check ACL successfully', function(done) {
			this.timeout(20000);
			acsApp.aclsRemove({
				name: acsACLName
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteAcl');
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

		it('Should delete reader successfully', function(done) {
			this.timeout(20000);
			acsApp.setSessionByCookieString(acsReaderCookieString);
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

		it('Should delete writer successfully', function(done) {
			this.timeout(20000);
			acsApp.setSessionByCookieString(acsWriterCookieString);
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
