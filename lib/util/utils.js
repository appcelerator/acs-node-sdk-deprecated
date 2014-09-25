var querystring = require('querystring');
var OAuth = require('../oauth/oauth');
var zlib = require('zlib');

//URL
exports.baseURL = 'api.cloud.appcelerator.com';
exports.version = 'v1';

//HTTP methods
exports.get_method = 'GET';

//Authentication Types
exports.app_key = 1;
exports.oauth = 2;
exports.unknown = -1;

//Others
exports.keyParam = 'key';
exports.sessionId = '_session_id';
exports.suppressCode = 'suppress_response_codes';
exports.oauth_consumer_key = 'oauth_consumer_key';
exports.oauth_header = 'Authorization';
exports.noAppKeyError = {'meta' : {'status': 'fail', 'code': 409, 'message': 'Application key is not provided.'}};
exports.fileLoadError = {'meta' : {'status': 'fail', 'code': 400, 'message': 'Unable to load file.'}};
exports.fileTypeError = {'meta' : {'status': 'fail', 'code': 400, 'message': 'Invalid file path.'}};
exports.invalidArgumentError = {'meta' : {'status': 'fail', 'code': 400, 'message': 'Invalid number of arguments, expecting at least 4 arguments.'}};
errServerReturn = {'meta' : {'status': 'fail', 'code': 400, 'message': 'Invalid request sent.'}};

exports.getAuthType = function(obj) {
	if(obj) {
		if(obj.appKey) {
			return exports.app_key;
		} else if (obj.oauthKey && obj.oauthSecret) {
			return exports.oauth;
		}
	}
	return exports.unknown;
};

exports.getFileObject = function(data) {
	if(data) {
		for (prop in data) {
		    if (!data.hasOwnProperty(prop)) {
		        continue;
		    }
		    if(prop == 'photo' || prop == 'file') {
		    	return data[prop];
		    }
		}
	}
	return null;
};

exports.cleanInvalidData = function(data) {
	if(data) {
		for (prop in data) {
		    if (!data.hasOwnProperty(prop)) {
		        continue;
		    }
		    if (data[prop] == null) {
		    	delete data[prop];
		    }
		    if (prop == 'custom_fields' || prop == 'fields' || prop == 'where') {
		    	if (typeof data[prop] == 'object') {
		    		try {
		    			data[prop] = JSON.stringify(data[prop]);
		    		} catch (e) {
		    			throw new Error(prop + ' is invaild. ' + e.name + ': ' + e.message);
		    		}
		    	}
		    }
		}
		return data;
	} else {
		return {};
	}
};

exports.populateOAuthParameters = function(parameters, oauthKey) {
	if (parameters && oauthKey) {
		parameters.push(["oauth_version", "1.0"]);
		parameters.push(["oauth_consumer_key", oauthKey]);
		parameters.push(["oauth_signature_method", "HMAC-SHA1"]);
		parameters.push(["oauth_nonce", OAuth.nonce(15)]);
	}
};

exports.sendRequest = function(host, port, path, method, data, header, useSecure, callback, sdk) {
	var keys = Object.keys(data);
	for(var i in keys) {
		if(Object.prototype.toString.call(data[keys[i]]) === '[object Object]') {
			data[keys[i]] = JSON.stringify(data[keys[i]])
		}
	}

	var request_data = querystring.stringify(data);
	if(!header) {
		header = {};
	}
	header['Content-Length'] = request_data.length;
	header['Content-Type'] = 'application/x-www-form-urlencoded';
    header['Accept-Encoding'] = 'gzip';
	var options = {
		'host': host,
		'port': port,
		'path': path,
		'method': method,
		'headers': header
	};
	
	var protocol = null;
	if(useSecure) {
		protocol = require('https');
	} else {
		protocol = require('http');
	}
	
	var req = protocol.request(options);
	req.on('response', APIResponseHandler(sdk, callback));
	
	req.on("error",function(err) {
		callback(errServerReturn);
	});
	
	req.end(request_data);
};

exports.sendRequestWithFile = function(host, port, path, method, data, header, useSecure, callback, sdk, filePropName, fileName, fileBinary, mimeType) {
	prepareRequestBody(data, filePropName, fileName, fileBinary, mimeType, function(post_data, boundary){
		var length = 0;
		for(var i = 0; i < post_data.length; i++) {
		    length += post_data[i].length;
		}
		
		if(!header) {
			header = {};
		}
		header['Content-Type'] = 'multipart/form-data; boundary=' + boundary;
		header['Content-Length'] = length;
        header['Accept-Encoding'] = 'gzip';

		var options = {
			'host': host,
			'port': port,
			'path': path,
			'method': method,
			'headers': header 
		};

		var protocol = null;
		if(useSecure) {
			protocol = require('https');
		} else {
			protocol = require('http');
		}
		
		var req = protocol.request(options);

		req.on('response', APIResponseHandler(sdk, callback));
		
		req.on("error",function(err) {
			callback(errServerReturn);
		});
		
		for (var i = 0; i < post_data.length; i++) {
			req.write(post_data[i]);
		}
		req.end();
	});
};

//Generate post body with file
function encodeFieldPart(boundary, name, value) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\"\r\n\r\n";
    return_part += value + "\r\n";
    return return_part;
}

function encodeFilePart(boundary, type, name, filename) {
    var return_part = "--" + boundary + "\r\n";
    return_part += "Content-Disposition: form-data; name=\"" + name + "\"; filename=\"" + filename + "\"\r\n";
    return_part += "Content-Type: " + type + "\r\n\r\n";
    return return_part;
}

function prepareRequestBody(params, filePropName, fileName, fileBinary, mimeType, callback) {
	var boundary = Math.random();
	var post_data = [];
	
	if(params) {
		for(prop in params) {
			post_data.push(new Buffer(encodeFieldPart(boundary, prop, params[prop]), 'ascii'));
		}
	}
	
	post_data.push(new Buffer(encodeFilePart(boundary, mimeType, filePropName, fileName), 'ascii'));
	post_data.push(new Buffer(fileBinary));
	post_data.push(new Buffer("\r\n--" + boundary + "--"), 'ascii');
	
	callback(post_data, boundary);
}

function buildErrResponse(code, message) {
    return {'meta' : {'status': 'fail', 'code': code, 'message': message}};
}

function APIResponseHandler(sdk, callback) {

    return function(response) {

        function performOnload(body) {

            if(!body)
                return callback(errServerReturn);

            var statusCode = response.statusCode;
            if(statusCode !== 200) {
                return callback(buildErrResponse(statusCode, body.toString()));
            }

            var contentEncoding = response.headers['content-encoding'];
            if(contentEncoding && contentEncoding.indexOf('gzip') !== -1) {
                zlib.gunzip(body, parseResult);
                return;
            } else {
                body = body.toString();
                if(body.trim().length > 0) {
                    parseResult(null, body);
                } else {
                    callback(errServerReturn);
                }
            }
        }

        function parseResult(err, resbody) {
            if(err) {
                return callback(errServerReturn);
            }

            try {
                var data = JSON.parse(resbody);
            } catch(E) {
                if(statusCode == 200) statusCode = 500;
                return callback(buildErrResponse(statusCode, resbody));
            }

            callback(data);
        }

        var buffer = [];
        var bodyLen = 0
        response.on('data',function(chunk) {
            buffer.push(chunk)
            bodyLen += chunk.length
        });
        response.on('end',function() {
            var body = null;
            if (buffer.length && Buffer.isBuffer(buffer[0])) {
                body = new Buffer(bodyLen)
                var i = 0
                buffer.forEach(function (chunk) {
                    chunk.copy(body, i, 0, chunk.length);
                    i += chunk.length;
                });
            } else if (buffer.length) {
                body = buffer.join('')
            }

            performOnload(body);
        });

    }
}