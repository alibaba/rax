import RaxWebpackPlugin from '../../../index';

module.exports = {
  entry: {
    'index.bundle': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle'
    })
  ]
};
