import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'development',
  entry: {
    'index.module': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'module',
    })
  ]
};
