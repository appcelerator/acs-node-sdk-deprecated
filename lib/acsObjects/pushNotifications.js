var acsObject = {
	PushNotifications: {
		restObject: 'push_notification',
		methods: {
			queryChannels: {
				httpMethod: 'GET',
				restMethod: 'channels/query'
			},
			showChannels: {
				httpMethod: 'GET',
				restMethod: 'channels/show'
			},
			count: {
				httpMethod: 'GET'
			},
			notify: {
				httpMethod: 'POST'
			},
			notifyTokens: {
				httpMethod: 'POST',
				restMethod: 'notify_tokens'
			},
			query: {
				httpMethod: 'GET'
			},
			resetAllBadges: {
				httpMethod: 'GET',
				restMethod: 'reset_badge'
			},
			resetBadge: {
				httpMethod: 'PUT',
				restMethod: 'reset_badge'
			},
			setBadge: {
				httpMethod: 'PUT',
				restMethod: 'set_badge'
			},
			subscribe: {
				httpMethod: 'POST'
			},
			subscribeToken: {
				httpMethod: 'POST',
				restMethod: 'subscribe_token'
			},
			updateSubscription: {
				httpMethod: 'PUT',
				restMethod: 'subscription/update'
			},
			unsubscribe: {
				httpMethod: 'DELETE'
			},
			unsubscribeToken: {
				httpMethod: 'DELETE',
				restMethod: 'unsubscribe_token'
			}
		}
	}
};

module.exports = acsObject;
