var acsObject = {
	SocialIntegrations: {
		restObject: 'users',
		methods: {
			externalAccountLink: {
				httpMethod: 'POST',
				restMethod: 'external_account_link',
				requiredParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'type',
					type: 'string'
				}, {
					key: 'token',
					type: 'string'
				}],
				optionalParam: []
			},
			externalAccountLogin: {
				httpMethod: 'POST',
				restMethod: 'external_account_login',
				requiredParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'type',
					type: 'string'
				}, {
					key: 'token',
					type: 'string'
				}],
				optionalParam: [{
					key: 'acl_name',
					type: 'string'
				}, {
					key: 'acl_id',
					type: 'string'
				}]
			},
			externalAccountUnlink: {
				httpMethod: 'POST',
				restMethod: 'external_account_unlink',
				requiredParam: [{
					key: 'id',
					type: 'string'
				}, {
					key: 'type',
					type: 'string'
				}],
				optionalParam: []
			},
			searchFacebookFriends: {
				httpMethod: 'GET',
				restMethod: 'facebook/search_friends',
				restObject: 'social',
				requiredParam: [],
				optionalParam: []
			}
		}
	}
};

module.exports = acsObject;
