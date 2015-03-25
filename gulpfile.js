var webpack = require('webpack');
var gulp    = require('gulp');
var server  = require('gulp-develop-server');


var webpackConfig = require('tottys-project').webpackConfig({
    rootPath: __dirname,
    overrideUnderscoreWithLodash: false,
    styles: {
        enabled: true
    }
})



var path = require('path');
webpackConfig.resolve.alias['test'] = path.join(__dirname, './test');



// highcharts config
webpackConfig.module.loaders.push({
    test   : /standalone-framework\.js$/,
    loader : "exports?HighchartsAdapter"
})
webpackConfig.module.loaders.push({
    test   : /highcharts.src.js$/,
    loader : "exports?Highcharts&imports?HighchartsAdapter=HighchartsAdapter"
})
webpackConfig.module.loaders.push({
    test   : /highstock.src.js$/,
    loader : "exports?Highcharts&imports?HighchartsAdapter=HighchartsAdapter"
})
webpackConfig.resolve.alias.highcharts = 'otherModules/highcharts/highcharts-webpack.js';
webpackConfig.resolve.alias.highstock = 'otherModules/highcharts/highstock-webpack.js';



webpackConfig.plugins.push(
   //  new webpack.ProvidePlugin({
   //     'standalone-framework' : "HighchartsAdapter",
   // })
)

require('tottys-project').gulpfile({
    rootPath      : __dirname,
    webpackConfig : webpackConfig,
    gulp          : gulp,
    webpack       : webpack,
});



gulp.task('server', function() {
    server.listen({path: './src/server/index.js'});
    gulp.watch([
        './src/**/*.js'   ,
        './src/**/*.html' ,
    ], server.restart);
});



module.exports = {
    webpackConfig: webpackConfig
}
