const compiler = require('vue-template-compiler');

/**
 * parse content template to ast
 * @param content
 * @return ast
 */
module.exports = function parse(content, opts) {
  return compiler.compile(content, opts);
};

module.exports.parseSFCParts = function(content) {
  return compiler.parseComponent(content);
};
