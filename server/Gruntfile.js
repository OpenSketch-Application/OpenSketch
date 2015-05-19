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
      },
      less: {
        files: ['../client/src/less/*.less'],
        tasks: ['less:dev'],
        options: {
          spawn: false
        }
      }
    },
    less: {
      paths: ['../client/src/less/**/*.less'],
      dev: {
        files: {
          '../client/app/css/main.css': '../client/src/less/main.less'
        }
      }
    },
    browserify: {
      options: {
        debug: true
      },
      dev: {
        src: ['../client/src/js/**/*.js'],
        dest: '../client/app/js/bundle.js'
      }
    }
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', [
    'less:dev',
    'browserify:dev',
    'express:dev',
    'watch'
  ]);
};
