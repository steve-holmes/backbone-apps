module.exports = function (grunt) {
	grunt.initConfig({
		jst: {
			templates: {
				options: {
					templateSettings: {
						interpolate: /\{\{(.+?)\}\}/g
					},
					processName: function (filename) {
						return filename.split('/')[1].split('.')[0];
					}
				},
				files: {
					'public/templates.js': ['templates/*.html']
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jst');
	grunt.registerTask('default', ['jst']);
};