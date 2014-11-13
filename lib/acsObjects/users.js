var acsObject = {
	Users: {
		fields: [{
			key: 'created_at',
			type: 'date'
		}, {
			key: 'custom_fields',
			types: ['string', 'object']
		}, {
			key: 'email',
			type: 'string'
		}, {
			key: 'external_account',
			type: 'array'
		}, {
			key: 'first_name',
			type: 'string'
		}, {
			key: 'friend_counts',
			type: 'object'
		}, {
			key: 'id',
			type: 'string'
		}, {
			key: 'last_name',
			type: 'string'
		}, {
			key: 'photo',
			type: 'object'
		}, {
			key: 'role',
			type: 'string'
		}, {
			key: 'updated_at',
			type: 'date'
		}, {
			key: 'username',
			type: 'string'
		}],
		methods: {
			batchDelete: {
				httpMethod: 'DELETE',
				restMethod: 'batch_delete',
				requiredParam: [],
				optionalParam: [{
					key: 'where',
					type: 'object'
				}]
			},
			count: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: []
			},
			create: {
				httpMethod: 'POST',
				requiredParam: [{
					key: 'password',
					type: 'string'
				}, {
					key: 'password_confirmation',
					type: 'string'
				}],
				optionalParam: [{
					key: 'email',
					type: 'string'
				}, {
					key: 'username',
					type: 'string'
				}, {
					key: 'first_name',
					type: 'string'
				}, {
					key: 'last_name',
					type: 'string'
				}, {
					key: 'photo',
					type: 'object'
				}, {
					key: 'photo_id',
					type: 'string'
				}, {
					key: 'tags',
					type: 'string'
				}, {
					key: 'custom_fields',
					types: ['object', 'string']
				}, {
					key: 'acl_name',
					type: 'string'
				}, {
					key: 'acl_id',
					type: 'string'
				}, {
					key: 'role',
					type: 'string'
				}, {
					key: 'template',
					type: 'string'
				}, {
					key: 'confirmation_template',
					type: 'string'
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [],
				optionalParam: []
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: 'delete',
				requiredParam: [],
				optionalParam: []
			},
			login: {
				httpMethod: 'POST',
				requiredParam: [],
				optionalParam: [{
					key: 'login',
					type: 'string'
				}, {
					key: 'password',
					type: 'string'
				}]
			},
			logout: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'device_token',
					type: 'string'
				}]
			},
			query: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}, {
					key: 'limit',
					type: 'number'
				}, {
					key: 'skip',
					type: 'number'
				}, {
					key: 'where',
					type: 'object'
				}, {
					key: 'order',
					type: 'string'
				}, {
					key: 'sel',
					type: 'object'
				}, {
					key: 'show_user_like',
					type: 'boolean'
				}, {
					key: 'unsel',
					type: 'object'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			requestResetPassword: {
				httpMethod: 'GET',
				restMethod: 'request_reset_password',
				requiredParam: [{
					key: 'email',
					type: 'string'
				}],
				optionalParam: [{
					key: 'subject',
					type: 'string'
				}, {
					key: 'template',
					type: 'string'
				}]
			},
			resendConfirmation: {
				httpMethod: 'GET',
				restMethod: 'resend_confirmation.json',
				requiredParam: [{
					key: 'email',
					type: 'string'
				}, {
					key: 'confirmation_subject',
					type: 'string'
				}, {
					key: 'confirmation_template',
					type: 'string'
				}],
				optionalParam: []
			},
			search: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'page',
					type: 'number'
				}, {
					key: 'per_page',
					type: 'number'
				}, {
					key: 'q',
					type: 'string'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			show: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'user_id',
					type: 'string'
				}, {
					key: 'user_ids',
					type: 'string'
				}, {
					key: 'response_json_depth',
					type: 'number'
				}, {
					key: 'show_user_like',
					type: 'boolean'
				}]
			},
			showMe: {
				httpMethod: 'GET',
				restMethod: 'show/me',
				requiredParam: [],
				optionalParam: [{
					key: 'response_json_depth',
					type: 'number'
				}]
			},
			update: {
				httpMethod: 'PUT',
				requiredParam: [],
				optionalParam: [{
					key: 'email',
					type: 'string'
				}, {
					key: 'username',
					type: 'string'
				}, {
					key: 'password',
					type: 'string'
				}, {
					key: 'password_confirmation',
					type: 'string'
				}, {
					key: 'first_name',
					type: 'string'
				}, {
					key: 'last_name',
					type: 'string'
				}, {
					key: 'photo',
					type: 'object'
				}, {
					key: 'photo_id',
					type: 'string'
				}, {
					key: 'tags',
					type: 'string'
				}, {
					key: 'custom_fields',
					types: ['object', 'string']
				}, {
					key: 'acl_name',
					type: 'string'
				}, {
					key: 'acl_id',
					type: 'string'
				}]
			}
		}
	}
};

module.exports = acsObject;
