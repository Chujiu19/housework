const common = require('./webpack.common.js');
const { merge } = require('webpack-merge'),
    webpack = require('webpack'),
    config = require('./config.js'),
    path = require('path')


module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        host: "127.0.0.1",
        port: 8080,
        hot: true,
        hotOnly: true,
        overlay: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify(config.dev.BASE_URL),
        }),
    ],
})