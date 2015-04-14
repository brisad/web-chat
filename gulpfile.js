"use strict";

var gulp = require('gulp');
var react = require('gulp-react');
var size = require('gulp-size');

gulp.task('default', function () {
  return gulp.src('./static/chat.jsx')
    .pipe(react())
    .pipe(size())
    .pipe(gulp.dest('./static'))
});
