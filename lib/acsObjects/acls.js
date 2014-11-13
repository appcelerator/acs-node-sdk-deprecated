var acsObject = {
	ACLs: {
		objectName: 'acls',
		fields: [{
			key: 'created_at',
			type: 'date'
		}, {
			key: 'id',
			type: 'string'
		}, {
			key: 'name',
			type: 'string'
		}, {
			key: 'public_read',
			type: 'object'
		}, {
			key: 'public_write',
			type: 'string'
		}, {
			key: 'readers',
			type: 'array'
		}, {
			key: 'updated_at',
			type: 'date'
		}, {
			key: 'user',
			type: 'object'
		}, {
			key: 'writers',
			type: 'array'
		}],
		methods: {
			checkUser: {
				httpMethod: 'GET',
				restMethod: 'check',
				requiredParam: [],
				optionalParam: [{
					key: 'name',
					type: 'string'
				}, {
					key: 'id',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}]
			},
			count: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: []
			},
			addUser: {
				httpMethod: 'POST',
				restMethod: 'create',
				requiredParam: [{
					key: 'name',
					type: 'string'
				}],
				optionalParam: [{
					key: 'reader_ids',
					type: 'string'
				}, {
					key: 'writer_ids',
					type: 'string'
				}, {
					key: 'public_read',
					type: 'string'
				}, {
					key: 'public_write',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [],
				optionalParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'name',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}]
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: 'delete',
				requiredParam: [],
				optionalParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'name',
					type: 'string'
				}, {
					key: 'user_id',
					type: 'string'
				}]
			},
			query: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'count',
					type: 'boolean'
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
			removeUser: {
				httpMethod: 'DELETE',
				restMethod: 'delete',
				requiredParam: [{
					key: 'reader_ids',
					type: 'string'
				}, {
					key: 'writer_ids',
					type: 'string'
				}],
				optionalParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'name',
					type: 'string'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'name',
					type: 'string'
				}]
			},
			update: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'reader_ids',
					type: 'string'
				}, {
					key: 'writer_ids',
					type: 'string'
				}],
				optionalParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'name',
					type: 'string'
				}, {
					key: 'public_read',
					type: 'string'
				}, {
					key: 'public_write',
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
