module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      options: {
        debug: true,
        watch: true
      },
      test: {
        src: ['./whiteboard-tests/Textbox/*.js'], //'./whiteboard-tests/Toolbar/**/*.js'
        dest: './tests/bundle.js',
        'options': {
          'debug': true,
          'watch': true,
          'verbose': true,
          'open': true,
          'browserifyOptions' : {'debug': true}
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      browserify: {
        files: ['./whiteboard-tests/Textbox/**/*.js'], //'./whiteboard-tests/Toolbar/**/*.js'
        tasks: ['browserify:test']
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('removeFiles', function() {
    console.log('removing files');
    grunt.file.delete('./tests/bundle.js');
  })

  grunt.registerTask('default', [
    'removeFiles',
    'browserify:test',
    'watch'
  ]);
}
