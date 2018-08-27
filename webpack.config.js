'use strict';
/*import webpack from 'node_modules/webpack';
import HtmlWebpackPlugin from 'node_modules/html-webpack-plugin';
import CopyWebpackPlugin from 'node_modules/copy-webpack-plugin';
import path from 'node_modules/path';*/

//require in webpack
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path');

var ENV = process.env.npm_lifecycle_event;

var isProd = ENV === 'build';

/*
* Webpack requires a config objects to set all the defaults
* We are returning a self invoked function that returns the 
* config object below
*/

module.exports = (function makeWebpackConfig () {

	var config = {};

	config.entry = {
		app: './src/app/index.js'
	};
  
  
	config.output = {
		path: path.resolve(__dirname, './dist'),
		publicPath: isProd ? '/' : 'http://localhost:8080/',
		filename: isProd ? '[name].[hash].js' : '[name].bundle.js',
		chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
	};

	if (isProd) {
		config.devtool =  '#inline-source-map';
	} else {
		config.devtool =  '#inline-source-map';
	}

	config.resolve = {
		modulesDirectories: [
			'node_modules',
			'src/'
		]
	};

	config.module = {
		preLoaders: [],
		loaders: [{
			test: /\.js$/,
			loaders: ['ng-annotate', 'babel'],
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			loaders: ['style', 'css?sourceMap']
		},
		{
			test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
			loader: 'file'
		}, {
			test: /\.html$/,
			loader: 'html?minimize=false',
			exclude: /index\.html/
		}]
	};

	config.plugins = [];
  
	config.plugins.push(
    new HtmlWebpackPlugin({
	title: 'Performance Evaluation Tool',
	template: './src/index.html',
	inject: 'body'
})
  );

  // run if build phase
	if (isProd) {
		config.plugins.push(
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new CopyWebpackPlugin([{
	from: path.resolve(__dirname, './src')
}], { ignore: ['*.html'] })
    );
	}

  // set dev server for testing options
	config.devServer = {
		contentBase: './src',
		stats: 'minimal'
	};

  // return config object
	return config;
}());