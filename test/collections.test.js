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
	acsUserId = null,
	acsPhotoId = null,
	acsCollectionCount = 0,
	acsCollectionId = [];

var timeout = 50000;

describe('Collections Test', function() {
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
		acsApp.photoCollectionsCount(function(err, result) {
			assert.ifError(err);
			assert(result.body);
			assert(result.body.meta);
			assert.equal(result.body.meta.code, 200);
			done();
		});
	});
	describe('Create, update, count and show collection', function() {
		it('Should create a collection', function(done) {
			acsApp.photoCollectionsCreate({
				name: 'Name'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createCollection');
				assert(result.body.response);
				assert(result.body.response.collections);
				acsCollectionCount = acsCollectionCount + 1;
				acsCollectionId[0] = result.body.response.collections[0].id;
				done();
			});
		});

		it('Should create another collection', function(done) {
			acsApp.photoCollectionsCreate({
				name: 'Name2',
				parent_collection_id: acsCollectionId[0]
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createCollection');
				assert(result.body.response);
				assert(result.body.response.collections);
				acsCollectionCount = acsCollectionCount + 1;
				acsCollectionId[1] = result.body.response.collections[0].id;
				done();
			});
		});

		it('Should create a photo', function(done) {
			var photo_file = fs.createReadStream(__dirname + '/files/appcelerator.png');
			acsApp.photosCreate({
				photo: photo_file,
				collection_id: acsCollectionId[1],
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
				acsPhotoId = result.body.response.photos[0].id;
				testUtil.processWait(acsApp, 'photo', acsPhotoId, done, 5000);
			});
		});

		it('Should return the collection count', function(done) {
			acsApp.photoCollectionsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});

		it('Should update the collection', function(done) {
			acsApp.photoCollectionsUpdate({
				collection_id: acsCollectionId[1],
				name: 'Name_ok'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updateCollection');
				assert(result.body.response);
				assert(result.body.response.collections);
				assert(result.body.response.collections[0].name);
				assert.equal(result.body.response.collections[0].name, 'Name_ok');
				done();
			});
		});
	});
	describe('search collections and show the photo', function() {
		it('Should return all collections', function(done) {
			acsApp.photoCollectionsSearch({
				user_id: acsUserId,
				limit: 100,
				q: 'Name'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'searchCollections');
				assert(result.body.response);
				assert(result.body.response.collections);
				assert.equal(1, result.body.response.collections.length);
				done();
			});
		});
		it('Should return all subcollections', function(done) {
			acsApp.photoCollectionsShowSubcollections({
				collection_id: acsCollectionId[0]
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showCollectionSubcollections');
				assert(result.body.response);
				assert(result.body.response.collections);
				assert.equal(1, result.body.response.collections.length);
				done();
			});
		});
		it('Should return all photo in collections', function(done) {
			acsApp.photoCollectionsShowPhotos({
				collection_id: acsCollectionId[1]
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showCollectionPhotos');
				assert(result.body.response);
				assert(result.body.response.photos);
				assert.equal(1, result.body.response.photos.length);
				done();
			});
		});
	});
	describe('remove collections', function() {
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
		it('Should delete collection 1', function(done) {
			acsApp.photoCollectionsRemove({
				collection_id: acsCollectionId[1]
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				acsCollectionCount = acsCollectionCount - 1;
				done();
			});
		});
		it('Should delete collection 0', function(done) {
			acsApp.photoCollectionsDelete({
				collection_id: acsCollectionId[0]
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				acsCollectionCount = acsCollectionCount - 1;
				done();
			});
		});
		it('Should return none collections', function(done) {
			acsApp.photoCollectionsCount({}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});
	});
});
