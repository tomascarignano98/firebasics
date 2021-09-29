const path = require('path');

module.exports = {
  // The entry point file
  entry: './public/index.js',
  // The location of the build folder
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  devtool: 'eval-source-map'
};
