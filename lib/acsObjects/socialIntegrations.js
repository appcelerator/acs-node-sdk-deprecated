var acsObject = {
	SocialIntegrations: {
		restObject: 'users',
		methods: {
			externalAccountLink: {
				httpMethod: 'POST',
				restMethod: 'external_account_link'
			},
			externalAccountLogin: {
				httpMethod: 'POST',
				restMethod: 'external_account_login'
			},
			externalAccountUnlink: {
				httpMethod: 'POST',
				restMethod: 'external_account_unlink'
			},
			searchFacebookFriends: {
				httpMethod: 'GET',
				restMethod: 'facebook/search_friends',
				restObject: 'social'
			}
		}
	}
};

module.exports = acsObject;
