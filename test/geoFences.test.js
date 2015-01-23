var assert = require('assert'),
	testUtil = require('./testUtil');

var acsEntryPoint = (process.env.ACS_ENTRYPOINT ? process.env.ACS_ENTRYPOINT : 'https://api.cloud.appcelerator.com');
var acsKey = process.env.ACS_APPKEY;
if (!acsKey) {
	console.error('Please create an ACS app and assign ACS_APPKEY in environment vars.');
	process.exit(1);
}
console.log('ACS Entry Point: %s', acsEntryPoint);
console.log('MD5 of ACS_APPKEY: %s', testUtil.md5(acsKey));

var ACSNode = require('../index'),
	acsApp = new ACSNode(acsKey, {
		apiEntryPoint: acsEntryPoint,
		prettyJson: true
	}),
	geo_fence_id = null;

describe('Geo Fence Test', function() {
	this.timeout(50000);
	describe('login admin user', function() {
		it('Should login an admin user successfully', function(done) {
			acsApp.usersLogin({
				login: 'admin',
				password: 'cocoafish'
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'loginUser');
				assert(result.body.response);
				assert(result.body.response.users);
				assert(result.body.response.users[0]);
				assert.equal(result.body.response.users[0].admin, 'true');
				done();
			});
		});
	});

	describe('positive geo fences tests', function() {
		it('Should create a geo fence successfully - create', function(done) {
			acsApp.geoFencesCreate({
				geo_fence: {
					'loc':{'coordinates':[-122.4167,37.7833], 'radius':'10/3959'},
					'payload':{'alert':'24-hour sale at our SF flagship store on 12/26!'},
					'start_time': '2020-03-08T00:00',
					'end_time':'2020-12-26T19:00'
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				var obj = result.body.response.geo_fences[0];
				geo_fence_id = obj.id;
				done();
			});
		});

		it('Should update the geo fence successfully - update', function(done) {
			acsApp.geoFencesUpdate({
				id: geo_fence_id,
				geo_fence: {
					'loc':{
						'coordinates':[-122.4167,37.7833],
						'radius':'2/6371'
					}
				}
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				var obj = result.body.response.geo_fences[0];
				assert.equal(obj.id, geo_fence_id);
				assert.equal(obj.loc.radius, '2/6371');
				done();
			});
		});

		it('Should get the count of geo fences successfully - count', function(done) {
			acsApp.geoFencesCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);

				done();
			});
		});

		it('Should query geo fences successfully - query', function(done) {
			acsApp.geoFencesQuery({}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert(result.body.response);
				assert(result.body.response.geo_fences);
				done();
			});
		});
	});

	describe('negative geo fences tests', function() {
		it('Should fail to create a geo fence without geo_fence - create', function(done) {
			acsApp.geoFencesCreate({}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				done();
			});
		});

		it('Should fail to update the geo fence without id - update', function(done) {
			acsApp.geoFencesUpdate({}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				done();
			});
		});

		it('Should fail to delete the geo fence without id - delete', function(done) {
			acsApp.geoFencesDelete({}, function(err) {
				assert(err);
				assert.equal(err.statusCode, 400);
				done();
			});
		});
	});

	describe('cleanup', function() {
		it('Should remove the geo fence successfully - remove', function(done) {
			acsApp.geoFencesDelete({
				id: geo_fence_id
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				done();
			});
		});
	});

});
