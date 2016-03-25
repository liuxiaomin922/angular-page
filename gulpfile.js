//安装模块
//gulp gulp-jshint gulp-concat gulp-uglify browserify vinyl-source-stream vinyl-buffer gulp-minify-css gulp-sourcemaps gulp-rev-collector gulp-rev gulp-run-sequence gulp-run-sequence
//路径配置
var config = require('./config');
// 引入 gulp
var gulp = require('gulp');
// 引入组件
var jshint = require('gulp-jshint');//js检查错误
var concat = require('gulp-concat');//文件合并插件
var uglify = require('gulp-uglify');//js压缩
var browserify = require('browserify');//同步包依赖打包
var source = require('vinyl-source-stream');//流,和browserify同时使用
var buffer = require('vinyl-buffer');//将流转换成buffer格式
var minifycss = require('gulp-minify-css');//css压缩
var sourcemaps = require('gulp-sourcemaps');//生成map文件
var clean = require('gulp-clean');//文件清除
var replace=require('gulp-replace');//字符串替换
var htmlmin = require('gulp-htmlmin');//模板压缩
var rev = require('gulp-rev');//防缓存给静态资源生成随机字符串
var revCollection=require('gulp-rev-collector');//替换模板中的静态资源名字为生成的随机字符串的格式
var rename = require("gulp-rename");//改名
var runSequence = require('gulp-run-sequence');//按顺序执行任务插件
var imagemin = require('gulp-imagemin');//图片压缩
var pngcrush = require('imagemin-pngcrush')

var devUrl=config.devUrl;//本地开发路径
var buildUrl=config.devBuildUrl+config.staticUrl;//测试环境打包压缩的路径
var productUrl=config.productBuildUrl+config.staticUrl;//生产环境打包压缩的路径
var tplBuildUrl=config.staticUrl;//模板html资源引用的路径
var changed     = require('gulp-changed');

//任务说明
gulp.task('begin', function () {
    console.log("===================任务开始======================")
});
gulp.task('end', function () {
    console.log("===================所有任务完成===================")
    console.log("所有任务完成,最新代码生成在目录: < "+config.devBuildUrl+" > 下,输入 gulp watch 可以开启监听模式!")
});
// 检查脚本
gulp.task('lint', function() {
    return gulp.src(devUrl+'/js/module/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//清除旧版本
gulp.task('clean', function () {
    return gulp.src(config.devBuildUrl, {read: false})
        .pipe(clean());
});
gulp.task('cleanApp', function () {
    return gulp.src(buildUrl+"/js/app-**.js", {read: false})
        .pipe(clean());
});
gulp.task('cleanCss', function () {
    return gulp.src(buildUrl+"/css/main-**.css", {read: false})
        .pipe(clean());
});


//product生产环境
gulp.task('p-clean', function () {
    return gulp.src([config.productBuildUrl,!config.productBuildUrl+config.imgUrl+"/**"], {read: false})
        .pipe(clean());
});
gulp.task('p-cleanApp', function () {
    return gulp.src(productUrl+"/js/app-**.js", {read: false})
        .pipe(clean());
});
gulp.task('p-cleanCss', function () {
    return gulp.src(productUrl+"/css/main-**.css", {read: false})
        .pipe(clean());
});
//依次运行下列任务:
// 首先检查js 和清除旧版本然后执行下列6个任务并开始监视
// 1.压缩打包用户js---app
// 2.压缩打包用户css---css
// 3.按序压缩依赖库 lib---lib
// 4.压缩html模板,替换模板中路径变量----htmlmin
// 5.压缩图片---imagemin
// 6.给静态资源添加随机字符串防止缓存----preventCook

// 开始压缩只需要直接在项目目录下输入 gulp
gulp.task('d' ,function(cb) {
    runSequence( "lint","clean", ['app', 'css', 'lib', 'htmlmin','imagemin'], cb);
})
gulp.task('p' ,function(cb) {
    runSequence( "lint", "p-clean",'p-app', 'p-css', 'p-lib', 'p-htmlmin','p-imagemin',"p-preventCook", cb);
})
gulp.task('default',function(){
    runSequence("d","p");
});

gulp.task('watch', function(){
    console.log("=========可以监听js(不包括公共库lib),css,html,img的变化实时打包 ======")
    // 监听js变化打包最新
    gulp.watch('static/js/**', function(event){
        runSequence("cleanApp","app");
    });
    gulp.watch('static/view/**', function(event){
        runSequence("htmlmin");
    });
    gulp.watch('static/css/**', function(event){
        runSequence("cleanCss","css");
    });

    gulp.watch('static/js/**', function(event){
        runSequence("p-cleanApp","p-app","p-preventCook");
    });
    gulp.watch('static/view/**', function(event){
        runSequence("p-htmlmin","p-preventCook");
    });
    gulp.watch('static/css/**', function(event){
        runSequence("p-cleanCss","p-css","p-preventCook");
    });
    gulp.watch('static'+config.imgUrl+'/**', function(event){
        runSequence("imagemin","p-imagemin","p-preventCook");
    });
});

//============JS压缩添加同时添加随机戳防止缓存===========================

//打包app.js,执行任务,执行cleanAppJs=>b1=>b0=>b
gulp.task('app',function() {
    return browserify(devUrl+'/js/app.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest(buildUrl+'/js'))
});

gulp.task('p-app',function() {
    return browserify(devUrl+'/js/app.js')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        //.pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify({mangle: {toplevel: true}, output: {ascii_only: true}}))
        //.pipe(sourcemaps.write('/map'))
        .pipe(rev())
        .pipe(gulp.dest(productUrl+'/js'))
        .pipe(rev.manifest(
            {
                base: devUrl,
                merge: true // 合并现有的json
            }
        ))
        .pipe(gulp.dest(devUrl));
});
//============CSS压缩添加同时添加随机戳防止缓存===========================
gulp.task('css', function() {
    return gulp.src(devUrl+'/css/**')
        .pipe(concat('main.css'))
        .pipe(gulp.dest(buildUrl+'/css'))
});



gulp.task('p-css', function() {
    return gulp.src(devUrl+'/css/**')
        .pipe(concat('main.css'))
        .pipe(minifycss())
        .pipe(rev())
        .pipe(gulp.dest(productUrl+'/css'))
        .pipe(rev.manifest(
            {
                base: devUrl,
                merge: true // 合并现有的json
            }
        ))
        .pipe(gulp.dest(devUrl));
});
//===================将公共库压缩合并===================================
//清除生成的lib.min.js

gulp.task('lib', function() {
    return gulp.src([
        devUrl+'/js/lib/angular-1.4.8/angular.js',
        devUrl+'/js/lib/angular-route/angular-route.js',
        devUrl+'/js/lib/flexible-0.3.2/flexible.js',
        devUrl+'/js/lib/jquery-2.1.4/jquery.js',
        devUrl+'/js/lib/requirejs-2.1.11/requirejs.js',
        ])
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest(buildUrl+'/js'))
});

gulp.task('p-lib', function() {
    return gulp.src([
            devUrl+'/js/lib/angular-1.4.8/angular.js',
            devUrl+'/js/lib/angular-route/angular-route.js',
            devUrl+'/js/lib/flexible-0.3.2/flexible.js',
            devUrl+'/js/lib/jquery-2.1.4/jquery.js',
            devUrl+'/js/lib/requirejs-2.1.11/requirejs.js',
        ])
        .pipe(concat('lib.min.js'))
        .pipe(uglify({
            compress: {
                drop_console: true
            }
        }))
        .pipe(rev())
        .pipe(gulp.dest(productUrl+'/js'))
        .pipe(rev.manifest(
            {
                base: devUrl,
                merge: true // 合并现有的json
            }
        ))
        .pipe(gulp.dest(devUrl));
});
//===================模板压缩同时修静态资源路径===================================
// 模板文件替换地址路径,压缩html
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: false,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
        minifyJS: false,//压缩页面JS
        minifyCSS: false//压缩页面CSS
    };
    return gulp.src([devUrl+'/view/**'])
        .pipe(replace('{#buildUrl}', tplBuildUrl))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(config.devBuildUrl));
});


gulp.task('p-htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    return gulp.src([devUrl+'/view/**'])
        .pipe(replace('{#buildUrl}', tplBuildUrl))
        .pipe(htmlmin(options))
        .pipe(gulp.dest(config.productBuildUrl));
});
//==========================图片复制(图片暂未有压缩,因为那个压缩包感觉太垃圾,压了跟没压一样)======================
gulp.task('imagemin', function(){
    return gulp.src(devUrl+config.imgUrl+"/**")
        .pipe(changed(buildUrl+config.imgUrl))
        .pipe(gulp.dest(buildUrl+config.imgUrl))
})

gulp.task('p-imagemin', function(){
    return gulp.src(devUrl+config.imgUrl+"/**")
        .pipe(rev())
        .pipe(gulp.dest(productUrl+config.imgUrl))
        .pipe(rev.manifest(
            {
                base: devUrl,
                merge: true // 合并现有的json
            }
        ))
        .pipe(gulp.dest(devUrl));
})
//==========================防止缓存===================================

gulp.task("p-preventCook",function(){
    return gulp.src(['./rev-manifest.json',config.productBuildUrl+'/**','!'+config.productBuildUrl+config.staticUrl+"/img/**"])
        .pipe(revCollection())
        .pipe(gulp.dest(config.productBuildUrl))
});