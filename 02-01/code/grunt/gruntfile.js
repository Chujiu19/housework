const sass = require('node-sass');
const fs = require('fs')
const path = require('path');
module.exports = grunt => {
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    clean: ['temp', 'dist'],
    sass: {
      options: {
        implementation: sass
      },
      main: {
        files: [{
          expand: true,
          cwd: 'src/assets/styles',
          src: '*.scss',
          dest: 'temp/assets/styles',
          ext: '.css'
        }]
      }
    },
    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      main: {
        files: [{
          expand: true,
          cwd: 'temp/assets/styles',
          src: '*.css',
          dest: 'dist/assets/styles'
        }]
      }
    },
    babel: {
      options: {
        presets: ['@babel/preset-env']
      },
      main: {
        files: [{
          expand: true,
          cwd: 'src/assets/scripts',
          src: '*.js',
          dest: 'temp/assets/scripts'
        }]
      },
    },
    uglify: {
      main: {
        files: [{
          expand: true,
          cwd: 'temp/assets/scripts',
          src: '*.js',
          dest: 'dist/assets/scripts'
        }]
      }
    },
    swigtemplates: {
      options: {
        defaultContext: {},
        templatesDir: 'src'
      },
      main: {
        expend: true,
        dest: 'temp',
        src: 'src/**/*.html'
      }
    },
    copy: {
      main: {
        files: [
          { expand: true, src: ['public/**/*'], dest: 'dist/' },
        ],
      },
    },
    htmlmin: {
      main: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: 'temp',
          src: ['**/*.html', '*.html'],
          dest: 'dist'
        }]
      }
    }
    // imagemin: {
    //   main: {
    //     options: {
    //       optimizationLevel: 3,
    //       // use: [imagemin()]
    //     },
    //     files: [{
    //       expand: true,
    //       cwd: 'src/assets/',
    //       src: ['**/*.{png,jpg,gif}'],
    //       dest: 'dist/assets/'
    //     }]
    //   }
    // }
  });
  grunt.registerTask('compile', ['sass', 'babel', 'swigtemplates']);
  grunt.registerTask('build', ['clean', 'compile', 'uglify', 'cssmin', 'htmlmin', 'copy'])
  grunt.registerTask('cleanAll', ['clean']);
}
