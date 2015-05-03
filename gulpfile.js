"use strict";

var gulp = require('gulp');
var react = require('gulp-react');
var size = require('gulp-size');
var del = require('del');

gulp.task('clean', function () {
  del(['static/chat.js'])
});

gulp.task('transform', ['clean'], function () {
  return gulp.src('./static/chat.jsx')
    .pipe(react())
    .pipe(size())
    .pipe(gulp.dest('./static'))
});

gulp.task('default', ['transform'], function () {
  gulp.watch('./static/chat.jsx', ['transform']);
});

gulp.task('production', ['transform']);
