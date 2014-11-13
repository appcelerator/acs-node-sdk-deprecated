var acsObject = {
	Emails: {
		fields: [],
		methods: {
			count: {
				httpMethod: 'GET',
				restObject: 'email_templates',
				requiredParam: [],
				optionalParam: []
			},
			send: {
				httpMethod: 'POST',
				restObject: 'custom_mailer',
				restMethod: 'email_from_template',
				requiredParam: [{
					key: 'template',
					type: 'string'
				}, {
					key: 'recipients',
					type: 'string'
				}],
				optionalParam: [{
					key: 'from',
					type: 'string'
				}, {
					key: 'pretty_json',
					type: 'boolean'
				}]
			}
		}
	}
};

module.exports = acsObject;
