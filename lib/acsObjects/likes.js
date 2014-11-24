var acsObject = {
	Likes: {
		methods: {
			create: {
				httpMethod: 'POST'
			},
			delete: {
				httpMethod: 'DELETE'
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: 'delete'
			},
			query: {
				httpMethod: 'GET'
			}
		}
	}
};

module.exports = acsObject;
