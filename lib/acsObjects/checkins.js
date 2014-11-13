var acsObject = {
	Checkins: {
		fields: [{
			key: 'custom_fields',
			type: 'string'
		}, {
			key: 'created_at',
			type: 'date'
		}, {
			key: 'event',
			type: 'object'
		}, {
			key: 'id',
			type: 'string'
		}, {
			key: 'message',
			type: 'string'
		}, {
			key: 'place',
			type: 'object'
		}, {
			key: 'photo',
			type: 'object'
		}, {
			key: 'tags',
			type: 'string'
		}, {
			key: 'updated_at',
			type: 'object'
		}, {
			key: 'user',
			type: 'object'
		}],
		methods: {
			batchDelete: {
				httpMethod: 'DELETE',
				restMethod: 'batch_delete',
				requiredParam: [],
				optionalParam: [{
					key: 'where',
					type: 'object'
				}]
			},
			count: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: []
			},
			create: {
				httpMethod: 'POST',
				requiredParam: [],
				optionalParam: [{
					key: 'place_id',
					type: 'string'
				}, {
					key: 'event_id',
					type: 'string'
				}, {
					key: 'message',
					type: 'string'
				}, {
					key: 'photo',
					types: ['object', 'string']
				}, {
					key: 'photo_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}, {
					key: 'tags',
					type: 'string'
				}, {
					key: 'custom_fields',
					type: ['string', 'object']
				}, {
					key: 'acl_name',
					type: 'string'
				}, {
					key: 'acs_id',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [{
					key: 'checkin_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'pretty_json',
					type: 'boolean'
				}, {
					key: 'user_id',
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
					key: 'limit',
					type: 'number'
				}, {
					key: 'skip',
					type: 'number'
				}, {
					key: 'where',
					type: 'object'
				}, {
					key: 'order',
					type: 'string'
				}, {
					key: 'sel',
					type: 'string'
				}, {
					key: 'show_user_like',
					type: 'boolean'
				}, {
					key: 'unsel',
					type: 'string'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'checkin_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'response_json_depth',
					type: 'number'
				}, {
					key: 'show_user_like',
					type: 'boolean'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			update: {
				httpMethod: 'POST',
				requiredParam: [{
					key: 'checkin_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'place_id',
					type: 'string'
				}, {
					key: 'event_id',
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
					key: 'pretty_json',
					type: 'boolean'
				}, {
					key: 'tags',
					type: 'string'
				}, {
					key: 'custom_fields',
					type: ['string', 'object']
				}, {
					key: 'acl_name',
					type: 'string'
				}, {
					key: 'acs_id',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}]
			}
		}
	}
};

module.exports = acsObject;
