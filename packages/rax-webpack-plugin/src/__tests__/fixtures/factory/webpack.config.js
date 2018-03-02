import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'development',
  entry: {
    'index.factory': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'factory'
    })
  ]
};
