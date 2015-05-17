module.exports = function(grunt) {

  grunt.initConfig({
    copy: {
      build: {
        cwd: 'client/src',
        src: [ '**' ],
        dest: 'client/app',
        expand: true
      }
    },
    clean: {
      build: {
        src: ['client/app']
      }
    },
    browserify: {
      options: {
        debug: true
      },
      dev: {
        src: ['client/src/js/**/*.js'],
        dest: 'client/app/js/bundle.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['clean', 'copy', 'browserify']);
};
