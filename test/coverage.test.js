var assert = require('assert'),
	testUtil = require('./testUtil'),
	u = require('../lib/util'),
	ACSError = require('../lib/acsError'),
	messages = require('../lib/messages');

var acsApp = testUtil.getTestACSApp();


describe('Code Coverage Test', function() {
	before(function(done) {
		acsApp.clearSession();
		done();
	});

	describe('.acsError', function() {
		it('Should throw a general ACS error', function(done) {
			try {
				throw new ACSError();
			} catch (e) {
				assert(e);
				assert.equal(e.errorCode, 0);
				assert.equal(e.docUrl, null);
				assert.equal(e.message, 'ACS Node SDK Error');
			}
			done();
		});

		it('Should throw an ACS error with error message', function(done) {
			try {
				throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
					parameter: 'test missing field'
				});
			} catch (e) {
				assert.equal(e.errorCode, 1001);
				assert.equal(e.message, 'Required parameter test missing field is missing.');
			}
			done();
		});
	});

	describe('.utility', function() {
		it('Should return variable types correctly', function(done) {
			assert.equal(u.typeOf(null), 'null');
			assert.equal(u.typeOf(['item1', 'item2']), 'array');
			assert.equal(u.typeOf(new Date()), 'date');
			assert.equal(u.typeOf(true), 'boolean');
			assert.equal(u.typeOf(8), 'number');
			assert.equal(u.typeOf(function() {}), 'function');
			assert.equal(u.typeOf(/test/), 'regexp');
			assert.equal(u.typeOf({
				key: 'value'
			}), 'object');
			done();
		});
		it('Should recognize if a value is in an array or not correctly', function(done) {
			var testArray = ['item1', 'item2'];
			assert.equal(u.inArray(testArray[0], testArray), true);
			assert.equal(u.inArray('item', testArray), false);
			done();
		});
	});

	describe('.acsApp', function() {
		it('Should list ACS collection correctly', function(done) {
			var acsCollection = acsApp.getACSCollection();
			assert(acsCollection);
			assert(acsCollection.ACLs);
			assert(acsCollection.Chats);
			assert(acsCollection.Checkins);
			assert(acsCollection.Clients);
			assert(acsCollection.CustomObjects);
			assert(acsCollection.Emails);
			assert(acsCollection.Events);
			assert(acsCollection.Files);
			assert(acsCollection.Friends);
			assert(acsCollection.KeyValues);
			assert(acsCollection.Likes);
			assert(acsCollection.Logs);
			assert(acsCollection.Messages);
			assert(acsCollection.PhotoCollections);
			assert(acsCollection.Photos);
			assert(acsCollection.Places);
			assert(acsCollection.Posts);
			assert(acsCollection.PushNotifications);
			assert(acsCollection.PushSchedules);
			assert(acsCollection.Reviews);
			assert(acsCollection.SocialIntegrations);
			assert(acsCollection.Statuses);
			assert(acsCollection.Users);
			done();
		});

		it('Should not create ACSApp instance if parameters are wrong', function(done) {
			var testACSApp = null;
			try {
				testACSApp = require('../index')();
			} catch (e) {
				assert(e);
				assert.equal(e.errorCode, 1001);
			}
			try {
				testACSApp = require('../index')(true);
			} catch (e) {
				assert(e);
				assert.equal(e.errorCode, 1002);
			}
			try {
				testACSApp = require('../index')('ACSKey', 'wrong_parameter');
			} catch (e) {
				assert(e);
				assert.equal(e.errorCode, 1002);
			}
			done();
		});

		it('Should create ACSApp with customized entry point successfully', function(done) {
			var acsKey = 'ACSKey';
			var testEntryPoint = 'https://api-test.cloud.appcelerator.com';
			var testACSApp = require('../index')(acsKey, {
				apiEntryPoint: testEntryPoint
			});
			assert(testACSApp);
			assert.equal(testACSApp.appKey, acsKey);
			assert(testACSApp.appOptions);
			assert.equal(testACSApp.appOptions.apiEntryPoint, testEntryPoint);
			done();
		});

		it('Should create ACSApp with default entry point successfully', function(done) {
			var acsKey = 'ACSKey';
			var defaultEntryPoint = 'https://api.cloud.appcelerator.com';
			var testACSApp = require('../index')(acsKey, {});
			assert(testACSApp);
			assert.equal(testACSApp.appKey, acsKey);
			assert(testACSApp.appOptions);
			assert.equal(testACSApp.appOptions.apiEntryPoint, defaultEntryPoint);
			done();
		});
	});
});
