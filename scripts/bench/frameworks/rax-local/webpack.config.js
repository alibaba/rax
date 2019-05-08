const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: {
    main: path.join(__dirname, 'src', 'main.jsx'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['last 1 chrome versions']
                  },
                  loose: true
                }
              ], '@babel/preset-react'
            ]
          }
        }
      ]
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    })
  ],
};
