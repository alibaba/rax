import RaxWebpackPlugin from '../../../index';

module.exports = {
  entry: {
    'index.function': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'function',
    })
  ]
};
