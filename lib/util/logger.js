var colors = require('colors'), 
	fs = require('fs'), 
	path = require('path'), 
	u = require('./util.js'),
	util = require('util'),
	logFileStream, 
	useColors = true, 
	useDates = false;

exports.colors = function(b) {
	useColors = b;
};

exports.dates = function(b) {
	useDates = b;
};

exports.isColorEnabled = function() {
	return useColors;
};

exports.isDatesEnabled = function() {
	return useDates;
};

exports.setLogDir = function(dir, program_name) {
	if (!u.exists(dir)) {
		u.die("Log Directory (" + dir + ") doesn't exist");
	}
	useColors = false; // when logging to file, always turn off colors
	useDates = true; // when logging to file, always use dates
	var logfile = path.join(dir, program_name + '.log');
	logFileStream = fs.createWriteStream(logfile, {
		'flags' : 'a+',
		'encoding' : 'utf-8',
		'mode' : 0666
	});

	process.on('exit', function() {
		if (logFileStream) {
			logFileStream.end();
			logFileStream.destroy();
			logFileStream = null;
		}
	});
};

function formatLogMessage(label, msg) {
    var labelWidth = 7;
    if(label.length == 0) labelWidth = 0;
	var fmt;
	if (useDates) {
		var now = new Date;
		fmt = u.lpad(now.getMonth(), 2, '0') + '/'
		+ u.lpad(now.getDate(), 2, '0') + '/' + now.getFullYear() + ' '
		+ u.lpad(now.getHours(), 2, '0') + ':'
		+ u.lpad(now.getMinutes(), 2, '0') + ':'
		+ u.lpad(now.getSeconds(), 3, '0') + '.'
		+ u.lpad(now.getMilliseconds(), 3, '0');
	}
	var lbl = useColors ? label : colors.stripColors(label);
	var str = useColors ? String(msg) : colors.stripColors(msg);
	var f = fmt ? useColors ? fmt.grey : colors.stripColors(fmt) : null;
	var log = (useDates ? [ f, u.rpad(lbl, labelWidth), str ] : [ u.rpad(lbl, labelWidth), str ])
	.join(' ');
    while(log[0] == ' ')
        log = log.slice(1);
	return log;
}

function log(label, msg, error) {
	var log = formatLogMessage(label, msg);
	if (error) {
		(logFileStream || process.stderr).write(log + '\n', 'utf-8');
	} else {
		(logFileStream || process.stdout).write(log + '\n', 'utf-8');
	}
}

function output(msg, error) {
    if (error) {
        (logFileStream || process.stderr).write(msg, 'utf-8');
    } else {
        (logFileStream || process.stdout).write(msg, 'utf-8');
    }
}

exports.info = function(x, showLabel) {
    if(showLabel === false)
        log('', String(x).white);
    else
        log('[INFO]'.yellow, String(x).white);
};

exports.debug = function(x, showLabel) {
    if(showLabel === false)
        log('', String(x).grey);
    else
	    log('[DEBUG]'.grey, String(x).grey);
};

exports.error = function(x, showLabel) {
    if(showLabel === false)
        log('', String(x).red, true);
    else
	    log('[ERROR]'.yellow, String(x).red, true);
};

exports.warn = function(x, showLabel) {
    if(showLabel === false)
        log('', String(x).magenta);
    else
	    log('[WARN]'.yellow, String(x).magenta);
};

exports.log = function() {
	exports.info(util.format.apply(this, arguments));
};

exports.formatLogMessage = formatLogMessage;


exports.dir = function(obj) {
    var logs = '';
    // hook up standard output
    var unhook_stdout = hook_stream(process.stdout, function(string, encoding, fd) {
        logs = logs.concat(string);
    });
    console.dir(obj);
    unhook_stdout();
    output(logs, false);
}

exports.trace = function(label) {
    var logs = '';
    // hook up error output
    var unhook_stderr = hook_stream(process.stderr, function(string, encoding, fd) {
        logs = logs.concat(string);
    });
    console.trace(label);
    unhook_stderr();
    output(logs, true);
}

exports.assert = function(expression, message) {
    var logs = '';
    // hook up standard output
    var unhook_stdout = hook_stream(process.stderr, function(string, encoding, fd) {
        logs = logs.concat(string);
    });
    console.assert(expression, message);
    unhook_stdout();
    output(logs, true);
}

exports.time = function(label) {
    console.time(label);
}

exports.timeEnd = function(label) {
    var logs = '';
    // hook up standard output
    var unhook_stdout = hook_stream(process.stderr, function(string, encoding, fd) {
        logs = logs.concat(string);
    });
    console.timeEnd(label);
    unhook_stdout();
    output(logs, true);
}

var hook_stream = function(_stream, fn) {
    // Reference default write method
    var old_write = _stream.write;
    // _stream now write with our shiny function
    _stream.write = fn;

    return function() {
        // reset to the default write method
        _stream.write = old_write;
    };
};

