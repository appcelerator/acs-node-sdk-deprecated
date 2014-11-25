var acsObject = {
	Events: {
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
			queryOccurrences: {
				httpMethod: 'GET',
				restMethod: 'query/occurrences'
			},
			search: {
				httpMethod: 'GET'
			},
			searchOccurrences: {
				httpMethod: 'GET',
				restMethod: 'search/occurrences'
			},
			show: {
				httpMethod: 'GET'
			},
			showOccurrences: {
				httpMethod: 'GET',
				restMethod: 'show/occurrences'
			},
			update: {
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = acsObject;
