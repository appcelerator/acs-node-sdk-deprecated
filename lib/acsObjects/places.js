var acsObject = {
	Places: {
		fields: [{
			key: 'acls',
			type: 'array'
		}, {
			key: 'address',
			type: 'string'
		}, {
			key: 'city',
			type: 'string'
		}, {
			key: 'country',
			type: 'string'
		}, {
			key: 'custom_fields',
			types: ['string', 'object']
		}, {
			key: 'latitude',
			type: 'number'
		}, {
			key: 'longitude',
			type: 'number'
		}, {
			key: 'name',
			type: 'string'
		}, {
			key: 'phone_number',
			type: 'string'
		}, {
			key: 'photo',
			type: 'object'
		}, {
			key: 'postal_code',
			type: 'string'
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
			key: 'state',
			type: 'string'
		}, {
			key: 'tags',
			type: 'array'
		}, {
			key: 'twitter',
			type: 'string'
		}, {
			key: 'user',
			type: 'object'
		}, {
			key: 'website',
			type: 'string'
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
					key: 'name',
					type: 'string'
				}],
				optionalParam: [{
					key: 'address',
					type: 'string'
				}, {
					key: 'city',
					type: 'string'
				}, {
					key: 'state',
					type: 'string'
				}, {
					key: 'postal_code',
					type: 'string'
				}, {
					key: 'country',
					type: 'string'
				}, {
					key: 'latitude',
					type: 'number'
				}, {
					key: 'longitude',
					type: 'number'
				}, {
					key: 'website',
					type: 'string'
				}, {
					key: 'twitter',
					type: 'string'
				}, {
					key: 'phone_number',
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
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [{
					key: 'place_id',
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
					key: 'place_id',
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
					key: 'response_json_depth',
					type: 'number'
				}, {
					key: 'latitude',
					type: 'number'
				}, {
					key: 'longitude',
					type: 'number'
				}, {
					key: 'distance',
					type: 'number'
				}, {
					key: 'q',
					type: 'string'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'place_id',
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
					key: 'place_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'name',
					type: 'string'
				}, {
					key: 'address',
					type: 'string'
				}, {
					key: 'city',
					type: 'string'
				}, {
					key: 'state',
					type: 'string'
				}, {
					key: 'postal_code',
					type: 'string'
				}, {
					key: 'country',
					type: 'string'
				}, {
					key: 'latitude',
					type: 'number'
				}, {
					key: 'longitude',
					type: 'number'
				}, {
					key: 'website',
					type: 'string'
				}, {
					key: 'twitter',
					type: 'string'
				}, {
					key: 'phone_number',
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
				}]
			}
		}
	}
};

module.exports = acsObject;
