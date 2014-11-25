var acsObject = {
	CustomObjects: {
		restObject: 'objects',
		methods: {
			adminDropCollection: {
				httpMethod: 'DELETE',
				restMethod: {
					entry: 'classname/admin_drop_collection',
					variables: ['classname']
				}
			},
			batchDelete: {
				httpMethod: 'DELETE',
				restMethod: {
					entry: 'classname/batch_delete',
					variables: ['classname']
				}
			},
			count: {
				httpMethod: 'GET',
				restMethod: {
					entry: 'classname/count',
					variables: ['classname']
				}
			},
			create: {
				httpMethod: 'POST',
				restMethod: {
					entry: 'classname/create',
					variables: ['classname']
				}
			},
			delete: {
				httpMethod: 'DELETE',
				restMethod: {
					entry: 'classname/delete',
					variables: ['classname']
				}
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: {
					entry: 'classname/delete',
					variables: ['classname']
				}
			},
			query: {
				httpMethod: 'GET',
				restMethod: {
					entry: 'classname/query',
					variables: ['classname']
				}
			},
			show: {
				httpMethod: 'GET',
				restMethod: {
					entry: 'classname/show',
					variables: ['classname']
				}
			},
			update: {
				httpMethod: 'POST',
				restMethod: {
					entry: 'classname/update',
					variables: ['classname']
				}
			}
		}
	}
};

module.exports = acsObject;
