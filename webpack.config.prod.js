const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

//our app third party dependencies
const VENDOR_LIBS = [
      'babel-polyfill', 'bootstrap', 'jquery', 'numeral', 'react', 'react-dom', 'react-redux',
      'react-router', 'react-router-redux', 'redux', 'redux-thunk', 'toastr'
];

const config = {
  devtool: 'source-map',
  entry: {
    bundle: './src/index.js',
    vendor: VENDOR_LIBS
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name][chunkhash].js'
    // publicPath: 'build/'
  },
  module: {
    rules: [
      {
        use: 'babel-loader', //here we are selecting the loader
        test: /(\.js|\.jsx)$/, //and here we specify which file the loader will process
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader:  ExtractTextPlugin.extract({loader: 'css-loader?importLoaders=1'})
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: { limit: 40000 }
          },
          'image-webpack-loader'
        ]
      }
    ]
  },
  plugins: [
      // this will grap any css file produced by the css-loader and insert it into the style.css file
      new ExtractTextPlugin({
      filename: '[name][chunkhash].css',
      allChunks: true,
      }),
      //this plugin will make sure there is no duplicate modules between vendor.js and bundle.js if there are it will remove them from bundle.js and put them in vendor.js
      new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
      }),
      //this plugin will insert the script tags for bundle.js and vendor.js in our index.html
      new htmlWebpackPlugin({
            template: 'src/index.html' //if we do not specifiy a template, it will use the default one
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })
    ]
};

module.exports = config;
