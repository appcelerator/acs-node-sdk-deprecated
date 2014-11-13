var acsObject = {
	Clients: {
		fields: {},
		methods: {
			geolocate: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'ip_address',
					type: 'string'
				}]
			}
		}
	}
};

module.exports = acsObject;
