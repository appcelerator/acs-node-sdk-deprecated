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
	acsPlaceCount = 0,
	acsPlaceId = null,
	acsUserId = null,
	acsPhotoId = null;

var timeout = 200000;

var placeObj = {
	name: 'place_test',
	address: '58 South Park Ave.',
	city: 'San Francisco',
	state: 'California',
	postal_code: '94107-1807',
	country: 'United States',
	latitude: 37.782227,
	longitude: -122.393159,
	website: 'http://cocoafish.com',
	twitter: 'acs',
	phone_number: '1234567',
	custom_fields: {
		a: 1
	}
};

describe('Places Test', function() {
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
		acsApp.placesCount(function(err, result) {
			assert.ifError(err);
			assert(result.body);
			assert(result.body.meta);
			assert.equal(result.body.meta.code, 200);
			done();
		});
	});
	describe('Create, update, count and show place', function() {
		it('Should create a place', function(done) {
			var photo_file = fs.createReadStream(__dirname + '/files/appcelerator.png');
			placeObj.photo = photo_file;
			placeObj.response_json_depth = 3;
			acsApp.placesCreate(placeObj, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createPlace');
				assert(result.body.response);
				assert(result.body.response.places);
				acsPlaceCount = acsPlaceCount + 1;
				acsPlaceId = result.body.response.places[0].id;
				assert(result.body.response.places[0].photo);
				assert(result.body.response.places[0].photo.id);
				acsPhotoId = result.body.response.places[0].photo.id;
				testUtil.processWait(acsApp, 'photo', acsPhotoId, done, 5000);
			});
		});

		it('Should return the place count', function(done) {
			acsApp.placesCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});

		it('Should update the place', function(done) {
			acsApp.placesUpdate({
				place_id: acsPlaceId,
				name: 'place_test_change'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updatePlace');
				assert(result.body.response);
				assert(result.body.response.places);
				assert(result.body.response.places[0].name);
				assert.equal(result.body.response.places[0].name, 'place_test_change');
				done();
			});
		});
		it('Should show the place', function(done) {
			acsApp.placesShow({
				place_id: acsPlaceId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showPlace');
				assert(result.body.response);
				assert(result.body.response.places);
				assert(result.body.response.places[0].name);
				assert.equal(result.body.response.places[0].name, 'place_test_change');
				done();
			});
		});
	});
	describe('quary and search places', function() {
		it('Quary should return all places', function(done) {
			acsApp.placesQuery({
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
				assert.equal(result.body.meta.method_name, 'queryPlaces');
				assert(result.body.response);
				assert(result.body.response.places);
				assert.equal(1, result.body.response.places.length);
				done();
			});
		});
		it('Search should return all places', function(done) {
			acsApp.placesSearch({
				user_id: acsUserId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'searchPlaces');
				assert(result.body.response);
				assert(result.body.response.places);
				done();
			});
		});
	});
	describe('remove place', function() {
		it('Should delete place', function(done) {
			acsApp.placesRemove({
				place_id: acsPlaceId
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				acsPlaceCount = acsPlaceCount - 1;
				done();
			});
		});
		it('Should return none place', function(done) {
			acsApp.placesCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});
	});

	describe('Negative test', function() {
		it('create without passing name field', function(done) {
			acsApp.placesCreate({}, function(err, result) {
				assert.equal(err.errorCode, 1001);
				assert.equal(err.message, 'Required parameter name is missing.');
				assert(!result);
				done();
			});
		});

		it('show using invalid place id', function(done) {
			acsApp.placesShow({
				place_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid place id');
				done();
			});
		});

		it('update using invalid place id', function(done) {
			acsApp.placesUpdate({
				place_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid place id');
				done();
			});
		});

		it('delete using invalid place id', function(done) {
			acsApp.placesRemove({
				place_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid place id');
				done();
			});
		});
	});
});
