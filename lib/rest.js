// A class to deal with RESTful call to ACS API

var _ = require('lodash'),
	request = require('request'),
	fs = require('fs'),
	u = require('./util'),
	ACSError = require('./acsError'),
	messages = require('./messages');

const fileUploadParams = ['file', 'photo'],	// http/https parameters that file upload uses
	excludedParameters = ['key', 'pretty_json', 'req', 'res'];	// filtered out http/https parameters, that don't need to be in restOptions

/*
This method is to use node module 'request' to make RESTful call to ACS API.
It will put parameters including ACS key and pretty_json into query string or request body properly, as well as dealing with cookie.
For required format of ACS API, it will also transform input JSON into correct format.

Parameters:
- apiEntryPoint: API entry point like https://api.cloud.appcelerator.com/v1/users/query.json
- appOptions: A JSON as application level settings, including optional cookieString and optional prettyJson
- httpMethod: GET / POST / PUT / DELETE
- restOptions: A JSON containing all needed parameters per request. For user login, we need username, password and password_confirmation
*/
var acsRequest = function(apiEntryPoint, appOptions, httpMethod, restOptions, callback) {
	var reqBody = _.omit(restOptions, excludedParameters);
	var j = request.jar();
	var cookie = null;
	// Cookie may come from either relayed outside request, or cookieString
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
	// CookieString can from either each requests or acsApp instance
	if (restOptions.cookieString || appOptions.cookieString) {
		cookie = request.cookie(restOptions.cookieString || appOptions.cookieString);
	}
	if (cookie) {
		j.setCookie(cookie, apiEntryPoint);
	}
	// pretty_json can be set as application level from appOptions
	if (appOptions.prettyJson) {
		restOptions.pretty_json = true;
	}
	var requestParam = null;
	var preparedReqBody = {};
	var hasFile = false;
	for (var item in reqBody) {
		var value = reqBody[item];
		if (u.inArray(item, fileUploadParams)) {
			hasFile = true;
			if (u.typeOf(value) === 'string') {
				value = fs.createReadStream(value);
			}
		} else if (u.typeOf(value) === 'object') {
			value = JSON.stringify(value);
		} else {
			value = value.toString();
		}
		preparedReqBody[item] = value;
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
			jar: j
		};
		// If there is any file upload needed, we need to use formData instead of form
		if (hasFile) {
			requestParam.formData = preparedReqBody;
		} else {
			requestParam.form = preparedReqBody;
		}
	}
	request(requestParam, function(error, response, body) {
		var result = null;
		var parsedBody = body;
		if (u.typeOf(body) === 'string') {
			try {
				parsedBody = JSON.parse(body);
			} catch (e) {}
		}
		if (restOptions.res) {
			// If this is a relayed response, we will set response header to include cookie back from ACS API
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

/*
This method is for executeACS() in acs.js to prepare necessary variables, and then invoke acsRequest() to make concrete call to ACS API.

Parameters:
- options: A JSON including several mandatory values including acsObject, acsMethod, httpMethod, appKey and appOptions
- options.acsObject: ACS Object to use, like users, checkins. This value is for entry point composition like /v1/users/xxxx
- options.acsMethod: Method of ACS Object to use, like query, count. This value is for entry point composition like /v1/xxxx/query.json
- options.httpMethod: GET / POST / PUT / DELETE
- options.appKey: ACS app key to use
- options: appOptions: ACS app optional options, like cookieString, prettyJson.
	Also it may contain different basic entry point different from https://api.cloud.appcelerator.com, and we will use corresponding basic entry point if it sets	
*/
var methodCall = function(options, callback) {
	if (!options || !options.acsObject || !options.acsMethod || !options.httpMethod || !options.appKey || !options.appOptions) {
		return (callback ? callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			parameter: 'in methodCall'
		})) : null);
	}
	if (!options.restOptions) {
		options.restOptions = {};
	}
	var v, item;
	var acsMethod = options.acsMethod;
	if (u.typeOf(options.acsMethod) === 'object') {
		var dynamicMethod = options.acsMethod.entry;
		for (v in options.acsMethod.variables) {
			item = options.acsMethod.variables[v];
			if (!options.restOptions[item]) {
				return (callback ? callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
					parameter: item
				})) : null);
			}
			dynamicMethod = dynamicMethod.replace(item, options.restOptions[item]);
		}
		acsMethod = dynamicMethod;
	}

	var apiEntryPoint = options.appOptions.apiEntryPoint + '/v1/' + options.acsObject + '/' + acsMethod + '.json?key=' + options.appKey;
	// console.log('apiEntryPoint: %s', apiEntryPoint);
	// console.log('acsObject: %s', options.acsObject);
	// console.log('acsMethod: %s', acsMethod);
	// console.log('httpMethod: %s', options.httpMethod);
	// console.log('appKey: %s', options.appKey);
	// console.log('appOptions: %j', options.appOptions);
	// console.log('restOptions: %j', options.restOptions);

	if (u.typeOf(options.acsMethod) === 'object') {
		// Remove unnecessary parameter
		for (v in options.acsMethod.variables) {
			item = options.acsMethod.variables[v];
			if (options.restOptions[item]) {
				delete options.restOptions[item];
			}
		}
	}
	acsRequest(apiEntryPoint, options.appOptions, options.httpMethod, options.restOptions, callback);
};
module.exports.methodCall = methodCall;

/*
This method is for executeACSRest() in acs.js to prepare necessary variables, and then invoke acsRequest() to make concrete call to ACS API.

Parameters:
- options: A JSON including several mandatory values including methodPath, httpMethod, appKey and appOptions
- options.methodPath: ACS method path to use, like /v1/users/query.json
- options.httpMethod: GET / POST / PUT / DELETE
- options.appKey: ACS app key to use
- options: appOptions: ACS app optional options, like cookieString, prettyJson.
	Also it may contain different basic entry point different from https://api.cloud.appcelerator.com, and we will use corresponding basic entry point if it sets	
*/
var restCall = function(options, callback) {
	if (!options || !options.methodPath || !options.httpMethod || !options.appKey || !options.appOptions) {
		return (callback ? callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			parameter: 'in restCall'
		})) : null);
	}
	if (!options.restOptions) {
		options.restOptions = {};
	}

	var apiEntryPoint = options.appOptions.apiEntryPoint + options.methodPath + '?key=' + options.appKey;
	// console.log('apiEntryPoint: %s', apiEntryPoint);
	acsRequest(apiEntryPoint, options.appOptions, options.httpMethod, options.restOptions, callback);
};
module.exports.restCall = restCall;
