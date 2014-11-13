var acsObject = {
	Chats: {
		fields: [{
			key: 'chatgroup',
			type: 'date'
		}, {
			key: 'created_at',
			type: 'date'
		}, {
			key: 'custom_fields',
			type: 'date'
		}, {
			key: 'id',
			type: 'date'
		}, {
			key: 'updated_at',
			type: 'date'
		}, {
			key: 'message',
			type: 'string'
		}, {
			key: 'photo',
			type: 'object'
		}],
		methods: {
			count: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			create: {
				httpMethod: 'POST',
				requiredParam: [],
				optionalParam: [{
					key: 'to_ids',
					type: 'string'
				}, {
					key: 'chat_group_id',
					type: 'string'
				}, {
					key: 'message',
					type: 'string'
				}, {
					key: 'photo',
					type: 'string'
				}, {
					key: 'photo_id',
					type: 'string'
				}, {
					key: 'custom_fields',
					type: 'string'
				}, {
					key: 'channel',
					type: 'string'
				}, {
					key: 'payload',
					types: ['object', 'string']
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [],
				optionalParam: [{
					key: 'chat_id',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			getChatGroups: {
				httpMethod: 'GET',
				restMethod: 'get_chat_groups',
				requiredParam: [],
				optionalParam: [{
					key: 'page',
					type: 'string'
				}, {
					key: 'per_page',
					type: 'string'
				}, {
					key: 'where',
					type: 'string'
				}, {
					key: 'order',
					type: 'string'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			query: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'participate_ids',
					type: 'string'
				}, {
					key: 'chat_group_id',
					type: 'string'
				}, {
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
					type: 'string'
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
			queryChatGroups: {
				httpMethod: 'GET',
				restMethod: 'query_chat_groups',
				requiredParam: [],
				optionalParam: [{
					key: 'participate_ids',
					type: 'string'
				}, {
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
					type: 'string'
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
			}
		}
	}
};

module.exports = acsObject;
