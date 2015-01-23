var acsObject = {
	GeoFences: {
		restObject: 'geo_fences',
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
			query: {
				httpMethod: 'GET'
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: 'delete'
			},
			update: {
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = acsObject;
