const path = require('path');

module.exports = {
  entry: './src/morellet.js',
  output: {
    path: __dirname + '/dist',
    filename: 'morellet.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
    }],
  },
  resolve: {
    root: [
      path.resolve('js'),
      path.resolve('templates'),
    ],
  },
};
