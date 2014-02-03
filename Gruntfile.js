'use strict';

module.exports = function (grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: true
			},
			"all": [ 'lib/**/*.js', 'test/**/*.js' ]
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint']);

};