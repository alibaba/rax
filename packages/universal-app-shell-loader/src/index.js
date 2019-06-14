const t = require('@babel/types');
const parse = require('./parse');
const traverse = require('./traverse');
const getDefaultExportedPath = require('./getDefaultExportedPath');
const convertAstExpressionToVariable = require('./convertAstExpressionToVariable');

/**
 * Universal App Shell Loader for Rax.
 */
module.exports = function(content) {
  if (this.data.appConfig !== null) {
    console.log(this.data.appConfig);
  }
  return content;
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.appConfig = null; // Provide default value.

  const rawContent = this.fs.readFileSync(this.resource).toString();
  const ast = parse(rawContent);
  const defaultExportedPath = getDefaultExportedPath(ast);
  if (defaultExportedPath) {
    traverse(defaultExportedPath, {
      ClassProperty(path) {
        const { node } = path;
        if (node.static && t.isIdentifier(node.key, { name: 'config' })) {
          data.appConfig = convertAstExpressionToVariable(node.value);
        }
      }
    });
  }
};

