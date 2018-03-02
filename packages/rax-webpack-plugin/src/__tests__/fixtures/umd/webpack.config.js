import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'development',
  entry: {
    'index.umd': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'umd'
    })
  ]
};
