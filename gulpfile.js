/*
* 这是Gulp的入口文件--就是主体功能的包
* */

//引入基本插件
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
/*var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCss = require('gulp-clean-css');
var less = require('gulp-less');
var htmlmin = require('gulp-htmlmin');
var livereload = require('gulp-livereload');
var connect = require('gulp-connect'); //实时刷新（构建微型服务器）
var open = require('gulp-open');*/
//注册基本任务---完成js文件的合并压缩
gulp.task('minifyjs',function () {
    return gulp.src('./src/js/*.js') //读取要操作的js文件
        .pipe($.concat('build.js')) //合并生成合并文件build.js
        .pipe(gulp.dest('./dist/js')) //将合并文件输出到目标目录
        .pipe($.uglify())     //js文件的压缩
        .pipe($.rename({suffix : '.min'})) //压缩后的js文件重命名
        .pipe(gulp.dest('./dist/js'))   //将压缩的js文件生成到目标目录
        /*.pipe(livereload())   */      //实时更新的标志(半自动)
        .pipe($.connect.reload())   //实时更新的标志（全自动）
});

//注册基本任务---完成less文件转换为css文件
gulp.task('less',function () {
    return gulp.src('./src/less/*.less')
        .pipe($.less())
        .pipe(gulp.dest('./src/css'))
        // .pipe(livereload())
        .pipe($.connect.reload())   //实时更新的标志（全自动）
});

//注册基本任务----完成css文件的合并压缩（这是在less文件转换完之后执行该任务）
gulp.task('css',function () {
    return gulp.src('./src/css/*.css')
        .pipe($.concat('result.css'))
        .pipe($.cleanCss())
        .pipe($.rename({suffix : '.min'}))
        .pipe(gulp.dest('./dist/css'))
        // .pipe(livereload())
        .pipe($.connect.reload())   //实时更新的标志（全自动）
});

//注册基本任务---html的压缩（html是没有合并操作的）
gulp.task('html',function () {
    return gulp.src('./index.html')
        .pipe($.htmlmin({collapseWhitespace : true}))
        .pipe(gulp.dest('./dist'))
        // .pipe(livereload())
        .pipe($.connect.reload())   //实时更新的标志（全自动）
});


//默认任务--其中gulp.series表示按照顺序执行，gulp.parallel表示并行执行。有一点注意的是：gulp4.0版本以上，gulp的API 中参数只能设置为两个，不在和gulp3.0版本一样
// gulp.task('default',gulp.parallel('minifyjs','css','html'));
gulp.task('default',gulp.parallel('minifyjs','css','html'));
/*
//注册基本任务--半自动更新（就是一旦哪个文件更新，一保存文件其他文件（如压缩文件）不要在运行就会自动保存，但是网页还是要自己手动刷新才能 展现更改后的效果）
gulp.task('server',gulp.series('default',function () {
    //开启监听（每个基本任务后面加一个更新的标志）
    livereload.listen();
    //要监听的任务(任务涉及的路径)以及监听的任务的绑定事件（一旦绑定事件触发，那么意味着这个任务在更新）
    gulp.watch(['./src/js/!*.js','./src/css/!*.js','./index.html'],gulp.parallel('minifyjs','css','html'));
}));*/


//注册基本任务---全自动更新（就是要操作的文件一旦有变化，操作后的文件会直接对应变化）
gulp.task('server',gulp.series('default',function () {
    //配置微型服务器，将本文档所有要操作的文件全部放到这个服务器中，一旦哪个文件有变化会自动更新
    $.connect.server({
        root : 'dist',
        port : 3000,
        livereload : true
    });

    //确认监视的目标（所在的位置）及其目标绑定的任务（一旦该目标的回调函数触发，表示就要更新）
    gulp.watch('./src/js/*.js',gulp.series('minifyjs'));
    gulp.watch('./src/css/*.css',gulp.series('css'));
}));