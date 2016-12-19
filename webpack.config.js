module.exports = {
  context: `${__dirname}`,
  entry: `./main.jsx`,
  output: {
    path: `${__dirname}/dist`,
    filename: `bundle.js`
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: `babel-loader`,
        exclude: /node_modules/,
        query: {
          presets: [`es2015`, `react`]
        }
      }
    ]
  }
};
