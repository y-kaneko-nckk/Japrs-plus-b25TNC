
const path = require('path');

module.exports = {
  entry: '../js/login.js', // エントリーポイント
  output: {
    filename: 'bundle.js', // 出力ファイル
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};