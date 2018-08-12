/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('gulp');
var fse = require('fs-extra');

     
/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
fse.walkSync('./gulp').filter(function(file)
{
    return (/\.(js|coffee)$/i).test(file);
}
).map(function(file)
{
    require('./' + file);
}
);


/*wrench.readdirSyncRecursive('./gulp').filter(function(file) {
 return (/\.(js|coffee)$/i).test(file);
 }).map(function(file) {
 require('./gulp/' + file);
 });*/


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function()
{
    gulp.start('build');
});


var bowerFiles = require('main-bower-files');
var inject = require('gulp-inject');
var vendorDirectory = './src/assets/vendors';

var bowerStreamJS = gulp.src(bowerFiles('./src/assets/**/*.js'));
var bowerStreamCSS = gulp.src(bowerFiles('./src/assets/**/*.css'));


// copy vendor files from /bower_compontents to /assets/vendors
//bowerStreamJS = bowerStreamJS
//    .pipe(gulp.dest(vendorDirectory));
//bowerStreamCSS = bowerStreamCSS
//    .pipe(gulp.dest(vendorDirectory));
//    
//   

// choose source index.html to inject
gulp.src('./src/index.html')
        // send bower bower scripts
        .pipe(
                inject(bowerStreamJS, {relative: true,name:'bower'})
                )
        // send bower bower css
        .pipe(
                inject(bowerStreamCSS, {relative: true,name:'bower'})
                )
        // save the file
        .pipe(
                gulp.dest('src')
                );
    