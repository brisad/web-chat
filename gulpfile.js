"use strict";

var gulp = require('gulp');
var react = require('gulp-react');

gulp.task('default', function () {
  return gulp.src('./static/chat.jsx')
    .pipe(react())
    .pipe(gulp.dest('./static'));
});
