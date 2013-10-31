var logger = require('./logger.js'), 
	jsp = require("uglify-js").parser, 
	pro = require("uglify-js").uglify, 
	path = require('path'), 
	fs = require('fs'), 
	_ = require('underscore')._, 
	colors = require('colors'), 
	program = require('commander'), 
	urllib = require('url'), 
	http = require('http'), 
	globalConfig, 
	defaultConfig;

function generateTemplate(name, config, outFile, compile) {
	var fn = path.join(__dirname, 'templates', name);
	var results = '';
	if(compile) {
		var compiled = _.template(fs.readFileSync(fn, 'utf8'));
		results = compiled(config || {});
	} else {
		results = fs.readFileSync(fn);
	}
	if(compile) {
		fs.writeFileSync(outFile, results, 'utf8');
	} else {
		fs.writeFileSync(outFile, results, 'utf8');
	}
}

function generateTemplateDir(dir, config, outdir) {
	if(!exists(outdir)) {
		fs.mkdirSync(outdir);
	}
	var fn = path.join(__dirname, 'templates', dir);
	if(exists(fn)) {
		var files = fs.readdirSync(fn);
		for(var i in files) {
			var file = path.join(fn, files[i]);
			var stat = fs.statSync(file);
			if(stat.isDirectory()) {
				generateTemplateDir(path.join(dir, files[i]), config, path.join(outdir, files[i]));
			} else {
				generateTemplate(path.join(dir, files[i]), config, path.join(outdir, files[i]));
			}
		}
	}
}

function die(msg, errcode) {
	logger.error(msg);
	if (errcode) {
		process.exit(errcode);
	} else {
		process.exit(1);
	}
}

function exists(f) {
	// changes in node 0.8.0
	if (_.isFunction(fs.existsSync)) {
		return fs.existsSync(f);
	}
	return path.existsSync(f);
}

function lpad(x, len, ch) {
	ch = ch || ' ';
	var pre = '';
	var ns = String(x);
	var cur = colors.stripColors(ns).length;
	for ( var c = cur; c < len; c++) {
		pre += ch;
	}
	return pre + ns;
}

function rpad(x, len, ch) {
	ch = ch || ' ';
	var ns = String(x);
	var cur = colors.stripColors(ns).length;
	for ( var c = cur; c < len; c++) {
		ns += ch;
	}
	return ns;
}

function trim(line) {
	return String(line).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function getUserHome() {
	return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getConfigFile() {
	return path.join(getUserHome(), '.' + program.name);
}

function getPathSeparator() {
    return process.platform == 'win32' ? '\\' : '/';
}

function getDefaultConfFile() {
	var nettleExec = process.argv[1];
    nettleExec = fs.realpathSync(nettleExec);
	var nettlePath = nettleExec.substring(0, nettleExec.lastIndexOf(getPathSeparator(),
			nettleExec.lastIndexOf(getPathSeparator()) - 1));
	return nettlePath + getPathSeparator() + 'nettle.conf';
}

function getDefaultConfig() {
	if (defaultConfig) {
		// cache it
		return defaultConfig;
	}
	var cfg = getDefaultConfFile();
	if (exists(cfg)) {
		try {
			defaultConfig = JSON.parse(fs.readFileSync(cfg, 'utf-8'));
			return defaultConfig;
		} catch (E) {
			logger
			.error('Error parsing config file at ' + cfg + '. '
					+ E.stack);
		}
	}
	return {
		publishHost : 'https://admin.cloudapp.appcelerator.com',
		publishPort : '443'
	};
}

function getGlobalConfig() {
	if (globalConfig) {
		// cache it
		return globalConfig;
	}
	var cfg = getConfigFile();
	if (exists(cfg)) {
		try {
			globalConfig = JSON.parse(fs.readFileSync(cfg, 'utf-8'));
			return globalConfig;
		} catch (E) {
			logger
			.error('Error parsing config file at ' + cfg + '. '
					+ E.stack);
		}
	}
	return {};
}

function saveGlobalConfig(o) {
	var cfg = getConfigFile();
	fs.writeFileSync(cfg, stringifyJSON(o), 'utf-8');
	globalConfig = o;
}

function saveLastLogTime(logType, startTime, endTime, lastLogTime) {
    var o = getGlobalConfig();
    o[logType] = {};
    o[logType]['lastLogTime'] = lastLogTime;
    o[logType]['startTime'] = startTime;
    o[logType]['endTime'] = endTime;
    saveGlobalConfig(o);
}

function getLastLogTime(logType) {
    var o = getGlobalConfig();
    return o[logType];
}

function getProxy() {
    var proxy = {};
    proxy.server = getGlobalConfig().proxy || getDefaultConfig().proxy || undefined;
    if(!proxy.server)
        return null;

    var proxy_user = getGlobalConfig().proxy_user || getDefaultConfig().proxy_user || undefined;
    var proxy_pass = getGlobalConfig().proxy_pass || getDefaultConfig().proxy_pass || undefined;

    proxy.url = proxy.server;
    if(proxy_user && proxy_pass) {
        var i = proxy.server.indexOf('//');
        if(i !== -1) {
            proxy.url = proxy.server.substring(0, i + 2);
            proxy.url += proxy_user;
            proxy.url += ':';
            proxy.url += proxy_pass;
            proxy.url += '@';
            proxy.url += proxy.server.substring(i + 2);
        }
    }

    return proxy;
}

function isLoggedIn() {
	var cfg = getGlobalConfig();
	return cfg.session && cfg.mid && cfg.session.sid && cfg.username;
}

function stringifyJSON(j) {
	var ast = jsp.parse("(" + JSON.stringify(j) + ")");
	ast = pro.ast_mangle(ast);
	var final_code = pro.gen_code(ast, {
		beautify : true,
		quote_keys : true
	});
	return final_code = final_code.substring(1, final_code.length - 2); // remove
	// ( )
	// needed
	// for
	// parsing
}

function readConfig(projectdir) {
	if (!exists(projectdir)) {
		die("Couldn't find project at " + projectdir);
	}
	var config = path.join(projectdir, 'package.json');
	if (!exists(config)) {
		die("Couldn't find project at " + projectdir + ". Missing config at "
				+ config);
	}

	return JSON.parse(fs.readFileSync(config, "utf-8"));
}

function findAddresses(cb, results) {

	var i = 0;
	var exec = require('child_process').exec;

	var re = /[^:\-](?:[0-9A-F][0-9A-F][:\-]){5}[0-9A-F][0-9A-F][^:\-]/i;
	var cmds = [ '/sbin/ifconfig', '/bin/ifconfig', 'ifconfig', 'ipconfig /all' ];

	var cbs = [];

	function run_cmd() {
		var cmd = cmds[i];
		exec(cmd, function(err, stdout, stderr) {
			var lines, line, match, cb, j;
			if (!err) {
				lines = stdout.split('\n');
				for (j = 0; j < lines.length; j++) {
					line = lines[j];
					match = re.exec(line);
					if (match) {
						match = match.toString().trim();
						if (match.length) {
							if (!results) {
								results = [];
							}
							results.push(match);
						}
					}
				}
			}

			if (results && results.length > 0) {
				done();
			} else {
				i += 1;
				if (i < cmds.length) {
					run_cmd();
				} else {
					done();
				}
			}
		});
	}
	;

	// Avoid calling out to the shell multiple times.
	// Queue up any callbacks, and call them all when done.
	var done = function() {
		while (cbs.length) {
			cb = cbs.shift();
			cb();
		}
	};

	if (results.length == 0) {
		cbs.push(cb);
		if (cbs.length === 1) {
			run_cmd();
		}
	} else {
		cb();
	}
};

function getMacAddress(cb) {
	if (!(cb instanceof Function)) {
		throw new Error('Argument to address must be a callback function');
	}

	var results = [];

	var respond = function() {
		if (results && results.length >= 1) {
			cb(undefined, results[0]);
		} else {
			cb('No MAC addresses found');
		}
	};

	findAddresses(respond, results);
};

function installDepends(basedir, depends, cb) {
	if (isOnline()) {
		var mods = [];
		if(depends) {
			for ( var k in depends) {
                if(k == 'acs') {
                    logger.warn("'acs' is found in dependencies and will be ignored.");
                    continue;
                }
				var cmd = k + '@' + depends[k];
				logger.debug('dependency => ' + cmd);
				mods.push(cmd);
			}
		}
		if (mods.length === 0) {
			logger.info('No dependencies detected');
			return cb();
		}
		logger.info('Installing dependencies...');
		try {
			var npm = require("npm");
			npm.load({
				prefix : basedir,
				loglevel : 'warn'
			}, function(err) {
				if (err) {
					logger.error(err);
				}
				npm.commands.install(function(err) {
					logger.info('Dependencies installed.');
					cb(err);
				});
			});
		} catch (e) {
			logger.error(e);
		}
	} else {
		cb();
	}
}

function isOnline() {
	var online = false;
	var interfaces = require('os').networkInterfaces();
	for ( var name in interfaces) {
		var entries = interfaces[name];
		_.each(entries, function(e) {
			if (!e.internal) {
				online = true;
			}
		});
		if (online)
			break;
	}
	return online;
}

function ipaddress() {
	var ifaces = require('os').networkInterfaces();
	for ( var dev in ifaces) {
		var ipaddress;
		ifaces[dev].forEach(function(details) {
			if (details.family == 'IPv4' && dev.substring(0, 2) != 'lo') {
				ipaddress = details.address;
			}
		});
		if (ipaddress)
			return ipaddress;
	}
}

function isEmpty(val) {
	return (val === undefined || val == null || val.length <= 0) ? true : false;
}

function validateConfig(config) {
	if (config) {
		if (!config.name) {
			return 'name';
		}
		if (!config.version) {
			return 'version';
		}
		if (!config.main) {
			return 'main';
		}
		if (!config.logfile) {
			return 'logfile';
		}
	}
	return null;
}

function isPositiveInt(value) {
	var floatN = parseFloat(value);
	if ((floatN == parseInt(value)) && !isNaN(value)) {
		if (floatN > 0 && floatN < 999999999999) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function isWin() {
	return require('os').platform().indexOf('win') == 0;
}

exports.appversion = '0.1.0';
exports.framework_mvc = 'mvc';
exports.framework_none = 'none';
exports.isEmpty = isEmpty;
exports.ipaddress = ipaddress;
exports.getMacAddress = getMacAddress;
exports.die = die;
exports.stringifyJSON = stringifyJSON;
exports.readConfig = readConfig;
exports.getGlobalConfig = getGlobalConfig;
exports.getDefaultConfig = getDefaultConfig;
exports.saveGlobalConfig = saveGlobalConfig;
exports.isLoggedIn = isLoggedIn;
exports.isOnline = isOnline;
exports.trim = trim;
exports.lpad = lpad;
exports.rpad = rpad;
exports.exists = exists;
exports.installDepends = installDepends;
exports.generateTemplate = generateTemplate;
exports.generateTemplateDir = generateTemplateDir;
exports.serviceConfig = {};
exports.validateConfig = validateConfig;
exports.isPositiveInt = isPositiveInt;
exports.isWin = isWin;
exports.getProxy = getProxy;
exports.saveLastLogTime = saveLastLogTime;
exports.getLastLogTime = getLastLogTime;
