// Messages class

module.exports = {
	ERR_MISS_REQUIRED_PARAMETER: {
		errorCode: 1001,
		message: 'Required parameter %parameter% is missing.',
		docUrl: 'TBD'
	},
	ERR_WRONG_TYPE: {
		errorCode: 1002,
		message: 'Wrong type of %typeName%.',
		docUrl: 'TBD'
	},
	ERR_WRONG_PARAMETER_TYPE: {
		errorCode: 1003,
		message: 'Parameter type of  %typeName% is wrong. Required: %requiredType%, actual: %actualType%.',
		docUrl: 'TBD'
	}
};
