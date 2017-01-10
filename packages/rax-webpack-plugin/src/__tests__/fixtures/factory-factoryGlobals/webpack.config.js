import RaxWebpackPlugin from '../../../index';

module.exports = {
  entry: {
    'index.factory': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'factory',
      factoryGlobals: ['weex'],
    })
  ]
};
