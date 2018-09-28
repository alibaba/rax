const compiler = require('vue-template-compiler');

/**
 * parse content template to ast
 * @param content
 * @return ast
 */
module.exports = function parse(content) {
  return compiler.compile(content);
};

module.exports.parseSFCParts = function(content) {
  return compiler.parseComponent(content);
};
