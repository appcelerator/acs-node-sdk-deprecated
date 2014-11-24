var acsObject = {
	Friends: {
		methods: {
			add: {
				httpMethod: 'POST'
			},
			approve: {
				httpMethod: 'PUT'
			},
			query: {
				httpMethod: 'GET'
			},
			delete: {
				httpMethod: 'DELETE',
				restMethod: 'remove'
			},
			remove: {
				httpMethod: 'DELETE'
			},
			requests: {
				httpMethod: 'GET'
			},
			search: {
				httpMethod: 'GET'
			}
		}
	}
};

module.exports = acsObject;
