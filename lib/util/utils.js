var querystring = require('querystring');
var OAuth = require('../oauth/oauth');

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
	var request_data = querystring.stringify(data);
	if(!header) {
		header = {};
	}
	header['Content-Length'] = request_data.length;
	header['Content-Type'] = 'application/x-www-form-urlencoded';
	var options = {
		'host': host,
		'port': port,
		'path': path,
		'method': method,
		'headers': header
	};
	
	var protocal = null;
	if(useSecure) {
		protocal = require('https');
	} else {
		protocal = require('http');
	}
	
	var req = protocal.request(options);
	req.on('response', function(response) {

        var statusCode = response.statusCode;

        function performOnload(body) {
			if(body && body.trim().length > 0) {

                try {
                    var data = JSON.parse(body);
                } catch(E) {
                    if(statusCode == 200) statusCode = 500;
                    return callback(buildErrResponse(statusCode, body));
                }

				if(data && data.meta) {
					if(data.meta.session_id) {
						var sessionId = data.meta.session_id;
						sdk.session_id = sessionId;
					}
				}
				callback(data);
			} else {
				callback(errServerReturn);
			}
		}
		
		var data = '';
		response.on('data',function(chunk) {
			data += chunk;
		});
		response.on('end',function() {
			performOnload(data);
		});
	});
	
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
		
		var options = {
			'host': host,
			'port': port,
			'path': path,
			'method': method,
			'headers': header 
		};

		var protocal = null;
		if(useSecure) {
			protocal = require('https');
		} else {
			protocal = require('http');
		}
		
		var req = protocal.request(options);

		req.on('response', function(response) {

            var statusCode = response.statusCode;

			function performOnload(body) {
				if(body && body.trim().length > 0) {

                    try {
                        var data = JSON.parse(body);
                    } catch(E) {
                        if(statusCode == 200) statusCode = 500;
                        return callback(buildErrResponse(statusCode, body));
                    }

					if(data && data.meta) {
						if(data.meta.session_id) {
							var sessionId = data.meta.session_id;
							sdk.session_id = sessionId;
						}
					}
					callback(data);
				} else {
					callback(errServerReturn);
				}
			}
			
			var data = '';
			response.on('data',function(chunk) {
				data += chunk;
			});
			response.on('end',function() {
				performOnload(data);
			});
		});
		
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