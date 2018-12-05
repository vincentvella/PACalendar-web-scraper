require('dotenv').load();
let gulp = require('gulp');
let nodemon = require('nodemon');

gulp.task('default', () => {
    nodemon({
        script: 'dist/index.js',
        ext: 'js',
        env: {
            PORT: process.env.PORT,
            URL: process.env.URL,
        },
        ignore: ['./node_modules/**']
    }).on('restart', () => {
        console.log('Gulp restarted server...');
    });
});
