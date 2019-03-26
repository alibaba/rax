'use strict';
var path = require('path')
var webpack = require('webpack')
var VueLoaderPlugin = require('vue-loader/lib/plugin')

var cache = {};
var loaders = [
	{
		test: /\.js$/,
		loader: 'babel-loader',
        exclude: /node_modules/
	},
	{
		test: /\.css$/,
		use: [
			'vue-style-loader',
 			'css-loader'
		]
	},
	{
		test: /\.vue$/,
		loader: 'vue-loader',
		query: {
			preserveWhitespace: false
		}
	}
];
var extensions = [
	'.js', '.jsx', '.es6.js', '.msx'
];

module.exports = [{
	cache: cache,
	module: {
		rules: loaders
	},
	entry: {
		main: './src/main',
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: '[name].js',
		sourceMapFilename: "[file].map",
	},
	resolve: {
		modules: [
			__dirname,
			path.resolve(__dirname, "src"),
			"node_modules"
		],
		extensions: extensions
	},
	plugins: [
		new VueLoaderPlugin()
	]
}];
