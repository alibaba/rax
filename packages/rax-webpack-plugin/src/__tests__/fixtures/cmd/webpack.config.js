import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: {
    'index.cmd': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'cmd'
    })
  ]
};
