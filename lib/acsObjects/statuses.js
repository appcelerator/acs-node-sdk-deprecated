var acsObject = {
	Statuses: {
		fields: [{
			key: 'acls',
			type: 'object'
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
			key: 'photo',
			type: 'object'
		}, {
			key: 'place',
			type: 'object'
		}, {
			key: 'user',
			type: 'object'
		}, {
			key: 'updated_at',
			type: 'object'
		}, {
			key: 'tags',
			type: 'string'
		}],
		methods: {
			batchDelete: {
				httpMethod: 'DELETE',
				restMethod: 'batch_delete',
				requiredParam: [],
				optionalParam: [{
					key: 'where',
					type: 'string'
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
					key: 'message',
					type: 'string'
				}, {
					key: 'place_id',
					type: 'string'
				}, {
					key: 'event_id',
					type: 'string'
				}, {
					key: 'photo',
					type: 'object'
				}, {
					key: 'photo_id',
					type: 'string'
				}, {
					key: 'tags',
					type: 'string'
				}, {
					key: 'custom_fields',
					types: ['string', 'object']
				}, {
					key: 'acl_name',
					type: 'string'
				}, {
					key: 'acl_id',
					type: 'string'
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
				requiredParam: [{
					key: 'status_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
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
					types: ['string', 'object']
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
					key: 'status_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'pretty_json',
					type: 'boolean'
				}, {
					key: 'show_user_like',
					type: 'boolean'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			update: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'status_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'message',
					type: 'string'
				}, {
					key: 'place_id',
					type: 'string'
				}, {
					key: 'event_id',
					type: 'string'
				}, {
					key: 'photo',
					type: 'object'
				}, {
					key: 'photo_id',
					type: 'string'
				}, {
					key: 'tags',
					type: 'string'
				}, {
					key: 'custom_fields',
					types: ['string', 'object']
				}, {
					key: 'acl_name',
					type: 'string'
				}, {
					key: 'acl_id',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			}
		}
	}
};

module.exports = acsObject;
