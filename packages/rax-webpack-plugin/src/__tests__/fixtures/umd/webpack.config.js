import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: {
    'index.umd': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'umd'
    })
  ]
};
