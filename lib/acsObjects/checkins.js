var acsObject = {
	Checkins: {
		methods: {
			batchDelete: {
				httpMethod: 'DELETE',
				restMethod: 'batch_delete'
			},
			count: {
				httpMethod: 'GET'
			},
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
			},
			show: {
				httpMethod: 'GET'
			},
			update: {
				httpMethod: 'POST'
			}
		}
	}
};

module.exports = acsObject;
