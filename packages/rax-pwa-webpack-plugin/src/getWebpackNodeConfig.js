const getConfig = (appDirectory) => {
  return {
    target: 'node',
    mode: 'development',
    entry: {},
    output: {
      path: appDirectory + '/.temp',
      filename: '[name].js',
      libraryTarget: 'commonjs2',
    },
    externals: {
      rax: 'rax',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.mjs'],
    },
    module: {
      rules: [{
        test: /\.jsx?$/i,
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
      }]
    }
  };
};


module.exports = getConfig;
