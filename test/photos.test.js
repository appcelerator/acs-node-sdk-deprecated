var assert = require('assert'),
	testUtil = require('./testUtil'),
	fs = require('fs');

var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var acsApp = require('../index')(acsKey),
	acsUsername = null,
	acsPassword = 'cocoafish',
	acsPhotoCount = 0,
	acsUserId = null,
	acsPhotoId = null;

var timeout = 50000;

describe('Photos Test', function() {
	this.timeout(timeout);

	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	before(function(done) {
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
			acsUserId = result.body.response.users[0].id;
			assert(result.cookieString);
			done();
		});
	});

	before(function(done) {
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
			assert(result.cookieString);
			assert.equal(typeof result.cookieString, 'string');
			acsApp.setSessionByCookieString(result.cookieString);
			assert.equal(result.cookieString, acsApp.appOptions.cookieString);
			done();
		});
	});

	before(function(done) {
		acsApp.photosCount(function(err, result) {
			assert.ifError(err);
			assert(result.body);
			assert(result.body.meta);
			assert.equal(result.body.meta.code, 200);
			done();
		});
	});
	describe('Create, update, count and show photo', function() {
		it('Should create a photo', function(done) {
			var photo_file = fs.createReadStream(__dirname + '/files/appcelerator.png');
			acsApp.photosCreate({
				photo: photo_file,
				title: 'test photo'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createPhoto');
				assert(result.body.response);
				assert(result.body.response.photos);
				acsPhotoCount = acsPhotoCount + 1;
				acsPhotoId = result.body.response.photos[0].id;
				testUtil.processWait(acsApp, 'photo', acsPhotoId, done, 5000);
			});
		});

		it('Should return the photo count', function(done) {
			acsApp.photosCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});

		it('Should update the photo', function(done) {
			acsApp.photosUpdate({
				photo_id: acsPhotoId,
				title: 'test photo 1'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updatePhoto');
				assert(result.body.response);
				assert(result.body.response.photos);
				assert(result.body.response.photos[0].title);
				assert.equal(result.body.response.photos[0].title, 'test photo 1');
				done();
			});
		});
	});
	describe('quary and search photos', function() {
		it('Quary should return all photos', function(done) {
			acsApp.photosQuery({
				limit: 100,
				where: {
					user_id: acsUserId
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryPhoto');
				assert(result.body.response);
				assert(result.body.response.photos);
				assert.equal(1, result.body.response.photos.length);
				done();
			});
		});
		it('Search should return all photos', function(done) {
			acsApp.photosSearch({
				limit: 100,
				q: 'title'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'searchPhotos');
				assert(result.body.response);
				assert(result.body.response.photos);
				done();
			});
		});
	});
	describe('remove photo', function() {
		it('Should delete photo', function(done) {
			acsApp.photosRemove({
				photo_id: acsPhotoId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});
	});
	describe('Negative test', function() {

		it('create without passing photo field', function(done) {
			acsApp.photosCreate({}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Photo parameter required for photo upload');
				done();
			});
		});

		it('create using invalid photo field id', function(done) {
			acsApp.photosCreate({
				photo: __dirname + '/files/invalidphotos.jpg'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid photo file attachment');
				done();
			});
		});

		it('show using invalid photo id', function(done) {
			acsApp.photosShow({
				photo_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid photo id');
				done();
			});
		});

		it('update using invalid photo id', function(done) {
			acsApp.photosUpdate({
				photo_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid photo id');
				done();
			});
		});

		it('delete using invalid photo id', function(done) {
			acsApp.photosRemove({
				photo_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid photo id');
				done();
			});
		});
	});
});
