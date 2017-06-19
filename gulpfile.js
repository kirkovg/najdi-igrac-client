
var gulp = require('gulp');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');
var rev = require('gulp-rev-append');
var eslint = require('gulp-eslint');
var connect = require('gulp-connect');
var fs = require("fs");

var JS_APP = [
  'app/app.js',
  'app/home-page/home-page.state.js',
  'app/home-page/home-page.remote.factory.js',
  'app/home-page/home-page.controller.js',
  'app/user-profile/user-profile.controller.js',
  'app/user-profile/user-profile.state.js',
  'app/user-profile/user-profile.remote.factory.js',
  'app/login/login.controller.js',
  'app/login/login.remote.factory.js',
  'app/login/login.state.js',
  'app/register/register.controller.js',
  'app/register/register.state.js',
  'app/register/register.remote.factory.js',
  'app/edit-profile/edit-profile.controller.js',
  'app/edit-profile/edit-profile.state.js',
  'app/edit-profile/edit-profile.remote.factory.js',
  'app/event/event.controller.js',
  'app/event/event.remote.factory.js',
  'app/event/event.state.js',
  'app/directives/filemodel.js',
  'app/notifications/notifications.controller.js',
  'app/notifications/notifications.state.js',
  'app/notifications/notifications.remote.factory.js'
];

var TEMPLATES_SRC = [
  'app/login/login.view.html',
  'app/home-page/default-page.view.html',
  'app/user-profile/user-profile.view.html',
  'app/register/register/register.view.html',
  'app/edit-profile/edit-profile.view.html',
  'app/event/event.view.html',
  'app/notifications/notifications.view.html'
];

var CSS_APP = [
  'css/main.css',
  'css/event.css',
  'css/home-page.css'
];

var FONTS_LIB = [
  'bower_components/components-font-awesome/fonts/fontawesome-webfont.woff2',
  'bower_components/components-font-awesome/fonts/fontawesome-webfont.woff',
  'bower_components/components-font-awesome/fonts/fontawesome-webfont.ttf',
  'bower_components/bootstrap/fonts/*'
];

var CSS_LIB = [
  'bower_components/bootstrap/dist/css/bootstrap.css',
  'bower_components/components-font-awesome/css/font-awesome.min.css',
  'bower_components/angular-ui-select/dist/select.css',
  'bower_components/animate.css',
  'bower_components/jquery-ui.theme.min.css',
  'bower_components/stylecheck.css',
  'bower_components/jquery-ui/**.css'
];


var JS_LIB = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/bootstrap/dist/js/bootstrap.min.js',
  'bower_components/angular/angular.js',
  'bower_components/momentjs/moment.js',
  'bower_components/angular-ui-router/release/angular-ui-router.js',
  'bower_components/angular-ui-select/dist/select.js',
  'bower_components/angular-resource/angular-resource.js',
  'bower_components/angular-cookies/angular-cookies.js',
  'bower_components/d3/d3.js',
  'bower_components/c3/c3.js',
  'bower_components/ng-file-upload/ng-file-upload.js'
];


/**
 *   The location of the resources for deploy
 */
var DESTINATION = 'dest/';

var FONTS_DESTINATION = 'fonts/';
/**
 * The single page initial html file. It will be altered
 * by this script.
 */
var INDEX_FILE = 'index.html';
/**
 * The name of the angular module
 */
var MODULE_NAME = 'najdi-igrac-client';
/**
 * The URL of the back-end API
 */
var API_URL = 'http://localhost:8080/api';
/**
 * Route to which the API calls will be mapped
 */
var API_ROUTE = '/api';

/**
 * Task for concatenation of the js libraries used
 * in this project
 */
gulp.task('concat_js_lib', function () {
  return gulp.src(JS_LIB) // which js files
    .pipe(concat('lib.js')) // concatenate them in lib.js
    .pipe(gulp.dest(DESTINATION)); // save lib.js in the DESTINATION folder
});

/**
 * Task for concatenation of the css libraries used
 * in this project
 */
gulp.task('concat_css_lib', function () {
  return gulp.src(CSS_LIB) // which css files
    .pipe(concat('lib.css')) // concat them in lib.css
    .pipe(gulp.dest(DESTINATION)); // save lib.css in the DESTINATION folder
});

/**
 * Task for concatenation of the js code defined
 * in this project
 */
gulp.task('concat_js_app', function () {
  return gulp.src(JS_APP)
    .pipe(concat('src.js'))
    .pipe(gulp.dest(DESTINATION))
});

/**
 * Task for concatenation of the css code defined
 * in this project
 */
gulp.task('concat_css_app', function () {
  return gulp.src(CSS_APP)
    .pipe(concat('app.css'))
    .pipe(gulp.dest(DESTINATION))
});

/**
 * Task for concatenation of the html templates defined
 * in this project
 */
gulp.task('templates', function () {
  return gulp.src(TEMPLATES_SRC) // which html files
    .pipe(
      templateCache('templates.js', { // compile them as angular templates
        module: MODULE_NAME,        // from module MODULE_NAME
        root: 'app'                 // of the app
      }))
    .pipe(gulp.dest(DESTINATION));
});

/**
 * Task for adding the revision as parameter
 * for cache braking
 */
gulp.task('cache-break', function () {
  return gulp.src(INDEX_FILE) // use the INDEX_FILE as source
    .pipe(rev())            // append the revision to all resources
    .pipe(gulp.dest('.'));  // save the modified file at the same destination
});

gulp.task('fonts', function () {
  return gulp.src(FONTS_LIB)
    .pipe(gulp.dest(FONTS_DESTINATION))
});

var tasks = [
  'concat_js_lib',
  'concat_css_lib',
  'concat_js_app',
  'concat_css_app',
  'fonts',
  'templates'
];

gulp.task('build', tasks, function () {
  gulp.start('cache-break');
});

gulp.task('watch', function () {
  gulp.watch('app/**/**.js', ['concat_js_app', 'cache-break']);
  gulp.watch('app/**/**.html', ['templates', 'cache-break']);
  gulp.watch('css/**/**.css', ['concat_css_app', 'cache-break']);
});

gulp.task('serve', function () {
  connect.server({
    port: 8000,
    livereload: true,
    middleware: function (connect, opt) {
      return [
        (function () {
          var url = require('url');
          var proxy = require('proxy-middleware');
          var options = url.parse(API_URL);
          options.route = API_ROUTE;
          return proxy(options);
        })()
      ];
    }
  });
});

gulp.task('default', ['serve', 'watch']);
