const path = require('path');

module.exports = {
  entry: './src/morellet.ts',
  output: {
    path: __dirname + '/dist',
    filename: 'morellet.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel?presets[]=es2015'],
    }, {
      test: /\.ts$/,
      loaders: ['ts'],
    }],
  },
  resolve: {
    root: [
      path.resolve('js'),
      path.resolve('templates'),
    ],
  },
};
