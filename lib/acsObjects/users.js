var acsObject = {
	Users: {
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
			login: {
				httpMethod: 'POST'
			},
			logout: {
				httpMethod: 'GET'
			},
			query: {
				httpMethod: 'GET'
			},
			requestResetPassword: {
				httpMethod: 'GET',
				restMethod: 'request_reset_password'
			},
			resendConfirmation: {
				httpMethod: 'GET',
				restMethod: 'resend_confirmation.json'
			},
			search: {
				httpMethod: 'GET'
			},
			show: {
				httpMethod: 'GET',
			},
			showMe: {
				httpMethod: 'GET',
				restMethod: 'show/me'
			},
			update: {
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = acsObject;
