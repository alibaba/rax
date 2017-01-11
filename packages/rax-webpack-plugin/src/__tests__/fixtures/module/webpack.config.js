import RaxWebpackPlugin from '../../../index';

module.exports = {
  entry: {
    'index.module': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'module',
    })
  ]
};
