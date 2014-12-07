'use strict';

var when = require('when');
var path = require('path');
var packer = require('./packer');

module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: true
			},
			all: [ 'lib/**/*.js', 'test/**/*.js' ]
		},

		mochaTest: {
			packer: {
				src: [ 'test/packer' ]
			},
			manifest: {
				src: [ 'test/manifest' ]
			}
		},

		clean: {
			all: [ 'test/*/build', 'tmp' ]
		},

		unzip: {
			'module-a': {
				src: 'test/runtime/build/module-a-commonjs-1.2.3.zip',
				dest: 'test/runtime/build'
			},
			'module-c': {
				src: 'test/runtime/build/module-c-commonjs-1.2.3.zip',
				dest: 'test/runtime/build'
			}
		},

		titanium_run: {
			options: {
				success: '[TESTS ALL OK]',
				failure: '[TESTS WITH FAILURES]'
			},
			test: {
				files: {
					'tmp/test': [
						// We need to define modules
						'test/runtime/tiapp.xml'
					],
					'tmp/test/Resources': [
						// Application sources
						'test/runtime/app/*.js',
						// Browserified files
						require.resolve('ti-mocha/ti-mocha'),
						require.resolve('should/should')
					],
					'tmp/test/modules': [
						'test/runtime/build/modules/*'
					]
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-titanium');
	grunt.loadNpmTasks('grunt-zip');

	grunt.registerTask('build-runtime-modules', 'Build the zip to be used in runtime tests', function () {
		var done = this.async();

		grunt.file.mkdir('test/runtime/build');

		when.all([
			packer.build({
				entry: path.resolve(__dirname, 'test/runtime/module-a')
			}),
			packer.build({
				entry: path.resolve(__dirname, 'test/runtime/module-c')
			})
		])
		.spread(function (zipA, zipB) {
			return when.all([
				zipA.writeModule(path.resolve(__dirname, 'test/runtime/build')),
				zipB.writeModule(path.resolve(__dirname, 'test/runtime/build'))
			]);
		})
		.done(function () {
			grunt.log.ok('Runtime module built');
			done(true);
		}, function (err) {
			throw err;
		});
	});

	grunt.registerTask('default', [ 'jshint', 'mochaTest' ]);

	grunt.registerTask('titanium', [
		'clean', 'build-runtime-modules', 'unzip', 'titanium_run'
	]);

	grunt.registerTask('test', [ 'mochaTest' ]);
};
