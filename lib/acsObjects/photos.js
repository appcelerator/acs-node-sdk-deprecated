var acsObject = {
	Photos: {
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
			search: {
				httpMethod: 'GET'
			},
			show: {
				httpMethod: 'GET'
			},
			update: {
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = acsObject;
