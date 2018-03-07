import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: {
    'index.factory': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'factory'
    })
  ]
};
