
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/amplify-loader.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'aws-amplify.bundle.js',
    library: 'aws_amplify',
    libraryTarget: 'window',
  },
};