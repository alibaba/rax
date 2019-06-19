const path = require('path');

const getConfig = (pathConfig) => {
  return {
    target: 'node',
    mode: 'development',
    entry: {},
    output: {
      path: pathConfig.appBuild,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    externals: {
      rax: 'rax',
    },
    resolve: {
      extensions: ['.js', '.jsx', 'mjs'],
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
                  '@babel/preset-env', {
                    exclude: [
                      'transform-typeof-symbol',
                      'transform-regenerator',
                      'transform-async-to-generator'
                    ]
                  }
                ],
                ['@babel/preset-react', {
                  'pragma': 'createElement',
                  'pragmaFrag': 'Fragment'
                }]],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ],
            }
          }
        ]
      }, {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('css-loader'),
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
              ],
            }
          },
        ]
      }]
    }
  };
};


module.exports = getConfig;