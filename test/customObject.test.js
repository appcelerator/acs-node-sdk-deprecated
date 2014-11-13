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
	classname = 'Beijing',
	classname2 = 'Tianjing',
	classname3 = 'Shanghai',
	obj_id = null,
	obj_id2 = null,
	photo_id = null,
	tags = 'sdk,test';


describe('Custom Objects Tests', function() {
	this.timeout(50000);
	before(function(done) {
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			console.log('\tGenerated acs user: %s', acsUsername);
			done();
		});
	});

	describe('create user', function() {
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

	describe('positive custom objects tests', function() {
		it('Should create a custom object successfully', function(done) {
			acsApp.customObjectsCreate({
				classname: classname,
				fields: {'city':'beijing'}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createObject');
				var obj = result.body.response[classname][0];
				assert.equal(obj.city, 'beijing');
				obj_id = obj.id;
				done();
			});
		});

		it('Should create a custom object(photo) successfully', function(done) {
			acsApp.customObjectsCreate({
				classname: classname2,
				fields: {'city':'tianjing'},
				photo: fs.createReadStream(__dirname + '/files/appcelerator.png')
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createObject');
				var obj = result.body.response[classname2][0];
				obj_id2 = obj.id;
				photo_id = obj.photo_id;
				assert.equal(obj.city, 'tianjing');
				//                testUtil.processWait(acsApp, "photo", photo_id, done, 5000);
				done();
			});
		});

		it('Should create a custom object(photo_id,tags) successfully', function(done) {
			acsApp.customObjectsCreate({
				classname: classname3,
				fields: {'city':'shanghai', 'coordinates':[-122.1, 37.1] },
				photo_id: photo_id,
				tags: tags
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'createObject');
				var obj = result.body.response[classname3][0];
				photo_id = obj.photo_id;
				assert.equal(obj.city, 'shanghai');
				assert.equal(obj.tags, tags);
				//                testUtil.processWait(acsApp, "photo", photo_id, done, 5000);
				done();
			});
		});

		it('Should show a custom object(classname) successfully', function(done) {
			acsApp.customObjectsShow({
				id: obj_id,
				classname: classname
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showObjects');
				var obj = result.body.response[classname][0];
				assert.equal(obj.city, 'beijing');
				done();
			});
		});

		it('Should show a custom object(classname2) successfully', function(done) {
			acsApp.customObjectsShow({
				id: obj_id2,
				classname: classname2
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showObjects');
				var obj = result.body.response[classname2][0];
				assert.equal(obj.city, 'tianjing');
				done();
			});
		});

		it('Should query custom objects successfully - query', function(done) {
			acsApp.customObjectsQuery({
				classname: classname
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);

				done();
			});
		});

		it('Should query 0 custom object successfully', function(done) {
			acsApp.customObjectsQuery({
				classname: classname,
				where: {
					'city': 'chongqing'
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.response[classname].length, 0);
				done();
			});
		});

		it('Should query 1 custom object successfully', function(done) {
			acsApp.customObjectsQuery({
				classname: classname,
				where: {
					'city': 'beijing'
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.response[classname].length > 0, true);
				done();
			});
		});

		it('Should query 1 custom object successfully', function(done) {
			acsApp.customObjectsQuery({
				classname: classname,
				where: {}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.response[classname].length > 0, true);
				done();
			});
		});

		it('Should update a custom object successfully', function(done) {
			acsApp.customObjectsUpdate({
				id: obj_id,
				classname: classname,
				fields: {'city': 'tianjing'}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'updateCustomObject');
				var obj = result.body.response[classname][0];
				assert.equal(obj.city, 'tianjing');
				obj_id = obj.id;
				done();
			});
		});

		it('Should fail to update a custom object with no-existing fields', function(done) {
			acsApp.customObjectsUpdate({
				id: obj_id,
				classname: 'space'
			}, function(err) {
				assert.equal(err !== undefined, true);
				assert.equal(err.message, 'Required parameter fields is missing.');
				done();
			});
		});

		it('Should count custom objects successfully - count', function(done) {
			acsApp.customObjectsCount({
				classname: classname
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'objectsCount');
				done();
			});
		});

		it('Should delete a custom object successfully', function(done) {
			acsApp.customObjectsDelete({
				classname: classname,
				id: obj_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'deleteObjects');

				done();
			});
		});

		it('Should fail to batch delete custom objects', function(done) {
			acsApp.customObjectsBatchDelete({
				classname: classname
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 403);
				done();
			});
		});

		it('Should fail to drop custom object collections', function(done) {
			acsApp.customObjectsAdminDropCollection({
				classname: classname
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				assert.equal(result.body.meta.method_name, 'dropCollection');
				done();
			});
		});

	});

	describe('negative custom objects tests', function() {
		it('Should fail to create a custom object without fields', function(done) {
			acsApp.customObjectsCreate({
				classname: classname
			}, function(err) {
				assert.equal(err !== undefined, true);
				assert.equal(err.message, 'Required parameter fields is missing.');
				done();
			});
		});

		it('Should fail to create a custom object without classname', function(done) {
			acsApp.customObjectsCreate({
				fields: {'city':'beijing'}
			}, function(err) {
				assert.equal(err !== undefined, true);
				assert.equal(err.message, 'Required parameter classname is missing.');
				done();
			});
		});

		it('Should fail to update a custom object with invalid id and invalid fields', function(done) {
			acsApp.customObjectsUpdate({
				id: obj_id,
				classname: classname
			}, function(err) {
				assert.equal(err !== undefined, true);
				assert.equal(err.message, 'Required parameter fields is missing.');
				done();
			});
		});

		it('Should fail to show a custom object with invalid id', function(done) {
			acsApp.customObjectsShow({
				id: '5457657cdda0954dfe000016',
				classname: classname2
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				done();
			});
		});

		it('Should fail to show custom objects with invalid ids', function(done) {
			acsApp.customObjectsShow({
				ids: '5457657cdda0954dfe000016,5457657cdda0954dfe000017',
				classname: classname2
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				done();
			});
		});

		it('Should fail to delete a no-existing custom object(invalid id)', function(done) {
			acsApp.customObjectsDelete({
				classname: classname,
				id: obj_id
			}, function(err, result) {
				assert.ifError(err);
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
				done();
			});
		});

		it('Should fail to delete a no-existing custom object(invalid classname)', function(done) {
			acsApp.customObjectsDelete({
				classname: 'space',
				id: obj_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 400);
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
