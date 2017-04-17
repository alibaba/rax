import RaxWebpackPlugin from '../../../index';

module.exports = {
  entry: {
    'index.bundle': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle',
      sourcePrefixFn: function(source, chunk, hash) {
        return 'define("' + chunk.name + '", function(require) {';
      },
      sourceSuffixFn: function(source, chunk, hash) {
        return '})';
      }
    })
  ]
};
