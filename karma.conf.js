var webpackConfig = require('./webpack.config');

module.exports = function(config) {
    config.set({
        autoWatch: false,
        basepath: "src",
        browsers: ["Chrome"],
        colors: true,
        exclude: [],
        files: ["**/*.spec.ts"],
        frameworks: ['jasmine'],
        preprocessors: {
            "**/*.spec.ts": ["webpack"] // Using karma-webpack npm module
        },
        reporters: ['progress'],
        singleRun: true,
        webpack: {
            mode: 'development',
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        }
    })
}