var OAuth = require('./oauth/oauth');
var utils = require('./util/utils');
var mime = require('./mime/mime');
var fs = require('fs');
var path = require('path');

var apiKey;
var consumerKey;
var consumerSecret;
var baseURL;
var sessionID;

const COOKIE_NAME = '_session_id';

function ACSLIB(key, secret, baseURL) {
    if (!secret) {
        this.appKey = key;
    } else {
        this.oauthKey = key;
        this.oauthSecret = secret;
    }
    if (baseURL) {
        if(baseURL.indexOf(":") > 0) {
            this.apiBaseURL = baseURL.substring(0, baseURL.indexOf(":"));
            this.apiPort = baseURL.substring(baseURL.indexOf(":") + 1);
        } else {
            this.apiBaseURL = baseURL;
        }
    } else {
        this.apiBaseURL = utils.baseURL;
    }
    return this;
}

ACSLIB.prototype.sendRequest = function(url, method, data, callback, useSecure) {
    var authType = utils.getAuthType(this);
    if (authType == utils.unknown) {
        return callback && callback(utils.noAppKeyError);
    }
    
    var isSecure = true;
    if(arguments.length == 4) {
        isSecure = true;
    } else if(arguments.length == 5) {
        isSecure = useSecure;
    } else {
        return callback && callback(utils.invalidArgumentError);
    }

    var protocol = isSecure ? "https://" : "http://";
    var port = this.apiPort || (isSecure ? 443 : 80);
    
    //build request url
    var reqURL = "/" + utils.version + "/" + url;
    
    if (authType == utils.app_key) {
        if(reqURL.indexOf("?") != -1) {
            reqURL += "&" + utils.keyParam + '=' + this.appKey;
        } else {
            reqURL += "?" + utils.keyParam + '=' + this.appKey;
        }
    }
    
    data = data || {};
    
    var apiMethod = method ? method.toUpperCase() : utils.get_method;
    data[utils.suppressCode] = 'true';
    var sessionId = data['session_id'] || sessionID; // Get Session from data which user can send it as a parameter in data
    
    if (sessionId && reqURL.indexOf(sessionId)===-1) {
        if(reqURL.indexOf("?") != -1) {
            reqURL += "&" + utils.sessionId + '=' + sessionId;
        } else {
            reqURL += "?" + utils.sessionId + '=' + sessionId;
        }
    }

    data = utils.cleanInvalidData(data);
    
    var fileObj = utils.getFileObject(data);

    if(fileObj) {
        //send request with file
        var fileName = '';
        var filePath = '';
        if(typeof fileObj == 'string') {
            filePath = fileObj;
            fileName = path.basename(fileObj);
        } else if(typeof fileObj == 'object') {
            if(fileObj.path && fileObj.name) {
                filePath = fileObj.path;
                fileName = fileObj.name;
            } else {
                return callback && callback(utils.fileTypeError);
            }
        }
        
        try {
            var binary = fs.readFileSync(filePath);
            if(binary) {
                var filePropName = 'file';
                if(data['file']) {
                    delete data['file'];
                } else if(data['photo']) {
                    delete data['photo'];
                    filePropName = 'photo';
                }
                
                var mimeType = mime.lookup(fileName);
                if(!mimeType) {
                    mimeType = 'text/plain';
                }
                
                var header = {};
                if(authType == utils.oauth) {
                    var message = { 
                        method: apiMethod,
                        parameters: []
                    };
                    
                    if(port != 443 && port != 80) {
                        message['action'] = protocol + this.apiBaseURL + ":" + port + reqURL;
                    } else {
                        message['action'] = protocol + this.apiBaseURL + reqURL;
                    }
                    utils.populateOAuthParameters(message.parameters, this.oauthKey);
                    OAuth.completeRequest(message, {consumerSecret: this.oauthSecret});
                    header[utils.oauth_header] = OAuth.getAuthorizationHeader("", message.parameters);
                }
                
                utils.sendRequestWithFile(this.apiBaseURL, port, reqURL, apiMethod, data, header, isSecure, callback, this, filePropName, fileName, binary, mimeType);
            } else {
                return callback && callback(utils.fileLoadError);
            }
        } catch(e) {
            return callback && callback(utils.fileLoadError);
        }   
    } else {
        //send request without file
        var header = {};
        if(authType == utils.oauth) {
            var message = { 
                method: apiMethod,
                parameters: []
            };
            
            if(port != 443 && port != 80) {
                message['action'] = protocol + this.apiBaseURL + ":" + port + reqURL;
            } else {
                message['action'] = protocol + this.apiBaseURL + reqURL;
            }
            
            for (var prop in data) {
                if (!data.hasOwnProperty(prop)) {
                    continue;
                }
                message.parameters.push([prop, data[prop]]);
            }
            utils.populateOAuthParameters(message.parameters, this.oauthKey);
            OAuth.completeRequest(message, {consumerSecret: this.oauthSecret});
            header[utils.oauth_header] = OAuth.getAuthorizationHeader("", message.parameters);
        }
        
        utils.sendRequest(this.apiBaseURL, port, reqURL, apiMethod, data, header, isSecure, callback, this);
    }
};

// A generic method with the provided data, executing the provided callback when we get a response.
// This function could use req & res to send and receive the data which is supported by the module
// of express from server. The session data has been include in res & req,
// so that could make the option easier.
ACSLIB.prototype.rest = function(url, method, data, callback, req, res) {
    if(req && res) {
        if(req.cookies[COOKIE_NAME]) {
            if(!data) {
                data = {};
            }
            data.session_id = req.cookies[COOKIE_NAME] || sessionID;
        }
    }
    else {
        data.session_id = sessionID;
    }
    this.sendRequest(url, method, data, function handleResponse(evt) {
        if (evt.meta && evt.meta.status === 'ok') {
            if (evt.meta.session_id) {
                sessionID = evt.meta.session_id;
                res && res.cookie(COOKIE_NAME, evt.meta.session_id);
            }
        }
        callback && callback(evt);
    }, true);
};

function initACS(key, secret, baseUrl) {
    //TODO: this doesn't make sense. why pass them into an instance
    //and then also store global? either make it a singleton or make
    //it an class that should be instantiated --Jeff.
    apiKey = key;
    consumerKey = key;
    consumerSecret = secret;
    baseURL = baseUrl;
    return new ACSLIB(key, secret, baseUrl);
};

defineCloud(exports);

function defineCloud(Cloud) {
    /*!
     * BedFrame v0.4 by Dawson Toth
     * A framework for exposing RESTful APIs to Appcelerator Titanium Mobile.
     * 
     * This framework is designed for REST APIs with the following characteristics:
     *  1) Contains many different methods, in many different namespaces.
     *  2) Method signatures are all very similar.
     *  
     * You probably don't need this framework if:
     *  1) You only want to expose a couple methods.
     *  
     * To learn more about this framework, or get the latest version, check out:
     *  https://github.com/dawsontoth/BedFrame
     *
     * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     */
    
    /**
     * This can be used as a module or as an included file. If you are including it (or inlining it) in to another module,
     * then you should replace the below with simply var BedFrame = {}, removing the exports ternary expression.
     */
    var BedFrame = {};
    
    /**
     * Default property type that results in only the latest specified value being used (that is, the deepest child's value
     * will be used over any of its parents). Particularly useful for specifying default values that most children use, and
     * then overriding those default values on exceptional children.
     */
    BedFrame.PROPERTY_TYPE_ONLY_LATEST = 0;
    /**
     * Property type that results in child values equating to their parent value plus their own, separated by a forward
     * slash. Particularly useful for creating a URL hierarchy.
     */
    BedFrame.PROPERTY_TYPE_SLASH_COMBINE = 1;
    /**
     * Property type that results in a parent value not propogating to its children.
     */
    BedFrame.PROPERTY_TYPE_IGNORE = 2;
    
    /**
     * Recursively builds a full API on the target object, as defined in the api object. Properties will be added to the target object,
     * but the object reference itself will not be altered. This means you can safely "build" on a CommonJS exports object.
     *
     * @param target The object that the API will be created in.
     * @param api The specifications for the API you want to expose through objects. Read "THE API OBJECT" in readme.md to find out more.
     */
    BedFrame.build = function bedFrameTransformObject(target, api) {
        // Save a reference to the children property of the current segment of the API.
        var children = api.children || [];
    
        // Iterate over every child to set up its API.
        for (var c in children) {
            // Avoid prototyped members.
            if (!children.hasOwnProperty(c))
                continue;
            // Create a shorter reference to the present child.
            var child = children[c];
            // Determine the present property types, or default to an empty object.
            // (We will pass this variable down in the next step; propertyTypes is itself by default typed ONLY_LATEST).
            var propertyTypes = child.propertyTypes || api.propertyTypes || {};
            // Don't pass down children (that causes an infinite recursion).
            propertyTypes.children = BedFrame.PROPERTY_TYPE_IGNORE;
    
            // Iterate over every member of the current segment of the API.
            for (var o in api) {
                // Avoid prototyped members and children.
                if (!api.hasOwnProperty(o))
                    continue;
                // Based on the property type specified for this API, cascade property down from parent to child.
                switch (propertyTypes[o] || BedFrame.PROPERTY_TYPE_ONLY_LATEST) {
                    case BedFrame.PROPERTY_TYPE_ONLY_LATEST:
                        // ONLY_LATEST results in child taking precedence over the parent, completely replacing the value.
                        child[o] = child[o] === undefined ? api[o] : child[o];
                        break;
                    case BedFrame.PROPERTY_TYPE_SLASH_COMBINE:
                        // SLASH_COMBINE results in the child ending up with a slash-separated-value from the top most
                        // parent to the present child, where elements without a value are ignored (there won't be any
                        // double slashes in the computed value).
                        var parts = [];
                        if (api[o])
                            parts.push(api[o]);
                        if (child[o])
                            parts.push(child[o]);
                        child[o] = parts.join('/');
                        break;
                }
            }
    
            // If the current child specifies the method property, and does not have any children, it's an endpoint and
            // needs to be set up as a method. Inject it in to the target.
            if (child.method && !child.children) {
                target[child.method] = (function (child) {
                    return function () {
                        // Executors are designed to work based off of their context. Act upon the child, which is a mixed
                        // down result of its parent, and its parent's parent, and so on.
                        return child.executor.apply(child, arguments);
                    };
                })(child);
            }
            // Otherwise, inject the new property in to the target, and recurse upon the sub-segment of the API.
            else if (child.property) {
                bedFrameTransformObject(target[child.property] = {}, child);
            }
        }
    };

    /**
     * Throws an exception if an argument has not been provided, or is not of the expected type.
     * @param name The string display name of the argument (such as 'data')
     * @param arg The actual provided argument
     * @param type The string value of the expected argument type (such as 'object' or 'string').
     */
    function requireArgument(name, arg, type) {
        if (arg === undefined)
            throw 'Argument ' + name + ' was not provided!';
        if (typeof(arg) != type)
            throw 'Argument ' + name + ' was an unexpected type! Expected: ' + type + ', Received: ' + typeof(arg);
    }

    /**
     * Calls the ACS REST API with the provided data, executing the provided callback when we get a response.
     * @param data
     * @param callback optional callback function
     */
    function defaultExecutor(data, callback, req, res) {
        requireArgument('data', data, 'object');
        
        propagateRestNames(this);
        if (!this.url) {
            this.url = this.restNamespace + '/' + this.restMethod + '.json';
        }
        var secure = Cloud.useSecure == undefined ? true : Cloud.useSecure;
        if (Cloud.debug) {
            console.log('ACS Request: { ' +
                'url: "' + this.url + '", ' +
                'verb: "' + this.verb + '", ' +
                'secure: ' + (secure ? 'YES' : 'NO') + ', ' +
                'data: ' + JSON.stringify(data) + ' ' +
                '})');
        }
        
        if (req && res) {
            if(req.cookies[COOKIE_NAME]) {
                data = data || {};
                data.session_id = req.cookies[COOKIE_NAME];
            }
        }
        else {
            data.session_id = sessionID;
        }
        
        ACS.send(this.url, this.verb, data, secure,
            function handleResponse(evt) {
                var response = evt.response || {};
                if (evt.meta && evt.meta.status === 'ok') {
                    response.success = true;
                    response.error = false;
                    response.meta = evt.meta;
                    if (Cloud.debug) {
                        console.log(JSON.stringify(response));
                    }
                    if (response.meta.session_id) {
                        sessionID = response.meta.session_id;
                        res && res.cookie(COOKIE_NAME, response.meta.session_id);
                    }
                } else {
                    response.success = false;
                    response.error = true;
                    response.code = evt.meta ? evt.meta.code : evt.statusCode;
                    response.message = evt.meta ? evt.meta.message : (evt.message || evt.statusText);
                    if (Cloud.debug) {
                        console.log(response.code + ': ' + response.message);
                    }
                }
                callback && callback(response);
            }
        );
    }
    
    function hasStoredSession() {
        return ACS.hasStoredSession();
    }
    
    function retrieveStoredSession() {
        return ACS.retrieveStoredSession();
    }

    function dataOptionalExecutor() {
        if(typeof arguments[0] == 'function') {
            defaultExecutor.call(this, {}, arguments[0], arguments[1], arguments[2]);
        } else {
            defaultExecutor.call(this, arguments[0], arguments[1], arguments[2], arguments[3]);
        }
    }

    function dataExcludedExecutor(callback, req, res) {
        defaultExecutor.call(this, {}, callback, req, res);
    }

    function classnameRequiredExecutor(data, callback, req, res) {
        var savedClassName;
        if (data && typeof(data) == 'object') {
            requireArgument('data.classname', data.classname, 'string');
            propagateRestNames(this);
            this.url = this.restNamespace + '/' + data.classname + '/' + this.restMethod + '.json';
            // We don't want the class name passed as a variable, so delete it from data.
            savedClassName = data.classname;
            delete data.classname;
        }
        defaultExecutor.call(this, data, callback, req, res);
        // Now restore it to the data object so that we don't corrupt the object for subsequent calls.
        data.classname = savedClassName;
    }
    
    function propagateRestNames(context) {
        if (!context.restNamespace) {
            context.restNamespace = context.property.toLowerCase();
        }
        if (!context.restMethod) {
            context.restMethod = context.method.toLowerCase();
        }
    }

    BedFrame.build(Cloud, {
        verb: 'GET',
        executor: defaultExecutor,
        children: [
            { method: 'hasStoredSession', executor: hasStoredSession },
            { method: 'retrieveStoredSession', executor: retrieveStoredSession },
            {
                property: 'ACLs',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'query' },
                    { method: 'update',  verb: 'PUT' },
                    { method: 'show' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' },
                    { method: 'addUser', restMethod: 'add', verb: 'POST' },
                    { method: 'removeUser', restMethod: 'remove', verb: 'DELETE' },
                    { method: 'checkUser', restMethod: 'check' }
                ]
            },
            {
                property: 'Chats',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'query' },
                    { method: 'getChatGroups', restMethod: 'get_chat_groups', executor: dataOptionalExecutor }
                ]
            },
            {
                property: 'Checkins',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'query', executor: dataOptionalExecutor },
                    { method: 'show' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' }
                ]
            },
            {
                property: 'Clients',
                children: [
                    { method: 'geolocate', executor: dataOptionalExecutor }
                ]
            },
            {
                property: 'Emails',
                restNamespace: 'custom_mailer',
                children: [
                    { method: 'send', verb: 'POST', restMethod: 'email_from_template' }
                ]
            },
            {
                property: 'Events',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'show' },
                    { method: 'showOccurrences', restMethod: 'show/occurrences' },
                    { method: 'query', executor: dataOptionalExecutor },
                    { method: 'queryOccurrences', restMethod: 'query/occurrences', executor: dataOptionalExecutor },
                    { method: 'search', executor: dataOptionalExecutor },
                    { method: 'searchOccurrences', restMethod: 'search/occurrences', executor: dataOptionalExecutor },
                    { method: 'update', verb: 'PUT' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' }
                ]
            },
            {
                property: 'Files',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'query', executor: dataOptionalExecutor },
                    { method: 'show' },
                    { method: 'update', verb: 'PUT' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' }
                ]
            },
            {
                property: 'Friends',
                children: [
                    { method: 'add', verb: 'POST' },
                    { method: 'approve', verb: 'PUT' },
                    { method: 'remove', verb: 'DELETE' },
                    { method: 'requests', executor: dataOptionalExecutor },
                    { method: 'search'}
                ]
            },
            {
                property: 'KeyValues',
                children: [
                    { method: 'set', verb: 'PUT' },
                    { method: 'get' },
                    { method: 'append', verb: 'PUT' },
                    { method: 'increment', restMethod: 'incrby', verb: 'PUT' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' }
                ]
            },
            {
                property: 'Messages',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' },
                    { method: 'removeThread', restMethod: 'delete/thread', verb: 'DELETE' },
                    { method: 'reply', verb: 'POST' },
                    { method: 'show' },
                    { method: 'showInbox', restMethod: 'show/inbox', executor: dataOptionalExecutor },
                    { method: 'showSent', restMethod: 'show/sent', executor: dataOptionalExecutor },
                    { method: 'showThread', restMethod: 'show/thread' },
                    { method: 'showThreads', restMethod: 'show/threads', executor: dataOptionalExecutor }
                ]
            },
            {
                property: 'Objects',
                executor: classnameRequiredExecutor,
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'show' },
                    { method: 'update', verb: 'PUT' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' },
                    { method: 'query' }
                ]
            },
            {
                property: 'PhotoCollections',
                restNamespace: 'collections',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'show' },
                    { method: 'update', verb: 'PUT' },
                    { method: 'search' },
                    { method: 'showSubcollections', restMethod: 'show/subcollections' },
                    { method: 'showPhotos', restMethod: 'show/photos' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' }
                ]
            },
            {
                property: 'Photos',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'show' },
                    { method: 'search' },
                    { method: 'query', executor: dataOptionalExecutor },
                    { method: 'update', verb: 'PUT' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' }
                ]
            },
            {
                property: 'Places',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'search', executor: dataOptionalExecutor },
                    { method: 'show' },
                    { method: 'update', verb: 'PUT' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' },
                    { method: 'query', executor: dataOptionalExecutor }
                ]
            },
            {
                property: 'Posts',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'show' },
                    { method: 'query', executor: dataOptionalExecutor },
                    { method: 'update', verb: 'PUT' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' }
                ]
            },
            {
                property: 'PushNotifications',
                restNamespace: 'push_notification',
                verb: 'POST',
                children: [
                    { method: 'subscribe' },
                    { method: 'unsubscribe', verb: 'DELETE' },
                    { method: 'notify' },
                    { method: 'subscribeToken', restMethod: 'subscribe_token', verb: 'POST' },
                    { method: 'unsubscribeToken', restMethod: 'unsubscribe_token', verb: 'DELETE' },
                    { method: 'notifyTokens', restMethod: 'notify_tokens', verb: 'POST' }
                ]
            },
            {
                property: 'Reviews',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'show' },
                    { method: 'query' },
                    { method: 'update', verb: 'PUT' },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE' }
                ]
            },
            {
                property: 'SocialIntegrations',
                restNamespace: 'users',
                children: [
                    { method: 'externalAccountLogin', restMethod: 'external_account_login', verb: 'POST' },
                    { method: 'externalAccountLink', restMethod: 'external_account_link', verb: 'POST' },
                    { method: 'externalAccountUnlink', restMethod: 'external_account_unlink', verb: 'DELETE' },
                    { method: 'searchFacebookFriends', restNamespace: 'social', restMethod: 'facebook/search_friends',
                        executor: dataExcludedExecutor
                    }
                ]
            },
            {
                property: 'Statuses',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'search' },
                    { method: 'update', verb: 'PUT' },
                    { method: 'query', executor: dataOptionalExecutor }
                ]
            },
            {
                property: 'Users',
                children: [
                    { method: 'create', verb: 'POST' },
                    { method: 'login', verb: 'POST' },
                    { method: 'show' },
                    { method: 'showMe', restMethod: 'show/me', executor: dataExcludedExecutor },
                    { method: 'search', executor: dataOptionalExecutor },
                    { method: 'query', executor: dataOptionalExecutor },
                    { method: 'update', verb: 'PUT' },
                    { method: 'logout',
                        executor: function (callback, req, res) {
                            defaultExecutor.call(this, {}, function (evt) {
                                ACS.reset();
                                if(req && res) {
                                    res.cookie(COOKIE_NAME, '');
                                }
                                sessionID = null;
                                callback && callback(evt);
                            }, req, res);
                        }
                    },
                    { method: 'remove', restMethod: 'delete', verb: 'DELETE',
                        executor: function () {
                            if(typeof arguments[0] == 'function') {
                                var callback = arguments[0];
                                var req = arguments[1];
                                var res = arguments[2];
                                defaultExecutor.call(this, {}, function (evt) {
                                    ACS.reset();
                                    if(req && res) {
                                        res.cookie(COOKIE_NAME, '');
                                    }
                                    callback && callback(evt);
                                }, req, res);
                            } else {
                                var data = arguments[0];
                                var callback = arguments[1];
                                var req = arguments[2];
                                var res = arguments[3];
                                defaultExecutor.call(this, data, function (evt) {
                                    ACS.reset();
                                    if(req && res) {
                                        res.cookie(COOKIE_NAME, '');
                                    }
                                    callback && callback(evt);
                                }, req, res);
                            }
                        }
                    },
                    { method: 'requestResetPassword', restMethod: 'request_reset_password' }
                ]
            }
        ]
    });
    var ACS = (function defineNativeACS() {
        var ACS = {};
        
        function ACSSession(key, secret, baseURL) {
            return initACS(key, secret, baseURL);
        }

        ACSSession.prototype.sendRequest = function (url, method, data, useSecure, callback) {
            this.sendRequest(url, method, data, callback, useSecure);
        };

        function fetchSession() {
            if (consumerKey && consumerSecret) {
                return new ACSSession(consumerKey, consumerSecret, baseURL);
            }
            if (apiKey) {
                return new ACSSession(apiKey, null, baseURL);
            }

            throw 'ACS CREDENTIALS NOT SPECIFIED!';
        }

        var session = null;
        ACS.send = function (url, method, data, useSecure, callback) {
            session = session || fetchSession();
            if(!session) {
                return; // how is this possible from above?
            }
            
            if(data) {
                var session_id = data.session_id || sessionID;
                if (session_id) {
                    if(url.indexOf("?") != -1) {
                        url += '&_session_id=' + session_id;
                    } else {
                        url += '?_session_id=' + session_id;
                    }
                }
                delete data.session_id;
            }

            session.sendRequest(url, method, data, callback, useSecure);
        };
        
        ACS.hasStoredSession = function() {
            /*
            if(session) {
                if(session.session_id && session.session_id != 'undefined')
                    return true;
            }
            */
            return false;
        };
        
        ACS.retrieveStoredSession = function() {
            /*
            if(session) {
                if(session.session_id && session.session_id != 'undefined')
                    return session_id;
            }
            */
            return null;
        };

        ACS.reset = function () {
            session = null;
        };

        return ACS;
    })();

    return Cloud;
}

exports.init = initACS;
exports.initACS = initACS;
exports.createCocoafish = initACS;
