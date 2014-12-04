'use strict';

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
			all: [ 'test/packer/build', 'tmp' ]
		},

		titanium_run: {
			options: {
				success: '[TESTS ALL OK]',
				failure: '[TESTS WITH FAILURES]'
			},
			test: {
				files: {
					'tmp/test/Resources': [
						// Application sources
						'test/runtime/**/*.js',
						// Browserified files
						require.resolve('ti-mocha/ti-mocha'),
						require.resolve('should/should')
					]
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-titanium');

	grunt.registerTask('default', [ 'jshint', 'mochaTest' ]);

	grunt.registerTask('titanium', [ 'clean', 'titanium_run' ]);

	grunt.registerTask('test', [ 'mochaTest' ]);
};
