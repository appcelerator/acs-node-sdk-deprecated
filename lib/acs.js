// Modules import
var ACSError = require('./acsError'),
	messages = require('./messages'),
	acsCollection = require('./collection'),
	acsRest = require('./rest'),
	u = require('./util');

// Const definition
const DEFAULT_API_ENTRY_POINT = 'https://api.cloud.appcelerator.com',
	DEFAULT_APP_OPTIONS = {
		apiEntryPoint: DEFAULT_API_ENTRY_POINT
	},
	HTTP_METHOD_LIST = ['get', 'post', 'update', 'delete'];


var executeACS = function(options) {
	if (!options || !options.acsObjectKey || !options.acsObjectName || !options.acsObjectMethodKey || !options.acsObjectMethodName || !options.httpMethod) {
		throw new ACSError(messages.ERR_MISS_REQUIRED_PARAMETER, {
			typeName: 'in executeACS'
		});
	}
	var requiredParams = acsCollection[options.acsObjectKey].methods[options.acsObjectMethodKey].requiredParam;
	var optionalParams = acsCollection[options.acsObjectKey].methods[options.acsObjectMethodKey].optionalParam;
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
			requiredParams: requiredParams,
			optionalParams: optionalParams,
			restOptions: restOptions
		}, callback);
	};
};

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


// acsAppKey: ACS app key (required)
// appOptions: ACS app options (optional)
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

for (var i = 0; i < acsCollection.objectList.length; i++) {
	var acsObjectKey = acsCollection.objectList[i];
	var acsObjectKeyLowercase = acsObjectKey.toLowerCase();
	var acsObject = acsCollection[acsObjectKey];
	for (var j = 0; j < acsObject.methodList.length; j++) {
		var acsObjectMethodKey = acsObject.methodList[j];
		var acsObjectMethodKeyCapitalized = u.capitalizedString(acsObjectMethodKey);
		var acsObjectMethod = acsObject.methods[acsObjectMethodKey];
		var httpMethod = acsObjectMethod.httpMethod;
		var restMethod = acsObjectMethod.restMethod ? acsObjectMethod.restMethod : acsObjectMethodKey;
		var methodName = acsObjectKeyLowercase + acsObjectMethodKeyCapitalized;
		ACSApp.prototype[methodName] = executeACS({
			acsObjectKey: acsObjectKey,
			acsObjectName: acsObjectKeyLowercase,
			acsObjectMethodKey: acsObjectMethodKey,
			acsObjectMethodName: restMethod,
			httpMethod: httpMethod
		});
	}
}
for (var i = 0; i < HTTP_METHOD_LIST.length; i++) {
	var httpMethod = HTTP_METHOD_LIST[i];
	ACSApp.prototype[httpMethod] = executeACSRest(httpMethod);
}

ACSApp.prototype.setSessionByCookieString = function(cookieString) {
	this.appOptions.cookieString = cookieString;
};

ACSApp.prototype.getACSCollection = function() {
	return acsCollection;
};


var createACSApp = function(acsAppKey, appOptions) {
	return new ACSApp(acsAppKey, appOptions);
};
module.exports = createACSApp;
