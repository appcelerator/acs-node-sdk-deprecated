var acsObject = {
	PhotoCollections: {
		restObject: 'collections',
		fields: [{
			key: 'counts',
			type: 'object'
		}, {
			key: 'cover_photo',
			type: 'object'
		}, {
			key: 'created_at',
			type: 'date'
		}, {
			key: 'id',
			type: 'string'
		}, {
			key: 'name',
			type: 'string'
		}, {
			key: 'parent_collection',
			type: 'object'
		}, {
			key: 'updated_at',
			type: 'date'
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
					key: 'name',
					type: 'string'
				}, {
					key: 'parent_collection_id',
					type: 'string'
				}, {
					key: 'cover_photo_id',
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
					key: 'collection_id',
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
					key: 'collection_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}]
			},
			search: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'user_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'collection_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			showPhotos: {
				httpMethod: 'GET',
				restMethod: 'show/photos',
				requiredParam: [{
					key: 'collection_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			showSubcollections: {
				httpMethod: 'GET',
				restMethod: 'show/subcollections',
				requiredParam: [{
					key: 'collection_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			update: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'collection_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'name',
					type: 'string'
				}, {
					key: 'parent_collection_id',
					type: 'string'
				}, {
					key: 'cover_photo_id',
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
