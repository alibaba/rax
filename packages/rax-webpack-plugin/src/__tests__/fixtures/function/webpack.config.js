import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: {
    'index.function': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'function',
    })
  ]
};
