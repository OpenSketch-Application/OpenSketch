module.exports = function(grunt) {
  grunt.initConfig({
    express: {
      dev: {
        options: {
          script: 'server.js',
          background: false
        }
      }
    }
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['express:dev']);
};
