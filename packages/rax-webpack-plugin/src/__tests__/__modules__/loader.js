// Identity loader with SourceMap support
module.exports = function(source, map) {
  this.callback(null, source, map);
};
