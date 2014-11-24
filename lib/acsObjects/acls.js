var acsObject = {
	ACLs: {
		objectName: 'acls',
		methods: {
			checkUser: {
				httpMethod: 'GET',
				restMethod: 'check'
			},
			count: {
				httpMethod: 'GET'
			},
			addUser: {
				httpMethod: 'POST',
				restMethod: 'create'
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
			removeUser: {
				httpMethod: 'DELETE',
				restMethod: 'delete'
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
