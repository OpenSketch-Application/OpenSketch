module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      dev: {
        options: {
          script: 'server.js',
          background: true,
          port: 3000
        }
      }
    },
    less: {
      paths: ['../src/less/**/*.less'],
      dev: {
        files: {
          '../app/css/main.css': '../src/less/main.less'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      express: {
        files: ['./server.js', './routes/**', './socketHandlers/**', './db/**/.js', './config/**/*.js'], //'server.js', '/routes/**', 'socketHandlers/**'
        tasks: ['express:dev'],
        options: {
          spawn: false
        }
      },
      less: {
        files: ['../src/less/**/*.less'],
        tasks: ['less:dev'],
        options: {
          spawn: false
        }
      },
      browserify: {
          files: ['../src/**/*.js', '!../src/tests/**/*.js'],
          tasks: ['browserify:dev']
      }
    },
    less: {
      paths: ['../src/less/**/*.less'],
      dev: {
        files: {
          '../app/css/main.css': '../src/less/main.less'
        }
      }
    },
    browserify: {
      options: {
        debug: true,
        watch: true,
        exclude: ['../src/tests']
      },
      dev: {
        src: ['../src/**/*.js', '!../src/tests/**/*.js'],
        dest: '../app/js/bundle.js'
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
