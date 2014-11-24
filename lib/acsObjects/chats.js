var acsObject = {
	Chats: {
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
			getChatGroups: {
				httpMethod: 'GET',
				restMethod: 'get_chat_groups'
			},
			query: {
				httpMethod: 'GET'
			},
			queryChatGroups: {
				httpMethod: 'GET',
				restMethod: 'query_chat_groups'
			}
		}
	}
};

module.exports = acsObject;
