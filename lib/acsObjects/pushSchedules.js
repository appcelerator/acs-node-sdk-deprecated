var acsObject = {
	PushSchedules: {
		restObject: 'push_schedules',
		fields: [{
			key: 'id',
			type: 'string'
		}, {
			key: 'name',
			type: 'string'
		}, {
			key: 'push_notification',
			type: 'object'
		}, {
			key: 'recurrence',
			type: 'object'
		}, {
			key: 'start_time',
			type: 'date'
		}],
		methods: {
			create: {
				httpMethod: 'POST',
				requiredParam: [{
					key: 'schedule',
					type: 'object'
				}],
				optionalParam: [{
					key: 'where',
					type: 'object'
				}]
			},
			delete: {
				httpMethod: 'DELETE',
				requiredParam: [],
				optionalParam: [{
					key: 'ids',
					type: 'array'
				}]
			},
			remove: {
				httpMethod: 'DELETE',
				restMethod: 'delete',
				requiredParam: [],
				optionalParam: [{
					key: 'ids',
					type: 'array'
				}]
			},
			query: {
				httpMethod: 'GET',
				requiredParam: [],
				optionalParam: [{
					key: 'name',
					type: 'string'
				}, {
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
				}]
			},
			update: {
				httpMethod: 'PUT',
				requiredParam: [{
					key: 'schedule',
					type: 'object'
				}, {
					key: 'id',
					type: 'string'
				}],
				optionalParam: [{
					key: 'where',
					type: 'object'
				}]
			}
		}
	}
};

module.exports = acsObject;
