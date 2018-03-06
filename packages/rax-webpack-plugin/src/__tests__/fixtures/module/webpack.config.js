import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: {
    'index.module': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'module',
    })
  ]
};
