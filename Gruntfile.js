var spawn = require('child_process').spawn,
	BIN = './node_modules/.bin/';

module.exports = function(grunt) {
	// Configure Grunt
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: true
			},
			src: ['*.js', 'lib/**/*.js', 'test/**/*.js']
		},
		clean: {
			pre: ['*.log'],
			post: ['tmp']
		}
	});

	// Register task of mocha test
	grunt.registerTask('mocha', 'mocha test', function() {
		var done = this.async();
		// var proc = spawn(BIN + 'mocha', ['--bail']);
		var proc = spawn(BIN + 'mocha', null, {
			env: process.env
		});
		proc.stdout.on('data', function(data) {
			process.stdout.write(data);
		});
		proc.stderr.on('data', function(data) {
			process.stderr.write(data);
		});
		proc.on('close', function(code) {
			if (code !== 0) {
				grunt.fail.fatal('fail');
			} else {
				grunt.log.ok('done');
			}
			done();
		});
	});

	// Register task of test coverage
	grunt.registerTask('coverage_istanbul', 'generate test coverage report', function() {
		var done = this.async();
		var proc = spawn(BIN + 'istanbul', ['cover', '--root', 'lib', '_mocha', '--', '-R', 'spec'], {
			env: process.env
		});
		proc.stdout.on('data', function(data) {
			process.stdout.write(data);
		});
		proc.stderr.on('data', function(data) {
			process.stderr.write(data);
		});
		proc.on('close', function(code) {
			if (code !== 0) {
				grunt.fail.fatal('fail');
			} else {
				grunt.log.ok('done');
			}
			done();
		});
	});

	// Load grunt plugins
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// Register tasks
	grunt.registerTask('default', ['clean:pre', 'jshint', 'mocha', 'clean:post']);
	grunt.registerTask('coverage', ['clean:pre', 'coverage_istanbul', 'clean:post']);
};
