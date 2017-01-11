import RaxWebpackPlugin from '../../../index';

module.exports = {
  entry: {
    'index.umd': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'umd'
    })
  ]
};
