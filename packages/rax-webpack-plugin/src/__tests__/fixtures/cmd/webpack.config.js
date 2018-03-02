import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'development',
  entry: {
    'index.cmd': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'cmd'
    })
  ]
};
