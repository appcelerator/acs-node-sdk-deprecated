var acsObject = {
	PhotoCollections: {
		restObject: 'collections',
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
			search: {
				httpMethod: 'GET'
			},
			show: {
				httpMethod: 'GET'
			},
			showPhotos: {
				httpMethod: 'GET',
				restMethod: 'show/photos'
			},
			showSubcollections: {
				httpMethod: 'GET',
				restMethod: 'show/subcollections'
			},
			update: {
				httpMethod: 'PUT'
			}
		}
	}
};

module.exports = acsObject;
