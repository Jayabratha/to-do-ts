module.exports = {
    entry: './src/index.ts',
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },
    mode: 'production',
    devtool: "source-map",
    devServer: {
        contentBase: './dist'
    },
    resolve: {
        extensions: [".ts", ".js", ".json"]
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { test: /\.js$/, loader: "source-map-loader", enforce: "pre" },
            { test: /\.(s*)css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/'
                    }
                }]
            }
        ]
    }
}