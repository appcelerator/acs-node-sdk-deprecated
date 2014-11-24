var acsObject = {
	KeyValues: {
		methods: {
			append: {
				httpMethod: 'PUT'
			},
			count: {
				httpMethod: 'GET'
			},
			delete: {
				httpMethod: 'DELETE'
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: 'delete'
			},
			get: {
				httpMethod: 'GET'
			},
			incrby: {
				httpMethod: 'PUT'
			},
			increment: {
				httpMethod: 'PUT',
				restMethod: 'incrby'
			},
			query: {
				httpMethod: 'GET'
			},
			set: {
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = acsObject;
