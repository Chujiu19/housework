const common = require('./webpack.common.js');
const { merge } = require('webpack-merge'),
    path = require('path'),
    webpack = require('webpack'),
    config = require('./config.js'),
    { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = merge(common, {
    mode: 'production',
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: './js/[name]_[contentHash].js'
    },
    plugins: [
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, '../'),
            verbose: true
        }),
        new webpack.DefinePlugin({
            BASE_URL: JSON.stringify(config.pro.BASE_URL)
        }),
    ]
})