const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	entry: [
		'@babel/polyfill', './src/index.js'
	],
	output: {
		path: path.resolve(__dirname, './dist'),
		libraryTarget: 'commonjs2',
		filename: 'index.js'
	},
	externals: [
		nodeExternals()
	],
	resolve: {
		extensions: ['.js']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.html$/,
				use: 'html-loader'
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				],
			},
			{
				test: /.(png|woff|woff2|eot|ttf|svg)(\?.*)?$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 100000
					}
				}
			}
		]
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
	plugins: [
		new MiniCssExtractPlugin()
	]
};
