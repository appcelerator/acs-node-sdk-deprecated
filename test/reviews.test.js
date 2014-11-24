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
	acsReviewCount = 0,
	acsPlaceId = null,
	acsPhotoId = null,
	acsUserId = null,
	acsReviewIds = [];

var timeout = 50000;

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

describe('Reviews Test', function() {
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
		acsApp.reviewsCount(function(err, result) {
			assert.ifError(err);
			assert(result.body);
			assert(result.body.meta);
			assert.equal(result.body.meta.code, 200);
			done();
		});
	});
	describe('Create, update, count and show review', function() {
		it('Should create a place and a photo', function(done) {
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
				acsPlaceId = result.body.response.places[0].id;
				acsPhotoId = result.body.response.places[0].photo.id;
				testUtil.processWait(acsApp, 'photo', acsPhotoId, done, 5000);
			});
		});
		it('Should review the place', function(done) {
			acsApp.reviewsCreate({
				place_id: acsPlaceId,
				rating: '10'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createReview');
				assert(result.body.response);
				assert(result.body.response.reviews);
				acsReviewCount = acsReviewCount + 1;
				acsReviewIds[0] = result.body.response.reviews[0].id;
				done();
			});
		});
		it('Should review the photo', function(done) {
			acsApp.reviewsCreate({
				photo_id: acsPhotoId,
				rating: '5',
				tags: 'cool,outside'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createReview');
				assert(result.body.response);
				assert(result.body.response.reviews);
				acsReviewCount = acsReviewCount + 1;
				acsReviewIds[1] = result.body.response.reviews[0].id;
				done();
			});
		});
		it('Should return the review count', function(done) {
			acsApp.reviewsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});

		it('Should update the review', function(done) {
			acsApp.reviewsUpdate({
				review_id: acsReviewIds[0],
				place_id: acsPlaceId,
				rating: '8'
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updateReview');
				assert(result.body.response);
				assert(result.body.response.reviews);
				assert(result.body.response.reviews[0].rating);
				assert.equal(result.body.response.reviews[0].rating, '8');
				done();
			});
		});
		it('Should show the review', function(done) {
			acsApp.reviewsShow({
				review_id: acsReviewIds[1]
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showReview');
				assert(result.body.response);
				assert(result.body.response.reviews);
				assert(result.body.response.reviews[0].tags);
				assert.equal(result.body.response.reviews[0].tags, 'cool,outside');
				done();
			});
		});
	});
	describe('quary reviews', function() {
		it('Should return all reviews', function(done) {
			acsApp.reviewsQuery({
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
				assert.equal(result.body.meta.method_name, 'queryReviews');
				assert(result.body.response);
				assert(result.body.response.reviews);
				assert.equal(2, result.body.response.reviews.length);
				done();
			});
		});
	});
	describe('remove reviews', function() {
		it('Should delete reviews', function(done) {
			acsApp.reviewsRemove({
				review_id: acsReviewIds[1]
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				acsReviewCount = acsReviewCount - 1;
				done();
			});
		});
	});

	describe('Negative test', function() {
		it('create without passing object_id field', function(done) {
			acsApp.reviewsCreate({}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid review type');
				done();
			});
		});

		it('show using invalid review id', function(done) {
			acsApp.reviewsShow({
				review_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid review id(s)');
				done();
			});
		});

		it('update using invalid review id', function(done) {
			acsApp.reviewsUpdate({
				review_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid review type');
				done();
			});
		});

		it('delete using invalid review id', function(done) {
			acsApp.reviewsRemove({
				review_id: 'invalid'
			}, function(err, result) {
				assert.ifError(err);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid review id');
				done();
			});
		});
	});
});
