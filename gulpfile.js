var gulp = require('gulp'),
    less = require('gulp-less'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('less-bootstrap', ['clean'], function() {
    var config = {
        src: './client/lib/bootstrap/less/bootstrap.less',
        dest: './client/lib/bootstrap/css/custom'
    };
    return gulp.src(config.src)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({cascade: false, browsers: ['last 2 versions']}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest, {overwrite: true}));
});

gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['./client/lib/bootstrap/css/custommain.css'], cb);
});
