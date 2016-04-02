/**
 * @fileoverview This is the file that determines the behavior of the Gulp task
 *   runner.
 * @author alvin.lin.dev@gmail.com (Alvin Lin)
 */

var gulp = require('gulp');

var compilerPackage = require('google-closure-compiler');
var gjslint = require('gulp-gjslint');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var lessAutoprefix = require('less-plugin-autoprefix');
var lessCleancss = require('less-plugin-clean-css');
var merge = require('merge-stream');
var path = require('path');

var getClosureCompilerConfiguration = function(outputFile) {
  var basePath = path.dirname(__filename);
  var closureCompiler = compilerPackage.gulp();

  return closureCompiler({
    externs: [
      compilerPackage.compiler.CONTRIB_PATH + '/externs/jquery-1.9.js',
      basePath + '/extern/extern.js'
    ],
    warning_level: 'VERBOSE',
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    js_output_file: outputFile
  });
};

var getLessConfiguration = function() {
  var autoprefix = new lessAutoprefix({
    browsers: ["last 2 versions"]
  });
  var cleancss = new lessCleancss({
    advanced: true
  });
  return less({
    plugins: [autoprefix, cleancss]
  });
};

gulp.task('default', ['js-lint', 'js-compile', 'less']);

gulp.task('js', ['js-lint', 'js-compile']);

gulp.task('lint', ['js-lint']);

gulp.task('js-lint', function() {
  return gulp.src(['./extern/*.js',
                   './lib/**/*.js',
                   './public/js/**/*.js',
                   './shared/*.js' ])
    .pipe(gjslint({
      flags: ['--jslint_error indentation',
              '--jslint_error well_formed_author',
              '--jslint_error braces_around_type',
              '--jslint_error unused_private_members',
              '--jsdoc',
              '--max_line_length 80',
              '--error_trace'
             ]
    }))
    .pipe(gjslint.reporter('console'));
});

gulp.task('js-compile', function() {

  var indexJs = gulp.src(['./public/js/index.js'])
    .pipe(plumber())
    .pipe(getClosureCompilerConfiguration('index.min.js'))
    .pipe(gulp.dest('./public/dist'));

  var gameJs = gulp.src(['./shared/*.js',
                         './public/js/game/game.js',
                         './public/js/game/*.js' ])
    .pipe(plumber())
    .pipe(getClosureCompilerConfiguration('game.min.js'))
    .pipe(gulp.dest('./public/dist'));

  return merge(indexJs, gameJs);
});

gulp.task('less', function() {
  var indexCss = gulp.src('./public/less/index.less')
    .pipe(plumber())
    .pipe(getLessConfiguration())
    .pipe(rename('index.min.css'))
    .pipe(gulp.dest('./public/dist'));

  var gameCss = gulp.src('./public/less/game.less')
    .pipe(plumber())
    .pipe(getLessConfiguration())
    .pipe(rename('game.min.css'))
    .pipe(gulp.dest('./public/dist'));

  return merge(indexCss, gameCss);
});

gulp.task('watch-js', function() {
  gulp.watch(['./extern/*.js',
              './lib/**/*.js',
              './public/js/**/*.js',
              './shared/*.js' ], ['js-compile']);
});

gulp.task('watch-less', function() {
  gulp.watch('./public/less/*.less', ['less']);
});

gulp.task('watch', function() {
  gulp.watch(['./extern/*.js',
              './lib/**/*.js',
              './public/js/**/*.js',
              './shared/*.js' ], ['js-compile']);
  gulp.watch('./public/less/*.less', ['less']);
});
