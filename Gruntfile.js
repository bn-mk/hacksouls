'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		watch: {
			typescript:{
				files: 'ts/*.ts',
				tasks: ['typescript']
			}
		},
		typescript: {
			base: {
				src: ['ts/*.ts'],
				dest: 'js/game.js',
				options: {
					module: 'none',
					target: 'es5'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-typescript');

	grunt.registerTask('default', ["typescript","watch:typescript"]);

};
