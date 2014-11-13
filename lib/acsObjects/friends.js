var acsObject = {
	Friends: {
		methods: {
			add: {
				httpMethod: 'POST',
				requiredParam: [{
					key: 'user_ids',
					type: 'string'
				}],
				optionalParam: [{
					key: 'approval_required',
					type: 'boolean'
				}]
			},
			approve: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'user_ids',
					type: 'string'
				}],
				optionalParam: []
			},
			query: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}, {
					key: 'followers',
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
					key: 'unsel',
					type: 'object'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				restMethod: 'remove',
				requiredParam: [{
					key: 'user_ids',
					type: 'string'
				}],
				optionalParam: []
			},
			remove: {
				httpMethod: 'DELETE',
				requiredParam: [{
					key: 'user_ids',
					type: 'string'
				}],
				optionalParam: []
			},
			requests: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'requests_to',
					type: 'boolean'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			search: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}, {
					key: 'followers',
					type: 'boolean'
				}, {
					key: 'q',
					type: 'string'
				}, {
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			}
		}
	}
};

module.exports = acsObject;
