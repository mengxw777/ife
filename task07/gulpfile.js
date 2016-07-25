var gulp = require('gulp'), //基础库
    sass = require('gulp-sass'), //sass
    uglify = require('gulp-uglify'), //js压缩
    cleanCSS = require('gulp-clean-css'), //css压缩
    imagemin = require('gulp-imagemin'), //图片压缩
    jshint = require('gulp-jshint'), //js语法检查
    concat = require('gulp-concat'), //合并文件
    rename = require('gulp-rename'), //重命名
    clean = require('gulp-clean'), //清空文件夹
    livereload = require('gulp-livereload'), // 页面刷新
    gulpif = require('gulp-if'),
    sprity = require('sprity'); //雪碧图

//复制html文件
gulp.task('html', function() {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(livereload())
})

//编译sass和压缩
gulp.task('css', function() {
    gulp.src('./src/sass/*.scss')
        .pipe(sass({
            outputStyle: 'compact'
        }))
        .pipe(gulp.dest('./src/css/'))
        .pipe(rename({
            suffix: '.min'
        }).on('error', sass.logError))
        .pipe(cleanCSS({
            compatibility: 'ie6'
        }))
        .pipe(gulp.dest('./dist/css/'))
        .pipe(livereload())
});

//雪碧图
gulp.task('sprites', function() {
    return sprity.src({
            src: './src/images/slice/*.{png,jpg}',
            out: './dist/images/',
            style: './_sprite.scss',
            processor: 'sass',
            name: 'icons',
            base64: true,
            margin: 10,
        })
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulpif('*.png', gulp.dest('./dist/images/'), gulp.dest('./src/sass/')))
});

//js检查和压缩
gulp.task('js', function() {
    return gulp.src('./src/js/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(livereload())
});

//压缩图片
gulp.task('images', function() {
    gulp.src('./src/images/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('./dist/images/'))
});

//复制字体文件
gulp.task('fonts', function() {
    gulp.src('./src/fonts/*')
        .pipe(gulp.dest('./dist/fonts/'))
})

// 清空dist文件夹
gulp.task('clean', function() {
    gulp.src(['./dist/css/', './dist/js/', './dist/images/', './dist/fonts/'], {
            read: false
        })
        .pipe(clean());
});

//  默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function() {
    gulp.start('html', 'css', 'js', 'fonts', 'sprites', 'images');
});

// 监听
gulp.task('watch', function() {
    livereload.listen();
    //监听html
    gulp.watch('./src/*.html', ['html']);
    //监听css
    gulp.watch('./src/sass/**/*.scss', ['css']);
    //监听js
    gulp.watch('./src/js/*.js', ['js']);
    //监听图片
    gulp.watch('./src/images/*.*', ['images']);
    //监听字体
    gulp.watch('./src/fonts/*', ['fonts']);
});
