var fs = require('fs'),
	assert = require('assert'),
	testUtil = require('./testUtil');

var acsApp = testUtil.getTestACSApp(),
	acsUsername = null,
	acsPassword = 'cocoafish',
	acsFileId,
	acsFileName,
	acsFileNewName,
	acsFilesCount = 0;


describe('Files Test', function() {
	before(function(done) {
		acsApp.clearSession();
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			console.log('\tGenerated acs user: %s', acsUsername);
			acsFileName = acsUsername + '_testfile';
			acsFileNewName = acsUsername + '_testnewfile';
			done();
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
				assert(result.cookieString);
				acsApp.setSessionByCookieString(result.cookieString);
				done();
			});
		});
	});

	describe('.queryAndCountFiles', function() {
		it('Should return all Files', function(done) {
			this.timeout(20000);
			acsApp.filesQuery({
				limit: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryFiles');
				assert(result.body.response);
				assert(result.body.response.files);
				acsFilesCount = result.body.response.files.length;
				assert.equal(typeof acsFilesCount, 'number');
				done();
			});
		});

		it('Should return the correct ACL number as queried before', function(done) {
			this.timeout(20000);
			acsApp.filesCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'filesCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent files count: %s', result.body.meta.count);
				acsFilesCount = result.body.meta.count;
				assert.equal(result.body.meta.count, acsFilesCount);
				done();
			});
		});
	});

	describe('.createFile', function() {
		it('Should create file successfully', function(done) {
			this.timeout(20000);
			var file = fs.createReadStream(__dirname + '/files/appcelerator.png');
			acsApp.filesCreate({
				name: acsFileName,
				file: file
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createFile');
				assert(result.body.response);
				assert(result.body.response.files);
				assert(result.body.response.files[0]);
				assert(result.body.response.files[0].id);
				acsFileId = result.body.response.files[0].id;
				assert.equal(result.body.response.files[0].name, acsFileName);
				done();
			});
		});

		it('Files count should be increased', function(done) {
			this.timeout(20000);
			acsApp.filesCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'filesCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent files count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsFilesCount + 1);
				done();
			});
		});

		it('Should query File correctly', function(done) {
			this.timeout(20000);
			acsApp.filesQuery({
				where: {
					name: acsFileName
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryFiles');
				assert(result.body.response);
				assert(result.body.response.files);
				assert(result.body.response.files[0]);
				assert.equal(result.body.response.files[0].name, acsFileName);
				assert.equal(result.body.response.files[0].id, acsFileId);
				// assert(result.body.response.files[0].url);
				done();
			});
		});
	});

	describe('.showAndUpdateFile', function() {
		it('Should show file successfully', function(done) {
			this.timeout(20000);
			acsApp.filesShow({
				file_id: acsFileId
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showFile');
				assert(result.body.response);
				assert(result.body.response.files);
				assert(result.body.response.files[0]);
				assert.equal(result.body.response.files[0].name, acsFileName);
				assert.equal(result.body.response.files[0].id, acsFileId);
				// assert(result.body.response.files[0].url);
				done();
			});
		});

		it('Should update file successfully', function(done) {
			this.timeout(20000);
			acsApp.filesUpdate({
				file_id: acsFileId,
				name: acsFileNewName
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updateFile');
				assert(result.body.response);
				assert(result.body.response.files);
				assert(result.body.response.files[0]);
				assert.equal(result.body.response.files[0].name, acsFileNewName);
				assert.equal(result.body.response.files[0].id, acsFileId);
				// assert(result.body.response.files[0].url);
				done();
			});
		});
	});

	describe('.deleteFile', function() {
		it('Should delete file successfully', function(done) {
			this.timeout(20000);
			acsApp.filesRemove({
				file_id: acsFileId
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteFile');
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
	});
});
