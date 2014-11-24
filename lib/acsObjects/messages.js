var acsObject = {
	Messages: {
		methods: {
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
			deleteThread: {
				httpMethod: 'DELETE',
				restMethod: 'delete/thread'
			},
			removeThread: {
				httpMethod: 'DELETE',
				restMethod: 'delete/thread'
			},
			query: {
				httpMethod: 'GET'
			},
			reply: {
				httpMethod: 'POST'
			},
			show: {
				httpMethod: 'GET'
			},
			showInbox: {
				httpMethod: 'GET',
				restMethod: 'show/inbox'
			},
			showSent: {
				httpMethod: 'GET',
				restMethod: 'show/sent'
			},
			showThread: {
				httpMethod: 'GET',
				restMethod: 'show/thread'
			},
			showThreads: {
				httpMethod: 'GET',
				restMethod: 'show/threads'
			}
		}
	}
};

module.exports = acsObject;
