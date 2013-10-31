var logger = require('../util/logger.js'),
	_ = require('underscore')._,
	u = require('../util/util.js'),
	https = require('https'),
	http = require('http'),
	urllib = require('url'),
	querystring = require('querystring'),
	zlib = require('zlib')
;

/**
 * minimal XHR client in Ti API
 */
function NetworkClient(opts)
{
	var self = this;
	var options;
	var method;
	var req;
	var url;
	var reqHeaders = {};
	
	this.abort = function()
	{
		if (req)
		{
			req.abort();
			req = null;
		}
	};
	
	//onsendstream, ondatastream, onerror
	
	this.setRequestHeader = function(k,v)
	{
		reqHeaders[k]=v;
	};
	
	this.send = function(d)
	{
		var r = options.port == 443 || url.substring(0,6)=='https:' ? https : http;
		options.method = method;
		var post_data = d ? querystring.stringify(d) : null;
		reqHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
		if (post_data) reqHeaders['Content-Length'] = String(post_data.length);
		
		req = r.request( _.extend(options,opts,{headers:reqHeaders}) );
		req.on("error",function(err)
		{
			var onerror = self.onerror || opts.onerror;
			if (_.isFunction(onerror))
			{
				_.bind(onerror,self)(err);
			}
		});
		req.on('response', function(response) 
		{
			self.status = response.statusCode;
			self.headers = response.headers;
			
			function performOnload(body)
			{
				self.responseText = body;
				var onload = self.onload || opts.onload;
				if (_.isFunction(onload))
				{
					_.bind(onload,self)();
				}
				req = null;
			}
			
			var data = '';
			switch (response.headers['content-encoding']) 
			{
		  		case 'gzip':
				case 'zlib':
				{
			      	var gunzip = zlib.createUnzip();
			      	response.pipe(gunzip);
					gunzip.on('data', function(chunk) {
						data += chunk;
					});
			      	gunzip.on('end', function() {
						performOnload(data);
			      	});
					break;
				}
				default:
				{
					response.on('data',function(b) {
						data+=b;
					});
					response.on('end',function(e) {
						performOnload(data);
					});
				}
			}
		});

 		req.end(post_data);
	};
	
	this.open = function(m, u, async /*for now, ignore*/)
	{
		method = m;
		url = u;
		options = urllib.parse(u);
	};
}

exports.createHTTPClient = function(opts)
{
	return new NetworkClient(opts || {});
};
