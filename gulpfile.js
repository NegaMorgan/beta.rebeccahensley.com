'use strict';

var gulp = require('gulp'),
  wiredep = require('wiredep').stream,
  bs = require('browser-sync').create(),
  reload = bs.reload,
  lazypipe = require('lazypipe'),
  gp = require('gulp-load-plugins')({
    rename: {
      'gulp-image-resize': 'resize',
      'gulp-minify-html': 'minifyhtml'
    }
  });

var Paths = {
  HERE                 : './',
  DIST                 : 'dist',
  JS_SOURCES           : 'src/js/*.js',
  JS_DIST              : 'dist/js',
  LESS_TOOLKIT_SOURCES : 'src/less/toolkit*',
  LESS                 : 'src/less/*',
  CSS                  : 'dist/assets/css',
  BG_SOURCES           : 'src/assets/img/backgrounds/*',
  IMG_SOURCES          : 'src/assets/img/**/*',
  IMG_DIST             : 'dist/assets/img',
  FONT_SOURCES         : 'src/assets/fonts/*',
  FONT_DIST            : 'dist/assets/fonts',
  HTML_SOURCES         : 'src/*.html'
}

// lint js with jshint, combine all files into one,
// write a minified and unminified version of file
gulp.task('javascript', function(){
  return gulp.src(Paths.JS_SOURCES)
    .pipe(gp.jshint())
    .pipe(gp.jshint.reporter('default'))
    .pipe(gp.concat('toolkit.js'))
    .pipe(gulp.dest(Paths.JS_DIST))
    .pipe(gp.rename({ suffix: '.min' }))
    .pipe(gp.uglify())
    .pipe(gulp.dest(Paths.JS_DIST));
});

// css preprocessing
gulp.task('less', function () {
  return gulp.src(Paths.LESS_TOOLKIT_SOURCES)
    .pipe(gp.less())
    .pipe(gp.autoprefixer())
    .pipe(gulp.dest(Paths.CSS))
})

gulp.task('less-min', ['less', 'css'], function () {
  return gulp.src(Paths.LESS_TOOLKIT_SOURCES)
    .pipe(gp.sourcemaps.init())
    .pipe(gp.less())
    .pipe(gp.autoprefixer())
    .pipe(gp.csso())
    .pipe(gp.rename({ suffix: '.min' }))
    .pipe(gp.sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.CSS))
})

// for non-less style sources
gulp.task('css', function () {
  return gulp.src('src/assets/css/*')
    .pipe(gp.sourcemaps.init())
    .pipe(gulp.dest(Paths.CSS))
    .pipe(gp.csso())
    .pipe(gp.rename({ suffix: '.min' }))
    .pipe(gp.sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.CSS))
})

// image minification for below tasks
var optimizeHeavy = lazypipe()
    .pipe(gp.imagemin, {
      optimizationLevel: 5, 
      progressive: true, 
      interlaced: true 
    })

// generate large bg images in various sizes
// 2x = 2560px, 1x = 1280px, default is 768px, set below
gulp.task('backgrounds-2x', function() {
  return gulp.src(Paths.BG_SOURCES)
    .pipe(gp.rename({ suffix: '-2x' }))
    .pipe(optimizeHeavy())
    .pipe(gulp.dest(Paths.IMG_DIST));
});

gulp.task('backgrounds-1x', function() {
  return gulp.src(Paths.BG_SOURCES)
    .pipe(gp.rename({ suffix: '-1x' }))
    .pipe(gp.resize({ 
      width : 1280,
      upscale : false,
      imageMagick: true
    }))
    .pipe(optimizeHeavy())
    .pipe(gulp.dest(Paths.IMG_DIST));
});

gulp.task('backgrounds', ['backgrounds-2x', 'backgrounds-1x'], function() {
  return gulp.src(Paths.BG_SOURCES)
    .pipe(gp.resize({ 
      width : 768,
      upscale : false,
      imageMagick: true
    }))
    .pipe(gp.imagemin({
      optimizationLevel: 1, 
      progressive: true, 
      interlaced: true 
    }))
    .pipe(gulp.dest(Paths.IMG_DIST));
});

// process everything in /assets/img except /backgrounds
gulp.task('images', ['backgrounds'], function() {
  return gulp.src([Paths.IMG_SOURCES, '!src/assets/img/backgrounds{,/**}'])
    .pipe(optimizeHeavy())
    .pipe(gulp.dest(Paths.IMG_DIST));
});

// copy over html files, use bower to include libraries
gulp.task('html', function(){
  return gulp.src(Paths.HTML_SOURCES)
    .pipe(gp.minifyhtml({
      comments: true,
      spare: true
    }))
    .pipe(wiredep({
      cwd: './dist',
      ignorePath: '../dist'
    }))
    .pipe(gulp.dest(Paths.DIST));
});

// copy over fonts
gulp.task('fonts', function(){
  return gulp.src(Paths.FONT_SOURCES)
    .pipe(gulp.dest(Paths.FONT_DIST));
});

// clean out dist, in case sources have been removed
gulp.task('clean', require('del').bind(null, ['dist/assets', Paths.JS_DIST]));

gulp.task('watch', function(){
  gulp.watch(Paths.JS_SOURCES, ['javascript', reload]);
  gulp.watch(Paths.LESS, ['less-min', reload]);
  gulp.watch(Paths.FONT_SOURCES, ['fonts', reload]);
  gulp.watch(Paths.IMG_SOURCES, ['images', reload]);
  gulp.watch(Paths.HTML_SOURCES, ['html', reload]);
});

// executing tasks from the dependency array is preferred
gulp.task('build', ['javascript', 'less-min', 'images', 'fonts', 'html'], function(){
  return gulp.src('dist/**/*')
  .pipe(gp.size({ title: 'build', gzip: true }));
});

// start browsersync, start watch task to watch for changes
gulp.task('serve', ['build'], function(){
  bs.init({ server: './dist/' });
  gulp.start('watch');
});

// clean task should be synchronous
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});