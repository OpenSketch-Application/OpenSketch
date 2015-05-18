module.exports = function(grunt) {
  grunt.initConfig({
    express: {
      dev: {
        options: {
          script: 'server.js',
          background: true,
          port: 8080
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      express: {
        files: ['./server.js', './routes/**', './socketHandlers/**'], //'server.js', '/routes/**', 'socketHandlers/**'
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      }
    }
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['express:dev', 'watch']);
};
