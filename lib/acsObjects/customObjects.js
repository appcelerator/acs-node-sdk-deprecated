var acsObject = {
	CustomObjects: {
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
			key: 'tags',
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
		}],
		methods: {
			count: {
				httpMethod: 'GET',
				restMethod: {
					entry: 'classname/count',
					variables: ['classname']
				},
				restObject: 'objects',
				requiredParam: [],
				optionalParam: []
			},
			create: {
				httpMethod: 'POST',
				restMethod: {
					entry: 'classname/create',
					variables: ['classname']
				},
				restObject: 'objects',
				requiredParam: [{
					key: 'classname',
					type: 'string'
				}, {
					key: 'fields',
					types: ['string','object']
				}],
				optionalParam: [{
					key: 'pretty_json',
					type: 'boolean'
				}, {
					key: 'tags',
					type: 'string'
				}, {
					key: 'photo',
					type: 'object'
				}, {
					key: 'photo_id',
					type: 'string'
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
			},
			query: {
				httpMethod: 'GET',
				restMethod: {
					entry: 'classname/query',
					variables: ['classname']
				},
				restObject: 'objects',
				requiredParam: [{
					key: 'classname',
					type: 'string'
				}],
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
			delete: {
				httpMethod: 'DELETE',
				restObject: 'objects',
				restMethod: {
					entry: 'classname/delete',
					variables: ['classname']
				},
				requiredParam: [{
					key: 'classname',
					type: 'string'
				}],
				optionalParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'ids',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			update: {
				httpMethod: 'POST',
				restMethod: {
					entry: 'classname/update',
					variables: ['classname']
				},
				restObject: 'objects',
				requiredParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'classname',
					type: 'string'
				}, {
					key: 'fields',
					types: ['string','object']
				}],
				optionalParam: [{
					key: 'tags',
					type: 'string'
				}, {
					key: 'photo',
					type: 'object'
				}, {
					key: 'photo_id',
					type: 'string'
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
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			show: {
				httpMethod: 'GET',
				restMethod: {
					entry: 'classname/show',
					variables: ['classname']
				},
				restObject: 'objects',
				requiredParam: [{
					key: 'classname',
					type: 'string'
				}],
				optionalParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'ids',
					type: 'string'
				}, {
					key: 'show_user_like',
					type: 'boolean'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			batchDelete: {
				httpMethod: 'DELETE',
				restObject: 'objects',
				restMethod: {
					entry: 'classname/batch_delete',
					variables: ['classname']
				},
				requiredParam: [{
					key: 'classname',
					type: 'string'
				}],
				optionalParam: [{
					key: 'where',
					type: 'string'
				}]
			},
			adminDropCollection: {
				httpMethod: 'DELETE',
				restObject: 'objects',
				restMethod: {
					entry: 'classname/admin_drop_collection',
					variables: ['classname']
				},
				requiredParam: [{
					key: 'classname',
					type: 'string'
				}],
				optionalParam: []
			}
		}
	}
};

module.exports = acsObject;
