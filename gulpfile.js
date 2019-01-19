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
