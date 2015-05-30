module.exports = function(grunt) {
  grunt.initConfig({
    less: {
      paths: ['src/less/**/*.less'],
      dev: {
        files: {
          'app/css/main.css': 'src/less/main.less'
        }
      }
    },
    browserify: {
      dev: {
        src: ['src/*.js'],
        dest: 'app/js/bundle.js'
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
        files: ['src/*.js'],
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
};
