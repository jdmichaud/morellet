'use strict';
const path = require('path');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/morellet.ts',
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'app.js',
  },
  module: {
    rules: [{
      test: /\.ts$/,
      loader: 'ts-loader',
    }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'templates/index.html',
      chunksSortMode: 'dependency',
    }),
    new CopyWebpackPlugin([{ from: 'templates' }]),
  ],
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src")
    ],
    extensions: ['.ts', '.js', 'scss'],
  },

  devServer: {
    contentBase: path.join(process.cwd(), 'dist'),
    clientLogLevel: 'info',
    port: 8080,
    inline: true,
    historyApiFallback: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500,
    },
  },

  devtool: 'source-map',
};
