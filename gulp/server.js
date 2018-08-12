'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
//var gutil = require('gulp-util');
//var util = require('util');
var connect = require('gulp-connect');

var modRewrite = require('connect-modrewrite');
//var browserSync = require('browser-sync');
//var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

//gutil.log("teeeeeest");
//module.exports = function(options) {
// gutil.log("teeeeeest");
//var proxyMiddleware = require('http-proxy-middleware');
function createServerTask(name, pre, root) {

    gulp.task(name, pre, function() {
        connect.server({
            root: root,
            port: 3001,
            debug: true,
            middleware: function (connect) {
                  return [
                      modRewrite(['^[^\\.]*$ /index.html [L]']),
                      connect.static('.tmp'),
                      connect().use(
                          '/bower_components',
                          connect.static('./bower_components')
                      ),
                      connect.static('app')
                  ];
              }
        });
    });
}



//createServerTask( 'serve', ['watch'], [path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
createServerTask('serve', ['watch'], [path.join(conf.paths.tmp, '/serve'), conf.paths.src, './']);

createServerTask('serve:dist', ['build'], [conf.paths.dist]);

createServerTask('serve:e2e', ['inject'], [conf.paths.tmp + '/serve', conf.paths.src, './']);

//createServerTask('serve', ['watch'], [conf.paths.tmp + '/serve', conf.paths.src, './']);

createServerTask('serve:e2e-dist', ['build'], conf.paths.dist);

//};

//
//var proxyMiddleware = require('http-proxy-middleware');
//
//function browserSyncInit(baseDir, browser)
//{
//    browser = browser === undefined ? 'default' : browser;
//
//    var routes = null;
//    if ( baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1) )
//    {
//        routes = {
//            '/bower_components': 'bower_components'
//        };
//    }
//
//    var server = {
//        baseDir: baseDir,
//        routes : routes
//    };
//
//    /*
//     * You can add a proxy to your backend by uncommenting the line below.
//     * You just have to configure a context which will we redirected and the target url.
//     * Example: $http.get('/users') requests will be automatically proxified.
//     *
//     * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.9.0/README.md
//     */
//    // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', changeOrigin: true});
//
//    browserSync.instance = browserSync.init({
//        startPath: '/',
//        server   : server,
//        browser  : browser,
//        ghostMode: false 
//    });
//}
//
//browserSync.use(browserSyncSpa({
//    selector: '[ng-app]'// Only needed for angular apps
//}));
//
//gulp.task('serve', ['watch'], function ()
//{
//    browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
//});
//
//gulp.task('serve:dist', ['build'], function ()
//{
//    browserSyncInit(conf.paths.dist);
//});
//
//gulp.task('serve:e2e', ['inject'], function ()
//{
//    browserSyncInit([conf.paths.tmp + '/serve', conf.paths.src], []);
//});
//
//gulp.task('serve:e2e-dist', ['build'], function ()
//{
//    browserSyncInit(conf.paths.dist, []);
//});