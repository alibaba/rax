import RaxWebpackPlugin from '../../../index';

module.exports = {
  entry: {
    'index.cmd': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'cmd'
    })
  ]
};
