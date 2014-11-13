var acsObject = {
	PushNotifications: {
		restObject: 'push_notification',
		methods: {
			queryChannels: {
				httpMethod: 'GET',
				restMethod: 'channels/query',
				requiredParam: [],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}, {
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}]
			},
			showChannels: {
				httpMethod: 'GET',
				restMethod: 'channels/show',
				requiredParam: [{
					key: 'name',
					type: 'string'
				}],
				optionalParam: []
			},
			count: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: []
			},
			notify: {
				httpMethod: 'POST',
				requiredParam: [{
					key: 'channel',
					type: 'string'
				}, {
					key: 'to_ids',
					type: 'string'
				}, {
					key: 'payload',
					types: ['object', 'string']
				}],
				optionalParam: [{
					key: 'friends',
					types: ['boolean', 'number', 'object', 'string']
				}, {
					key: 'options',
					type: 'object'
				}, {
					key: 'where',
					type: 'object'
				}]
			},
			notifyTokens: {
				httpMethod: 'POST',
				restMethod: 'notify_tokens',
				requiredParam: [{
					key: 'channel',
					type: 'string'
				}, {
					key: 'to_tokens',
					type: 'string'
				}, {
					key: 'payload',
					types: ['object', 'string']
				}],
				optionalParam: [{
					key: 'options',
					type: 'object'
				}, {
					key: 'where',
					type: 'object'
				}]
			},
			query: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'user_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'channel',
					type: 'string'
				}, {
					key: 'device_token',
					type: 'string'
				}, {
					key: 'type',
					type: 'string'
				}, {
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}, {
					key: 'limit',
					type: 'number'
				}, {
					key: 'skip',
					type: 'number'
				}]
			},
			resetAllBadges: {
				httpMethod: 'GET',
				restMethod: 'reset_badge',
				requiredParam: [],
				optionalParam: []
			},
			resetBadge: {
				httpMethod: 'PUT',
				restMethod: 'reset_badge',
				requiredParam: [{
					key: 'device_token',
					type: 'string'
				}],
				optionalParam: []
			},
			setBadge: {
				httpMethod: 'PUT',
				restMethod: 'set_badge',
				requiredParam: [],
				optionalParam: [{
					key: 'device_token',
					type: 'string'
				}, {
					key: 'badge_number',
					types: ['number', 'string']
				}]
			},
			subscribe: {
				httpMethod: 'POST',
				requiredParam: [{
					key: 'type',
					type: 'string'
				}, {
					key: 'channel',
					type: 'string'
				}, {
					key: 'device_token',
					type: 'string'
				}],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}]
			},
			subscribeToken: {
				httpMethod: 'POST',
				restMethod: 'subscribe_token',
				requiredParam: [{
					key: 'type',
					type: 'string'
				}, {
					key: 'channel',
					type: 'string'
				}, {
					key: 'device_token',
					type: 'string'
				}],
				optionalParam: [{
					key: 'type',
					type: 'string'
				}]
			},
			updateSubscription: {
				httpMethod: 'PUT',
				restMethod: 'subscription/update',
				requiredParam: [{
					key: 'device_token',
					type: 'string'
				}],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}, {
					key: 'loc',
					type: 'array'
				}]
			},
			unsubscribe: {
				httpMethod: 'DELETE',
				requiredParam: [{
					key: 'device_token',
					type: 'string'
				}],
				optionalParam: [{
					key: 'channel',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}]
			},
			unsubscribeToken: {
				httpMethod: 'DELETE',
				restMethod: 'unsubscribe_token',
				requiredParam: [{
					key: 'device_token',
					type: 'string'
				}],
				optionalParam: [{
					key: 'channel',
					type: 'string'
				}]
			}
		}
	}
};

module.exports = acsObject;
