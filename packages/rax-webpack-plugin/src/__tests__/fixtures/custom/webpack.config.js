import RaxWebpackPlugin from '../../../index';

module.exports = {
  mode: 'production',
  optimization: {
    minimize: false
  },
  entry: {
    'index.bundle': './index',
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle',
      sourcePrefix: function(source, chunk, hash) {
        return 'customDefine("' + chunk.name + '", function(require) {';
      },
      sourceSuffix: function(source, chunk, hash) {
        return '})';
      }
    })
  ]
};
