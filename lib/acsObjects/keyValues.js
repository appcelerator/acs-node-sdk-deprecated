var acsObject = {
	KeyValues: {
		fields: [{
			key: 'id',
			type: 'string'
		}, {
			key: 'name',
			type: 'string'
		}, {
			key: 'type',
			type: 'string'
		}, {
			key: 'value',
			types: ['string', 'object']
		}],
		methods: {
			append: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'name',
					type: 'string'
				}, {
					key: 'value',
					types: ['string', 'object', 'number']
				}],
				optionalParam: [{
					key: 'access_private',
					type: 'boolean'
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			count: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: []
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [{
					key: 'name',
					type: 'string'
				}],
				optionalParam: [{
					key: 'access_private',
					type: 'boolean'
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			get: {
				httpMethod: 'GET',
				requiredParam: [{
					key: 'name',
					type: 'string'
				}],
				optionalParam: [{
					key: 'access_private',
					type: 'boolean'
				}, {
					key: 'user_id',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			},
			incrby: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'name',
					type: 'string'
				}, {
					key: 'value',
					types: ['string', 'number']
				}],
				optionalParam: [{
					key: 'access_private',
					type: 'boolean'
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
					type: 'string'
				}, {
					key: 'order',
					type: 'string'
				}, {
					key: 'sel',
					type: 'string'
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
			set: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'name',
					type: 'string'
				}, {
					key: 'value',
					types: ['string', 'object', 'number']
				}],
				optionalParam: [{
					key: 'type',
					type: 'boolean'
				}, {
					key: 'access_private',
					type: 'boolean'
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
