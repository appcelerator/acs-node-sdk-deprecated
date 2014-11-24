var assert = require('assert'),
	fs = require('fs'),
	testUtil = require('./testUtil');

var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var acsApp = require('../index')(acsKey),
	acsUsername = null,
	acsPassword = 'cocoafish',
	event_id = null,
	post_id = null,
	photo_id = null,
	content = 'ACS, awesome product!';


describe('Posts Test', function() {
	this.timeout(50000);
	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('create user and event', function() {
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
				assert(result.cookieString);
				acsApp.setSessionByCookieString(result.cookieString);
				done();
			});
		});

		it('Should create an event successfully', function(done) {
			acsApp.eventsCreate({
				name: 'Test - checkins(event)',
				start_time: new Date(),
				duration: 8
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.events[0];
				event_id = obj.id;
				done();
			});
		});
	});

	describe('positive posts tests', function() {
		it('Should create a post successfully', function(done) {
			acsApp.postsCreate({
				content: content,
				event_id: event_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createPost');
				var obj = result.body.response.posts[0];
				assert.equal(obj.content, content);
				done();
			});
		});

		it('Should create a post without event successfully', function(done) {
			acsApp.postsCreate({
				content: content
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createPost');
				var obj = result.body.response.posts[0];
				assert.equal(obj.content, content);
				done();
			});
		});

		it('Should create a post with photo successfully', function(done) {
			acsApp.postsCreate({
				content: content,
				photo: fs.createReadStream(__dirname + '/files/appcelerator.png')
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createPost');
				var obj = result.body.response.posts[0];
				photo_id = obj.photo.id;
				assert.equal(obj.content, content);
				testUtil.processWait(acsApp, 'photo', photo_id, done, 5000);
			});
		});

		it('Should create a post with multiple parameters successfully', function(done) {
			var title = 'Good product';
			acsApp.postsCreate({
				content: content,
				title: title,
				custom_fields: {
					city: 'beijing'
				},
				tags: 'City',
				photo_id: photo_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createPost');
				var obj = result.body.response.posts[0];
				post_id = obj.id;
				photo_id = obj.photo_id;
				assert.equal(obj.content, content);
				assert.equal(obj.photo_id, photo_id);
				assert.equal(obj.title, title);
				assert.equal(obj.custom_fields.city, 'beijing');
				done();
			});
		});

		it('Should show a post successfully', function(done) {
			acsApp.postsShow({
				post_id: post_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showPosts');
				var obj = result.body.response.posts[0];
				photo_id = obj.photo_id;
				assert.equal(obj.content, content);
				assert.equal(obj.photo_id, photo_id);
				assert.equal(obj.title, 'Good product');
				assert.equal(obj.custom_fields.city, 'beijing');
				done();
			});
		});

		it('Should query posts successfully', function(done) {
			acsApp.postsQuery({
				where: {
					title: 'Good product'
				},
				limit: 20
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryPosts');
				var obj = result.body.response.posts[0];
				assert.equal(obj.content, content);
				assert.equal(obj.title, 'Good product');
				assert.equal(obj.custom_fields.city, 'beijing');
				done();
			});
		});

		it('Should update a post successfully', function(done) {
			var title = 'Perfect product';
			var content = 'This is really a awesome product.';
			acsApp.postsCreate({
				post_id: post_id,
				content: content,
				title: title,
				custom_fields: {
					city: 'shanghai'
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createPost');
				var obj = result.body.response.posts[0];
				assert.equal(obj.content, content);
				assert.equal(obj.title, title);
				assert.equal(obj.custom_fields.city, 'shanghai');
				done();
			});
		});

		it('Should count posts successfully', function(done) {
			acsApp.postsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});
	});

	describe('negative posts tests', function() {
		it('Should fail to create a post without content', function(done) {
			acsApp.postsCreate({
				event_id: event_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Failed to create post: Validation failed - Content can\'t be blank.');
				done();
			});
		});


		it('Should fail to update a post without post_id', function(done) {
			var content = 'This is really a awesome product.';
			acsApp.postsUpdate({
				content: content,
				custom_fields: {
					city: 'shanghai'
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.message, 'Invalid post id');
				done();
			});
		});

		it.skip('Should fail to update a post without content', function(done) {
			var title = 'Perfect product';
			acsApp.postsUpdate({
				post_id: post_id,
				title: title,
				custom_fields: {
					city: 'shanghai'
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});
	});

	describe('cleanup', function() {

		it('Should delte a post successfully', function(done) {
			acsApp.postsDelete({
				post_id: post_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deletePost');
				done();
			});
		});

		it('Should delte a batch posts successfully', function(done) {
			acsApp.postsBatchDelete({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 403);
				assert.equal(result.body.meta.message, 'You are not authorized to perform this action.');
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
