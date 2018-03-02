import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'development',
  entry: {
    'index.function': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'function',
    })
  ]
};
