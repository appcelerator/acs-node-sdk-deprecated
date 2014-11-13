var acsObject = {
	Photos: {
		fields: [{
			key: 'acls',
			type: 'string'
		}, {
			key: 'collections',
			type: 'array'
		}, {
			key: 'content_type',
			type: 'string'
		}, {
			key: 'created_at',
			type: 'date'
		}, {
			key: 'custom_fields',
			types: ['string', 'object']
		}, {
			key: 'filename',
			type: 'string'
		}, {
			key: 'id',
			type: 'string'
		}, {
			key: 'md5',
			type: 'string'
		}, {
			key: 'processed',
			type: 'boolean'
		}, {
			key: 'ratings_average',
			type: 'number'
		}, {
			key: 'ratings_count',
			type: 'number'
		}, {
			key: 'ratings_summary',
			type: 'object'
		}, {
			key: 'reviews',
			type: 'array'
		}, {
			key: 'reviews_count',
			type: 'number'
		}, {
			key: 'size',
			type: 'number'
		}, {
			key: 'tags',
			type: 'array'
		}, {
			key: 'title',
			type: 'string'
		}, {
			key: 'updated_at',
			type: 'date'
		}, {
			key: 'urls',
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
				requiredParam: [{
					key: 'photo',
					types: ['object', 'string']
				}],
				optionalParam: [{
					key: 'title',
					type: 'string'
				}, {
					key: 'collection_name',
					type: 'string'
				}, {
					key: 'collection_id',
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
					key: 'photo_sizes',
					type: 'string'
				}, {
					key: 'photo_sync_sizes[]',
					type: 'string'
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [{
					key: 'photo_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}]
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: 'delete',
				requiredParam: [{
					key: 'photo_id',
					type: 'string'
				}],
				optionalParam: [{
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
					type: 'object'
				}, {
					key: 'show_user_like',
					type: 'boolean'
				}, {
					key: 'unsel',
					type: 'object'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			search: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}, {
					key: 'q',
					type: 'string'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'photo_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'response_json_depth',
					type: 'number'
				}, {
					key: 'show_user_like',
					type: 'boolean'
				}]
			},
			update: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'photo_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'title',
					type: 'string'
				}, {
					key: 'collection_name',
					type: 'string'
				}, {
					key: 'collection_id',
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
					key: 'photo_sizes',
					type: 'string'
				}, {
					key: 'photo_sync_sizes[]',
					type: 'string'
				}]
			}
		}
	}
};

module.exports = acsObject;
