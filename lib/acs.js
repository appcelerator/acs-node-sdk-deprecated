// SDK entry class

var ACSError = require('./acsError'),
	messages = require('./messages'),
	acsCollection = require('./collection'),
	acsRest = require('./rest'),
	u = require('./util');

const DEFAULT_API_ENTRY_POINT = 'https://api.cloud.appcelerator.com',
	// Default appOptions
	DEFAULT_APP_OPTIONS = {
		apiEntryPoint: DEFAULT_API_ENTRY_POINT
	},
	// Suported HTTP method for direct rest call. User can use acsApp.post('/v1/users/login.json')
	HTTP_METHOD_LIST = ['get', 'post', 'update', 'delete'];


/*
This method is a generic method to handle all generated instance method.
For example, after creating new instance like var acsApp = require('acs-node')('ACS_APP_KEY'), users will have methods like acsApp.usersLogin(), acsApp.likesQuery().
When calling acsApp.usersLogin(), internally sdk transforms it to executeACS({acsObjectKey: 'Users', acsObjectName: 'users', acsObjectMethodKey: 'Login', acsObjectMethodName: 'login', httpMethod:'POST'}).
Then, executeACS will return a function(restOptions, callback). From user side we will get acsApp.usersLogin(restOptions, callback).

Parameters:
- options: internal parameter containing acsObjectKey, acsObjectName, acsObjectMethodKey, acsObjectMethodName and httpMethod
- options.acsObjectKey: ACS Object key listed under acsObjects/xxx.js, like ACLs, Users, PushNotifications
- options.acsObjectName: ACS Object name that is used for entry point composition, like acls, users, push_notifications
- options.acsObjectMethodKey: Method key of ACS Object listed inner acsObjects/xxx.js, like count, remove, showMe, requestResetPassword
- options.acsObjectMethodName: Method name of ACS Object that is used for entry point composition, like count, delete, show/me, request_reset_password
- options.httpMethod: GET / POST/ PUT / DELETE
*/
var executeACS = function(options) {
	if (!options || !options.acsObjectKey || !options.acsObjectName || !options.acsObjectMethodKey || !options.acsObjectMethodName || !options.httpMethod) {
		throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			parameter: 'in executeACS'
		});
	}
	return function(restOptions, callback) {
		// Prameter offset
		if (typeof restOptions === 'function') {
			// No restOptions
			callback = restOptions;
			restOptions = null;
		}
		acsRest.methodCall({
			acsObject: options.acsObjectName,
			acsMethod: options.acsObjectMethodName,
			httpMethod: options.httpMethod,
			appKey: this.appKey,
			appOptions: this.appOptions,
			restOptions: restOptions
		}, callback);
	};
};

/*
This method is a generic method to handle rest call method.
For example, after creating new instance like var acsApp = require('acs-node')('ACS_APP_KEY'), users will have methods like acsApp.get(), acsApp.post().
When calling acsApp.get('/v1/users/login.json'), internally sdk transforms it to executeACSRest({methodPath: '/v1/users/login.json', httpMethod: 'GET'}).
Then, executeACSRest will return a function(restOptions, callback). From user side we will get acsApp.get(methodPath, restOptions, callback).

Parameters:
- httpMethod: GET / POST/ PUT / DELETE
*/
var executeACSRest = function(httpMethod) {
	return function(methodPath, restOptions, callback) {
		// Prameter offset
		if (typeof restOptions === 'function') {
			// No restOptions
			callback = restOptions;
			restOptions = null;
		}
		// Check required parameter
		if (!methodPath) {
			throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
				parameter: 'methodPath'
			});
		} else if (typeof methodPath !== 'string') {
			throw new ACSError(messages.ERR_WRONG_TYPE, {
				typeName: 'method path'
			});
		}
		acsRest.restCall({
			methodPath: methodPath,
			httpMethod: httpMethod,
			appKey: this.appKey,
			appOptions: this.appOptions,
			restOptions: restOptions
		}, callback);
	};
};

/*
Main class to instantiate ACS Node SDK object for user to use

Parameters:
- acsAppKey: ACS app key (required)
- appOptions: ACS app options (optional), including apiEntryPoint, cookieString and prettyJson. All are optional.
*/
var ACSApp = function(acsAppKey, appOptions) {
	if (!acsAppKey) {
		throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			parameter: 'ACS app key'
		});
	} else if (typeof acsAppKey !== 'string') {
		throw new ACSError(messages.ERR_WRONG_TYPE, {
			typeName: 'ACS app key'
		});
	} else {
		this.appKey = acsAppKey;
	}
	if (!appOptions) {
		this.appOptions = DEFAULT_APP_OPTIONS;
	} else if (typeof appOptions !== 'object') {
		throw new ACSError(messages.ERR_WRONG_TYPE, {
			typeName: 'ACS app options'
		});
	} else if (!appOptions.apiEntryPoint) {
		this.appOptions = appOptions;
		this.appOptions.apiEntryPoint = DEFAULT_API_ENTRY_POINT;
	} else {
		this.appOptions = appOptions;
	}
};

/*
Class level code to construct methods of various ACS objects from acsObjects/xxx.js
First, collection.js will read all acsObjects/xxx.js into one variable acsCollection.
Then, the following code will dynamically create corresponding functions like usersLogin(), aclsQuery(), and point them to executeACS().
Finally, it will create 4 methods for rest call like acsApp.get(), acsApp.post(), etc.
*/
for (var i = 0; i < acsCollection.objectList.length; i++) {
	var acsObjectKey = acsCollection.objectList[i];
	var acsObject = acsCollection[acsObjectKey];
	var acsObjectShowName = u.firstCharLowercaseString(acsObject.objectName ? acsObject.objectName : acsObjectKey);
	for (var j = 0; j < acsObject.methodList.length; j++) {
		var acsObjectMethodKey = acsObject.methodList[j];
		var acsObjectMethodShowName = u.capitalizedString(acsObjectMethodKey);
		var acsObjectMethod = acsObject.methods[acsObjectMethodKey];
		var httpMethod = acsObjectMethod.httpMethod;
		var restMethod = acsObjectMethod.restMethod ? acsObjectMethod.restMethod : acsObjectMethodKey;
		var acsObjectName = (acsObject.restObject ? acsObject.restObject : (acsObjectMethod.restObject ? acsObjectMethod.restObject : acsObjectKey)).toLowerCase();
		var showName = acsObjectShowName + acsObjectMethodShowName;
		ACSApp.prototype[showName] = executeACS({
			acsObjectKey: acsObjectKey,
			acsObjectName: acsObjectName,
			acsObjectMethodKey: acsObjectMethodKey,
			acsObjectMethodName: restMethod,
			httpMethod: httpMethod
		});
	}
}
for (var i = 0; i < HTTP_METHOD_LIST.length; i++) {
	var httpMethod = HTTP_METHOD_LIST[i];
	ACSApp.prototype[httpMethod] = executeACSRest(httpMethod.toUpperCase());
}

// Method to store session into instance
ACSApp.prototype.setSessionByCookieString = function(cookieString) {
	this.appOptions.cookieString = cookieString;
};

// Method to clear session from instance
ACSApp.prototype.clearSession = function() {
	delete this.appOptions.cookieString;
};

// Method to get general supported collection list. This will be very usefule when developing components like mobware-acs
ACSApp.prototype.getACSCollection = function() {
	return acsCollection;
};

// Exported method to create an ACS app instance
var createACSApp = function(acsAppKey, appOptions) {
	return new ACSApp(acsAppKey, appOptions);
};
module.exports = createACSApp;
