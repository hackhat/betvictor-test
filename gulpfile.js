var webpack = require('webpack');
var webpackConfig = require('tottys-project').webpackConfig({
    rootPath: __dirname,
    overrideUnderscoreWithLodash: false,
    styles: {
        enabled: false
    }
})


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

module.exports = require('tottys-project').gulpfile({
    rootPath      : __dirname,
    webpackConfig : webpackConfig,
    gulp          : require('gulp'),
    webpack       : webpack,
});

module.exports = {
    webpackConfig: webpackConfig
}
