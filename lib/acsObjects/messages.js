var acsObject = {
	Messages: {
		fields: [{
			key: 'body',
			type: 'string'
		}, {
			key: 'created_at',
			type: 'date'
		}, {
			key: 'from',
			type: 'object'
		}, {
			key: 'id',
			type: 'string'
		}, {
			key: 'status',
			type: 'string'
		}, {
			key: 'subject',
			type: 'string'
		}, {
			key: 'thread_id',
			type: 'string'
		}, {
			key: 'to',
			type: 'object'
		}, {
			key: 'updated_at',
			type: 'object'
		}],
		methods: {
			count: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: []
			},
			create: {
				httpMethod: 'POST',
				requiredParam: [{
					key: 'to_ids',
					type: 'string'
				}, {
					key: 'body',
					type: 'string'
				}],
				optionalParam: [{
					key: 'subject',
					type: 'string'
				}, {
					key: 'custom_fields',
					types: ['string', 'object']
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [],
				optionalParam: [{
					key: 'message_id',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}]
			},
			deleteThread: {
				httpMethod: 'DELETE',
				restMethod: 'delete/thread',
				requiredParam: [],
				optionalParam: [{
					key: 'thread_id',
					type: 'string'
				}]
			},
			query: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}, {
					key: 'limit',
					type: 'number'
				}, {
					key: 'skip',
					type: 'number'
				}, {
					key: 'where',
					types: ['string', 'object']
				}, {
					key: 'order',
					type: 'string'
				}, {
					key: 'sel',
					type: 'string'
				}, {
					key: 'unsel',
					type: 'string'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			reply: {
				httpMethod: 'POST',
				requiredParam: [],
				optionalParam: [{
					key: 'message_id',
					type: 'string'
				}, {
					key: 'body',
					type: 'string'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'message_id',
					type: 'string'
				}],
				optionalParam: []
			},
			showInbox: {
				httpMethod: 'GET',
				restMethod: 'show/inbox',
				requiredParam: [],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}]
			},
			showSent: {
				httpMethod: 'GET',
				restMethod: 'show/sent',
				requiredParam: [],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}]
			},
			showThread: {
				httpMethod: 'GET',
				restMethod: 'show/thread',
				requiredParam: [{
					key: 'thread_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}]
			},
			showThreads: {
				httpMethod: 'GET',
				restMethod: 'show/threads',
				requiredParam: [],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}]
			}
		}
	}
};

module.exports = acsObject;
