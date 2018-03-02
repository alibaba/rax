import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'development',
  entry: {
    'index.bundle': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle',
      sourcePrefix: function(source, chunk, hash) {
        return 'define("' + chunk.name + '", function(require) {';
      },
      sourceSuffix: function(source, chunk, hash) {
        return '})';
      }
    })
  ]
};
