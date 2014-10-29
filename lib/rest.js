var _ = require('lodash'),
	request = require('request'),
	u = require('./util'),
	ACSError = require('./acsError'),
	messages = require('./messages');

var acsRequest = function(apiEntryPoint, appOptions, httpMethod, reqBody, restOptions, callback) {
	var j = request.jar();
	var cookie = null;
	if (restOptions.req) {
		if (restOptions.req.headers && restOptions.req.headers.cookie) {
			cookie = request.cookie(restOptions.req.headers.cookie);
		}
		// Merge req.query and req.body into parameter JSON
		if (restOptions.req.query) {
			reqBody = _.defaults(_.clone(restOptions.req.query), reqBody);
		}
		if (restOptions.req.body) {
			reqBody = _.defaults(_.clone(restOptions.req.body), reqBody);
		}
	}
	if (restOptions.cookieString || appOptions.cookieString) {
		cookie = request.cookie(restOptions.cookieString || appOptions.cookieString);
	}
	if (cookie) {
		j.setCookie(cookie, apiEntryPoint);
	}
	if (appOptions.prettyJson) {
		restOptions.pretty_json = true;
	}
	var requestParam = null;
	var preparedReqBody = {};
	for (var item in reqBody) {
		var value = reqBody[item];
		if (u.typeOf(value) === 'object') {
			preparedReqBody[item] = JSON.stringify(value);
		} else {
			preparedReqBody[item] = value.toString();
		}
	}
	if (httpMethod === 'GET') {
		requestParam = {
			url: apiEntryPoint,
			method: httpMethod,
			qs: preparedReqBody,
			jar: j
		};
	} else {
		requestParam = {
			url: apiEntryPoint,
			method: httpMethod,
			json: preparedReqBody,
			jar: j
		};
	}
	request(requestParam, function(error, response, body) {
		var result = null;
		var parsedBody = body;
		if (httpMethod === 'GET') {
			try {
				parsedBody = JSON.parse(body);
			} catch (e) {}
		}
		if (restOptions.res) {
			var cookies = j.getCookies(apiEntryPoint);
			restOptions.res.setHeader('Set-Cookie', cookies.join('; '));
			result = {
				response: response,
				body: parsedBody
			};
		} else {
			result = {
				response: response,
				body: parsedBody,
				cookieString: j.getCookieString(apiEntryPoint)
			};
		}
		callback(error, result);
	});
};

var methodCall = function(options, callback) {
	if (!options || !options.acsObject || !options.acsMethod || !options.httpMethod || !options.appKey || !options.appOptions) {
		throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			typeName: 'in methodCall'
		});
	}
	if (!options.restOptions) {
		options.restOptions = {};
	}

	var apiEntryPoint = options.appOptions.apiEntryPoint + '/v1/' + options.acsObject + '/' + options.acsMethod + '.json?key=' + options.appKey;
	// console.log('apiEntryPoint: %s', apiEntryPoint);
	// console.log('acsObject: %s', options.acsObject);
	// console.log('acsMethod: %s', options.acsMethod);
	// console.log('httpMethod: %s', options.httpMethod);
	// console.log('appKey: %s', options.appKey);
	// console.log('appOptions: %j', options.appOptions);
	// console.log('restOptions: %j', options.restOptions);

	var reqBody = {},
		requiredTypes,
		actualType;
	for (var i = 0; i < options.requiredParams.length; i++) {
		var requiredParam = options.requiredParams[i];
		if (!options.restOptions[requiredParam.key]) {
			return callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
				parameter: requiredParam
			}));
		}
		requiredTypes = (requiredParam.types ? requiredParam.types : [requiredParam.type]);
		actualType = u.typeOf(options.restOptions[requiredParam.key]);
		if (!u.inArray(actualType, requiredTypes)) {
			return callback(new ACSError(messages.ERR_WRONG_PARAMETER_TYPE, {
				typeName: requiredParam.key,
				requiredType: requiredTypes,
				actualType: actualType
			}));
		} else {
			reqBody[requiredParam.key] = options.restOptions[requiredParam.key];
		}
	}
	for (var j = 0; j < options.optionalParams.length; j++) {
		var optionalParam = options.optionalParams[j];
		if (options.restOptions[optionalParam.key]) {
			requiredTypes = (optionalParam.types ? optionalParam.types : [optionalParam.type]);
			actualType = u.typeOf(options.restOptions[optionalParam.key]);
			if (!u.inArray(actualType, requiredTypes)) {
				return callback(new ACSError(messages.ERR_WRONG_PARAMETER_TYPE, {
					typeName: optionalParam.key,
					requiredType: requiredTypes,
					actualType: actualType
				}));
			} else {
				reqBody[optionalParam.key] = options.restOptions[optionalParam.key];
			}
		}
	}
	acsRequest(apiEntryPoint, options.appOptions, options.httpMethod, reqBody, options.restOptions, callback);
};
module.exports.methodCall = methodCall;


var excludedParameters = ['key', 'pretty_json', 'req', 'res'];
var restCall = function(options, callback) {
	if (!options || !options.methodPath || !options.httpMethod || !options.appKey || !options.appOptions) {
		throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			typeName: 'in restCall'
		});
	}
	if (!options.restOptions) {
		options.restOptions = {};
	}

	var apiEntryPoint = options.appOptions.apiEntryPoint + options.methodPath + '?key=' + options.appKey;
	// console.log('apiEntryPoint: %s', apiEntryPoint);

	var reqBody = _.omit(options.restOptions, excludedParameters);
	acsRequest(apiEntryPoint, options.appOptions, options.httpMethod, reqBody, options.restOptions, callback);
};
module.exports.restCall = restCall;