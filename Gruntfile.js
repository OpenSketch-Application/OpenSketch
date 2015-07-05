module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      paths: ['src/less/**/*.less'],
      dev: {
        files: {
          'app/css/main.css': 'src/less/main.less'
        }
      }
    },
    browserify: {
      options: {
        debug: true,
        watch: true
      },
      dev: {
        src: ['src/*.js'],
        dest: 'app/js/bundle.js',
        'options': {
                    'debug': true,
                    'watch': true,
                    'verbose': true,
                    'open': true,
                    'browserifyOptions' : {'debug': true}
                }
      },
      test: {
        src: ['./src/tests/whiteboard-tests/Toolbar/**/*.js', ],
        dest: './src/tests/whiteboard-tests/Toolbar/tests/bundle.js'
      }
    },
    watch: {
      options: {
        livereload: true
      },
      less: {
        files: ['src/less/**/*.less'],
        tasks: ['less:dev'],
        options: {
          spawn: false
        }
      },
      browserify: {
        files: ['src/**/*.js'],
        tasks: ['browserify:dev']
      }
    }
  });

  // load the tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', [
    'less:dev',
    'browserify:dev',
    'watch'
  ]);

  grunt.registerTask('testTool', ['browserify:test']);
};
