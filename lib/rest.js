/**
 * Performs the REST API calls the ACS Objects.
 *
 * @module rest
 *
 * @copyright
 * Copyright (c) 2012-2014 by Appcelerator, Inc. All Rights Reserved.
 *
 * @license
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

const
	ACSError = require('./acsError'),
	fs = require('fs'),
	http = require('http'),
	messages = require('./messages'),
	request = require('appc-request-ssl'),
	_ = require('lodash'),
	debug = require('debug')('acs'),

	fileUploadParams = ['file', 'photo'], // http/https parameters that file upload uses
	excludedParameters = ['key', 'pretty_json', 'req', 'res']; // filtered out http/https parameters, that don't need to be in restOptions

/*
 * Public APIs
 */
module.exports.createACSRequestFunction = createACSRequestFunction;
module.exports.createACSRESTRequestFunction = createACSRESTRequestFunction;

/**
 * Internal function for making RESTful calls to ACS API. It will put parameters
 * including ACS key and `pretty_json` into query string or request body
 * properly, as well as dealing with the session cookie.
 *
 * For required format of ACS API, it will also transform input JSON into correct format.
 *
 * @private
 *
 * @param {string} apiEntryPoint - The URL to use for API calls.
 * @param {object} appOptions - An object containing various options.
 * @param {string} [appOptions.apiEntryPoint] - The URL to use for all requests.
 * @param {boolean} [appOptions.prettyJson] - When truthy, sets the `pretty_json` REST option.
 * @param {string} httpMethod - The HTTP method to use for the request. Valid values include "GET", "POST", "PUT", and "DELETE".
 * @param {string} cookieString - The cookie to set for the session.
 * @param {object} restOptions - An object containing all needed parameters per request such as `username` and `password` for the user login request.
 * @param {function} callback - A function to call after the request completes.
 */
function acsRequest(apiEntryPoint, appOptions, httpMethod, cookieString, restOptions, callback) {
	var	theJar = request.jar(),
		cookie = null;

	// cookie may come from either relayed outside request, or cookieString
	if (restOptions.req) {
		if (restOptions.req.headers && restOptions.req.headers.cookie) {
			cookie = request.cookie(restOptions.req.headers.cookie);
			cookie && theJar.setCookie(cookie, apiEntryPoint);
		}
		// Merge req.query and req.body into parameter JSON
		if (restOptions.req.query) {
			reqBody = _.defaults(_.clone(restOptions.req.query), reqBody);
		}
		if (restOptions.req.body) {
			reqBody = _.defaults(_.clone(restOptions.req.body), reqBody);
		}
	}

	// cookieString can from either each requests or ACSNode instance
	if (restOptions.cookieString || cookieString) {
		cookie = request.cookie(restOptions.cookieString || cookieString);
		cookie && theJar.setCookie(cookie, apiEntryPoint);
	}

	// pretty_json can be set as application level from appOptions
	if (appOptions.prettyJson && !restOptions.hasOwnProperty('pretty_json')) {
		if (typeof appOptions.prettyJson !== 'boolean') {
			return callback(new ACSError(messages.ERR_WRONG_TYPE, {
				typeName: 'prettyJson'
			}));
		}
		restOptions.pretty_json = appOptions.prettyJson;
	}

	// response_json_depth can be set as application level from appOptions
	if (appOptions.responseJsonDepth && !restOptions.hasOwnProperty('response_json_depth')) {
		if (typeof appOptions.responseJsonDepth !== 'number') {
			return callback(new ACSError(messages.ERR_WRONG_TYPE, {
				typeName: 'responseJsonDepth'
			}));
		}
		restOptions.response_json_depth = appOptions.responseJsonDepth;
	}

	var reqBody = _.omit(restOptions, excludedParameters),
		requestParam = null,
		preparedReqBody = {},
		hasFile = false;

	Object.keys(reqBody).forEach(function (item) {
		var value = reqBody[item];
		if (value === undefined || value === null) {
			// if the value is undefined, just return now so that it's not added to the request
			return;
		} else if (fileUploadParams.indexOf(item) !== -1) {
			hasFile = true;
			if (typeof value === 'string') {
				value = fs.createReadStream(value);
			}
		} else if (value !== null && typeof value === 'object') {
			value = JSON.stringify(value);
		} else {
			value = value.toString();
		}
		preparedReqBody[item] = value;
	});

	requestParam = {
		url: apiEntryPoint,
		method: httpMethod,
		jar: theJar
	};

	if (httpMethod === 'GET') {
		requestParam.qs = preparedReqBody;
	} else {
		// if there is any file upload needed, we need to use formData instead of form
		if (hasFile) {
			requestParam.formData = preparedReqBody;
		} else {
			requestParam.form = preparedReqBody;
		}
	}

	debug('request %j',requestParam);

	request(requestParam, function (error, response, body) {
		debug('response - error=%o, body=%o',error,body);
		if (error) {
			return callback(new ACSError(messages.ERR_REQUEST_FAILED_ERROR, { message: error.toString() }));
		}

		if (!response) {
			return callback(new ACSError(messages.ERR_REQUEST_FAILED_NO_RESPONSE));
		}

		var parsedBody = body;

		// if the body is a string, try to json parse it
		if (body && typeof body === 'string') {
			try {
				parsedBody = JSON.parse(body);
			} catch (e) {}
		}

		var errmsg = parsedBody !== null && typeof parsedBody === 'object' && parsedBody.meta && parsedBody.meta.message,
			result = {
				statusCode: response.statusCode,
				reason: errmsg || http.STATUS_CODES[response.statusCode] || '',
				response: response,
				body: parsedBody
			};

		// if there was no explicit error, yet the request is a 4xx or 5xx then error
		if (response.statusCode >= 400) {
			return callback(new ACSError(messages.ERR_REQUEST_UNSUCCESSFUL, result));
		}

		if (restOptions.res) {
			// if this is a relayed response, we will set response header to include cookie back from ACS API
			var cookies = theJar.getCookies(apiEntryPoint);
			restOptions.res.setHeader('Set-Cookie', cookies.join('; '));
		} else {
			result.cookieString = theJar.getCookieString(apiEntryPoint);
		}

		callback(null, result);
	});
}

/**
 * Creates a function for invoking a ACS API. The returned function is
 * expected to be set in the `ACSNode` object prototype.
 *
 * For example, after creating new instance like:
 *
 *   var ACSNode = require('acs-node');
 *   var acsApp = new ACSNode('ACS_APP_KEY');
 *
 * users will have methods like `acsApp.usersLogin()` and `acsApp.likesQuery()`.
 *
 * When calling `acsApp.usersLogin()`, internally sdk transforms it to:
 *
 *   createACSRequestFunction({
 *       acsObjectKey: 'Users',
 *       acsObjectName: 'users',
 *       acsObjectMethodKey: 'Login',
 *       acsObjectMethodName: 'login',
 *       httpMethod:'POST'
 *   }).
 *
 * Then, `createACSRequestFunction()` will return a `function(restOptions, callback)`.
 * From user side we will get `acsApp.usersLogin(restOptions, callback)`.
 *
 * @param {object} options - An object containing various options.
 * @param {string} options.acsObjectKey - ACS Object key listed under acsObjects/xxx.js, like ACLs, Users, PushNotifications.
 * @param {string} options.acsObjectName - ACS Object name that is used for entry point composition, like ACLs, users, push_notifications.
 * @param {string} options.acsObjectMethodKey - The method key of ACS Object listed inner acsObjects/xxx.js, like count, remove, showMe, requestResetPassword.
 * @param {string} options.acsObjectMethodName - The method name of ACS Object that is used for entry point composition, like count, delete, show/me, request_reset_password.
 * @param {function} [options.acsObjectMethodPreAction] - An ACS Object method specific internal function to call before making the request.
 * @param {function} [options.acsObjectMethodPostAction] - An ACS Object method specific internal function to call after a request completes.
 * @param {string} options.httpMethod - The HTTP method to use for the request. Valid values include "GET", "POST", "PUT", and "DELETE".
 *
 * @returns {function(object, function(error, result))} A function that invokes the REST request.
 */
function createACSRequestFunction(options) {
	if (!options || !options.acsObjectKey || !options.acsObjectName || !options.acsObjectMethodKey || !options.acsObjectMethodName || !options.httpMethod) {
		throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			parameter: 'in createACSRequestFunction'
		});
	}

	return function (restOptions, callback) {
		// parameter offset
		if (typeof restOptions === 'function') {
			callback = restOptions;
			restOptions = null;
		}
		if (typeof callback !== 'function') {
			callback = function () {};
		}

		restOptions || (restOptions = {});

		function prepareACSRequest() {
			// check required app key
			if (!this.appKey) {
				return callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
					parameter: 'appKey'
				}));
			}
			if (typeof this.appKey !== 'string') {
				return callback(new ACSError(messages.ERR_WRONG_TYPE, {
					typeName: 'app key'
				}));
			}

			// check required app options
			if (!this.appOptions) {
				return callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
					parameter: 'appOptions'
				}));
			}
			if (typeof this.appOptions !== 'object') {
				return callback(new ACSError(messages.ERR_WRONG_TYPE, {
					typeName: 'app options'
				}));
			}

			// determine the acs method
			var acsMethod = options.acsObjectMethodName;

			if (acsMethod !== null && typeof acsMethod === 'object') {
				var dynamicMethod = acsMethod.entry;
				if (Array.isArray(acsMethod.variables)) {
					for (var i = 0, l = acsMethod.variables.length; i < l; i++) {
						var variable = acsMethod.variables[i];
						if (!restOptions[variable]) {
							return callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
								parameter: variable
							}));
						}
						dynamicMethod = dynamicMethod.replace(variable, restOptions[variable]);
					}
				}
				acsMethod = dynamicMethod;
			}

			// recheck if acsMethod is an object and if so, remove unnecessary parameters
			if (acsMethod !== null && typeof acsMethod === 'object' && Array.isArray(options.acsObjectMethodName.variables)) {
				options.acsObjectMethodName.variables.forEach(function (variable) {
					delete restOptions[variable];
				});
			}

			var apiEntryPoint = this.appOptions.apiEntryPoint + '/v1/' + options.acsObjectName + '/' + acsMethod + '.json?key=' + this.appKey;

			// console.log('apiEntryPoint: %s', apiEntryPoint);
			// console.log('acsObjectName: %s', options.acsObjectName);
			// console.log('acsMethod: %s', acsMethod);
			// console.log('httpMethod: %s', options.httpMethod);
			// console.log('appKey: %s', this.appKey);
			// console.log('appOptions: %j', this.appOptions);
			// console.log('restOptions: %j', restOptions);

			acsRequest(apiEntryPoint, this.appOptions, options.httpMethod, this.sessionCookieString, restOptions, function (error, result) {
				if (typeof options.acsObjectMethodPostAction === 'function') {
					// if the post action has 3 args (err, response, callback), then it's async
					if (options.acsObjectMethodPostAction.length > 2) {
						options.acsObjectMethodPostAction.call(this, error, result, function (err, res) {
							callback(err !== undefined ? err : error, res !== undefined ? res : result);
						});
						return;
					}
					options.acsObjectMethodPostAction.call(this, error, result);
				}
				callback(error, result);
			}.bind(this));
		}

		if (typeof options.acsObjectMethodPreAction === 'function') {
			// if the post action has 2 args (restOptions, callback), then it's async
			if (options.acsObjectMethodPreAction.length > 1) {
				options.acsObjectMethodPreAction.call(this, restOptions, function (err) {
					if (err) {
						return callback(err);
					}
					prepareACSRequest.call(this);
				}.bind(this));
				return;
			}
			options.acsObjectMethodPreAction.call(this, options, restOptions);
		}

		prepareACSRequest.call(this);
	};
}

/**
 * Creates a function for invoking a REST call method. The returned function is
 * expected to be set in the `ACSNode` object prototype.
 *
 * For example, after creating new instance like:
 *
 *   var ACSNode = require('acs-node');
 *   var acsApp = new ACSNode('ACS_APP_KEY');
 *
 * users will have methods like `acsApp.get()` and `acsApp.post()`.
 *
 * When calling `acsApp.get('/v1/users/login.json')`, internally the SDK
 * transforms it to:
 *
 *   createACSRESTRequestFunction({methodPath: '/v1/users/login.json', httpMethod: 'GET'})
 *
 * Then, `createACSRESTRequestFunction()` will return a `function(restOptions, callback)`.
 * From user side we will get acsApp.get(methodPath, restOptions, callback).
 *
 * @param {string} httpMethod - The HTTP method to use for the request. Valid
 * values include "GET", "POST", "PUT", and "DELETE".
 *
 * @returns {function(string, object, function(error result))} A function that
 * invokes the REST request.
 */
function createACSRESTRequestFunction(httpMethod) {
	if (!httpMethod) {
		throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			parameter: 'httpMethod'
		});
	}

	return function (methodPath, restOptions, callback) {
		// parameter offset
		if (typeof restOptions === 'function') {
			callback = restOptions;
			restOptions = null;
		}
		if (typeof callback !== 'function') {
			callback = function () {};
		}

		restOptions || (restOptions = {});

		// check required method path
		if (!methodPath) {
			return callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
				parameter: 'methodPath'
			}));
		}
		if (typeof methodPath !== 'string') {
			return callback(new ACSError(messages.ERR_WRONG_TYPE, {
				typeName: 'method path'
			}));
		}

		// check required app key
		if (!this.appKey) {
			return callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
				parameter: 'appKey'
			}));
		}
		if (typeof this.appKey !== 'string') {
			return callback(new ACSError(messages.ERR_WRONG_TYPE, {
				typeName: 'app key'
			}));
		}

		// check required app options
		if (!this.appOptions) {
			return callback(new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
				parameter: 'appOptions'
			}));
		}
		if (typeof this.appOptions !== 'object') {
			return callback(new ACSError(messages.ERR_WRONG_TYPE, {
				typeName: 'app options'
			}));
		}

		var apiEntryPoint = this.appOptions.apiEntryPoint + methodPath + '?key=' + this.appKey;

		acsRequest(apiEntryPoint, this.appOptions, httpMethod, this.sessionCookieString, restOptions, callback);
	};
}
