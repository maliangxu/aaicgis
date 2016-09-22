var gulp = require("gulp");
var webpack = require("webpack");
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var connect = require('gulp-connect');
var webpackConfig = require('./webpack.config.js');
var livereload = require('gulp-livereload');
// var WebpackDevServer = require('webpack-dev-server');
// var md5 = require('gulp-md5-plus');
//var modRewrite = require('connect-modrewrite');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');


/*gulp.task('minify', function (){
     return gulp.src('asset/src/*.js')
        .pipe(concat('ecnulib.js'))
        .pipe(gulp.dest('asset/dist'))
        .pipe(uglify())
        .pipe(rename('ecnulib.min.js'))
        .pipe(gulp.dest('asset/dist'));
});*/

gulp.task('minify', function (){
     return gulp.src('asset/source/bundle.js')
        .pipe(uglify())
        .pipe(rename('bundle.min.js'))
        .pipe(gulp.dest('asset/dist'));
});

// process.env.NODE_ENV  product or dev
// 打包之前清除文件里的旧文件
/*gulp.task('clean', function() {
    return gulp.src('', {
        read: false
    })
    .pipe(clean());
});*/

// 语法检查
gulp.task('jshint', function () {
    return gulp.src('source/shaldapsys/sub_page/nysjcj/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', function() {
    return gulp.src('shaldapsys/sub_page/nysjcj/js/bundle.js', {
        read: false
    })
    .pipe(clean());
});


//执行webpack
gulp.task('webpack', function() {
    webpack(webpackConfig, function(err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", 'webpack is  OK!');
        //gulp.start(['addmd5']);   //开发环境不加MD5，因为watch 监控，MD5实时打包就出错误！
    })
});

//启动服务器
gulp.task("connect", function() {
    connect.server({
        port: 800,
        livereload: true
    });
});

//监控文件
/*gulp.task("watch", function() {
	livereload.listen();
    gulp.watch('assets/js/*.js', ['webpack']).on('change', livereload.changed);
});*/

gulp.task("watch", function() {
    livereload.listen();
    gulp.watch('source/shaldapsys/sub_page/nysjcj/js/*.js', ['webpack'])/*.on('change', livereload.changed)*/;
});


gulp.task('default', ['clean', 'webpack'], function() {
    gulp.start(['watch']);
});






