/**
 * PACalendar Web Scraper - skimming 25Live's static HTML files to build a database
 * Copyright (C) 2019 Vincent Vella
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const gulp = require('gulp');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');

gulp.task('build', () => {
  console.log('-- Building --');
  return gulp.src(['src/**/**.js'])
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('dist/src/'))
});

gulp.task('default', () => {
  console.log('-- Watching --');
  return nodemon({
    script: 'dist/src/index.js',
    ext: 'js',
    watch: 'src',
    tasks: 'build',
    execMap: { js: 'node' },
  });
});
