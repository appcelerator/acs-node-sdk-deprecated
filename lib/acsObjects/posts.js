var acsObject = {
	Posts: {
		fields: [{
			key: 'acls',
			type: 'object'
		}, {
			key: 'created_at',
			type: 'date'
		}, {
			key: 'id',
			type: 'string'
		}, {
			key: 'content',
			type: 'string'
		}, {
			key: 'photo',
			type: 'object'
		}, {
			key: 'user',
			type: 'object'
		}, {
			key: 'updated_at',
			type: 'object'
		}, {
			key: 'custom_fields',
			type: 'string'
		}, {
			key: 'event',
			type: 'string'
		}, {
			key: 'ratings_average',
			type: 'number'
		}, {
			key: 'ratings_count',
			type: 'number'
		}, {
			key: 'ratings_summary ',
			type: 'object'
		}, {
			key: 'reviews',
			type: 'object'
		}, {
			key: 'reviews_count',
			type: 'number'
		}, {
			key: 'tags',
			type: 'string'
		}, {
			key: 'title',
			type: 'string'
		}, {
			key: 'updated_at',
			type: 'date'
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
				optionalParam: [{
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			create: {
				httpMethod: 'POST',
				requiredParam: [{
					key: 'content',
					type: 'string'
				}],
				optionalParam: [{
					key: 'title',
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
				requiredParam: [],
				optionalParam: [{
					key: 'post_id',
					type: 'string'
				}, {
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
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'title',
					type: 'string'
				}, {
					key: 'event_id',
					type: 'string'
				}, {
					key: 'tags_array',
					type: 'string'
				}, {
					key: 'ratings_average',
					type: 'number'
				}, {
					key: 'ratings_count',
					type: 'number'
				}, {
					key: 'reviews_count',
					type: 'number'
				}, {
					key: 'created_at',
					type: 'date'
				}, {
					key: 'updated_at',
					type: 'date'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'post_id',
					type: 'string'
				}, {
					key: 'post_ids',
					type: 'string'
				}, {
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
				httpMethod: 'POST',
				requiredParam: [{
					key: 'post_id',
					type: 'string'
				}, {
					key: 'content',
					type: 'string'
				}],
				optionalParam: [{
					key: 'title',
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
