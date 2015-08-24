var gulp = require('gulp'),
    less = require('gulp-less'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps');
    babel = require('gulp-babel');
    concat = require('gulp-concat');
    uglify = require('gulp-uglify');
    watch = require('gulp-watch');

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('build-server-dev', function() {
    return gulp.src('server/src/**/*.js')
        .pipe(watch('server/src/**/*.js'))
        .pipe(babel())
        .pipe(gulp.dest('build/lib'));
});

gulp.task('build-server', function() {
    return gulp.src('server/src/**/*.js')
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest('build/lib'));
});

gulp.task('less-bootstrap', ['clean'], function() {
    var config = {
        src: './client/lib/bootstrap/less/bootstrap.less',
        dest: './client/lib/bootstrap/css/custom'
    };
    return gulp.src(config.src)
        //.pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest, {overwrite: true}));
});

gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['./client/lib/bootstrap/css/custom'], cb);
});
