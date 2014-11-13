var assert = require('assert'),
	testUtil = require('./testUtil'),
	u = require('../lib/util');

var acsApp = testUtil.getTestACSApp(),
	acsUsername = null,
	acsUserId,
	acsPassword = 'cocoafish',
	acsSubscriptionChannel1,
	acsSubscriptionChannel2,
	acsSubscriptionToken1,
	acsSubscriptionToken2,
	acsSubscriptionsCount,
	acsPayload = {
		alert: 'Push Notifications Test at ' + new Date().toISOString(),
		sound: 'default'
	};


describe('Push Notifications and Logs Test', function() {
	before(function(done) {
		acsApp.clearSession();
		testUtil.generateUsername(function(username) {
			acsUsername = username;
			acsSubscriptionChannel1 = acsUsername + '_test_channel_1';
			acsSubscriptionChannel2 = acsUsername + '_test_channel_2';
			acsSubscriptionToken1 = acsUsername + '_test_token_1';
			acsSubscriptionToken2 = acsUsername + '_test_token_2';
			console.log('\tGenerated acs user: %s', acsUsername);
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
				assert(result.body.response.users[0].id);
				acsUserId = result.body.response.users[0].id;
				assert(result.cookieString);
				acsApp.setSessionByCookieString(result.cookieString);
				done();
			});
		});
	});

	describe('.subscribeAndUpdateTokensToUsers', function() {
		it('Should count subscriptions successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'push_notificationCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent push subscriptions count: %s', result.body.meta.count);
				acsSubscriptionsCount = result.body.meta.count;
				done();
			});
		});

		it('Should subscribe device token successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsSubscribe({
				type: 'gcm',
				channel: acsSubscriptionChannel1,
				device_token: acsSubscriptionToken1
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'SubscribeNotification');
				done();
			});
		});

		it('Should return increased subscription count correctly', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'push_notificationCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent push subscriptions count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsSubscriptionsCount + 1);
				done();
			});
		});

		it('Should update subscription successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsUpdateSubscription({
				device_token: acsSubscriptionToken1,
				loc: [-122.050315, 37.389772]
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'UpdateSubscription');
				done();
			});
		});
	});

	describe('.setAndResetBadges', function() {
		it('Should set badge successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsSetBadge({
				device_token: acsSubscriptionToken1,
				badge_number: 100
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'setBadge');
				done();
			});
		});

		it('Should query subscription correctly after setting badge', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsQuery({
				user_id: acsUserId,
				device_token: acsSubscriptionToken1
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'querySubscriptions');
				assert(result.body.response);
				assert(result.body.response.subscriptions);
				assert.equal(result.body.response.subscriptions[0].badge_number, 100);
				done();
			});
		});

		it('Should reset badge successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsResetBadge({
				device_token: acsSubscriptionToken1
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'resetBadge');
				done();
			});
		});

		it('Should query subscription correctly after resetting badge', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsQuery({
				user_id: acsUserId,
				device_token: acsSubscriptionToken1
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'querySubscriptions');
				assert(result.body.response);
				assert(result.body.response.subscriptions);
				assert.equal(result.body.response.subscriptions[0].badge_number, 0);
				done();
			});
		});

		it('Should set badge again successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsSetBadge({
				device_token: acsSubscriptionToken1,
				badge_number: 200
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'setBadge');
				done();
			});
		});

		it('Should query subscription correctly again after setting badge', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsQuery({
				user_id: acsUserId,
				device_token: acsSubscriptionToken1
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'querySubscriptions');
				assert(result.body.response);
				assert(result.body.response.subscriptions);
				assert.equal(result.body.response.subscriptions[0].badge_number, 200);
				done();
			});
		});

		it.skip('Should reset all badges successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsResetAllBadges(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				console.log(result);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'resetBadge');
				done();
			});
		});

		it.skip('Should query subscription correctly after setting badge', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsQuery({
				user_id: acsUserId,
				device_token: acsSubscriptionToken1
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'querySubscriptions');
				assert(result.body.response);
				assert(result.body.response.subscriptions);
				assert.equal(result.body.response.subscriptions[0].badge_number, 0);
				done();
			});
		});
	});

	describe('.subscribeTokens', function() {
		it('Should count subscriptions successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'push_notificationCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent push subscriptions count: %s', result.body.meta.count);
				acsSubscriptionsCount = result.body.meta.count;
				done();
			});
		});

		it('Should subscribe device token successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsSubscribeToken({
				type: 'gcm',
				channel: acsSubscriptionChannel2,
				device_token: acsSubscriptionToken2
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'SubscribeNotificationByToken');
				done();
			});
		});

		it('Should return increased subscription count correctly', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'push_notificationCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent push subscriptions count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsSubscriptionsCount + 1);
				done();
			});
		});
	});

	describe('.queryAndShowChannels', function() {
		it('Should query channel successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsQueryChannels(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryPushChannels');
				assert(result.body.response);
				assert(result.body.response.push_channels);
				assert(u.inArray(acsSubscriptionChannel1, result.body.response.push_channels));
				done();
			});
		});

		it.skip('Should show channel successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsShowChannels({
				name: acsSubscriptionChannel1
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				console.log(JSON.stringify(result.body, null, 2));
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'showPushChannels');
				assert(result.body.response);
				assert(result.body.response.push_channels);
				assert(u.inArray(acsSubscriptionChannel1, result.body.response.push_channels));
				done();
			});
		});
	});

	describe.skip('.notifyAndNotifyTokens', function() {
		it('Should notify successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsNotify({
				channel: acsSubscriptionChannel1,
				to_ids: acsUserId,
				payload: acsPayload
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'Notify');
				done();
			});
		});

		it('Should notify tokens successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsNotifyTokens({
				channel: acsSubscriptionChannel1,
				to_tokens: acsSubscriptionToken2,
				payload: acsPayload
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'NotifyTokens');
				done();
			});
		});
	});

	describe('.queryPushLogs', function() {
		it.skip('Should query push log successfully', function(done) {
			this.timeout(20000);
			acsApp.logsQueryPushLogs(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				console.log(JSON.stringify(result.body, null, 2));
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'queryPushChannels');
				assert(result.body.response);
				assert(result.body.response.push_channels);
				assert(u.inArray(acsSubscriptionChannel1, result.body.response.push_channels));
				done();
			});
		});

		it.skip('Should query push detail log successfully', function(done) {
			this.timeout(20000);
			done();
		});
	});

	describe('.unsubscribeTokensFromUsers', function() {
		it('Should unsubscribe device token successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsUnsubscribe({
				device_token: acsSubscriptionToken1
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'UnsubscribeNotification');
				done();
			});
		});

		it('Should query subscription correctly after unsubscription', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsQuery({
				user_id: acsUserId,
				device_token: acsSubscriptionToken1
			}, function(err, result) {
				assert.ifError(err);
				assert(result);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'querySubscriptions');
				assert(result.body.response);
				assert(result.body.response.subscriptions);
				assert.equal(result.body.response.subscriptions.length, 0);
				done();
			});
		});
	});

	describe('.unsubscribeTokens', function() {
		it('Should count subscriptions successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'push_notificationCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent push subscriptions count: %s', result.body.meta.count);
				acsSubscriptionsCount = result.body.meta.count;
				done();
			});
		});

		it('Should unsubscribe device token successfully', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsUnsubscribeToken({
				device_token: acsSubscriptionToken2
			}, function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'UnsubscribeNotificationByToken');
				done();
			});
		});

		it('Should return decreased subscription count correctly', function(done) {
			this.timeout(20000);
			acsApp.pushNotificationsCount(function(err, result) {
				assert.ifError(err);
				assert(result.body);
				assert(result.body.meta);
				assert.equal(result.body.meta.code, 200);
				assert.equal(result.body.meta.method_name, 'push_notificationCount');
				assert(result.body.meta.count || (result.body.meta.count === 0));
				console.log('\tCurrent push subscriptions count: %s', result.body.meta.count);
				assert.equal(result.body.meta.count, acsSubscriptionsCount - 1);
				done();
			});
		});
	});

	describe('.deleteUser', function() {
		it('Should delete user successfully', function(done) {
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
