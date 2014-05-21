module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
      index: '.'
    },
    browserify: {
      dev: {
        files: {
          '<%= paths.index %>/js/bundle.js': ['<%= paths.index %>/js/app.js'],
        },
        options: {
          transform: ['reactify']
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 3000,
          base: '<%= paths.index %>'
        }
      }
    },
    watch: {
      options: {
        spawn: false
      },
      dev: {
        files: [
          '<%= paths.index %>/js/**/*.js',
          '<%= paths.index %>/scripts/**/*.jsx'
        ],
        tasks: ['browserify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify', 'connect', 'watch']);
};
