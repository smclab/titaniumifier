'use strict';

module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: true
			},
			"all": [ 'lib/**/*.js', 'test/**/*.js' ]
		},

		mochaTest: {
			packer: {
				src: [ 'test/packer' ]
			},
			manifest: {
				src: [ 'test/manifest' ]
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.registerTask('default', ['jshint', 'mochaTest']);

	grunt.registerTask('test', ['mochaTest']);
};
