var acsObject = {
	Files: {
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
			key: 'processed',
			type: 'boolean'
		}, {
			key: 'updated_at',
			type: 'date'
		}, {
			key: 'url',
			type: 'string'
		}, {
			key: 'user',
			type: 'object'
		}],
		methods: {
			batchDelete: {
				httpMethod: 'DELETE',
				restMethod: 'batch_delete',
				requiredParam: [],
				optionalParam: []
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
					key: 'file',
					types: ['object', 'string']
				}, {
					key: 'custom_fields',
					types: ['object', 'string']
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
					key: 'file_id',
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
					key: 'file_id',
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
					key: 'unsel',
					type: 'object'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'file_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'resposne_depth',
					type: 'string'
				}]
			},
			update: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'file_id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'name',
					type: 'string'
				}, {
					key: 'file',
					types: ['object', 'string']
				}, {
					key: 'url',
					type: 'string'
				}, {
					key: 'custom_fields',
					types: ['object', 'string']
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
