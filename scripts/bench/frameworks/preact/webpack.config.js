'use strict';
require("babel-plugin-syntax-jsx")
var path = require('path')
const MinifyPlugin = require("babel-minify-webpack-plugin");
var webpack = require('webpack')

var cache = {};
var loaders = [
    {
        test: /\.jsx$/,
        loader: 'babel-loader'
    },
    {
        test: /\.es6\.js$/,
        loader: 'babel-loader'
    },
    {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
    }
];
var extensions = [
    '.js', '.jsx', '.es6.js', '.msx'
];

module.exports = [{
    cache: cache,
    module: {
        loaders: loaders
    },
    entry: {
        main: './src/Main.jsx',
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: '[name].js',
        sourceMapFilename: "[file].map",
    },
    resolve: {
        extensions: extensions,
        modules: [
            __dirname,
            path.resolve(__dirname, "src"),
            "node_modules"
        ],
        alias: {
            'preact': 'node_modules/preact/dist/preact.min.js',
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new MinifyPlugin()
    ]
}];