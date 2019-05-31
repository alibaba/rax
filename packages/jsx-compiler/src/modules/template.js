const t = require('@babel/types');
const { NodePath } = require('@babel/traverse');
const isFunctionComponent = require('../utils/isFunctionComponent');
const isClassComponent = require('../utils/isClassComponent');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const genExpression = require('../codegen/genExpression');

const TEMPLATE_AST = 'templateAST';
const RENDER_FN_PATH = 'renderFunctionPath';

/**
 * Extract JSXElement path.
 */
module.exports = {
  parse(parsed, code, options) {
    const { defaultExportedPath } = parsed;
    if (!defaultExportedPath) return;

    if (isFunctionComponent(defaultExportedPath)) {
      const returnPath = getReturnElementPath(defaultExportedPath);
      if (!returnPath) return;

      parsed[TEMPLATE_AST] = returnPath.get('argument').node;
      parsed[RENDER_FN_PATH] = defaultExportedPath;
      returnPath.remove();
    } else if (isClassComponent(defaultExportedPath)) {
      const renderFnPath = getRenderMethodPath(defaultExportedPath);
      if (!renderFnPath) return;

      const returnPath = getReturnElementPath(renderFnPath);
      if (!returnPath) throw new Error('Can not find JSX Statements in ' + options.filePath);

      parsed[TEMPLATE_AST] = returnPath.get('argument').node;
      parsed[RENDER_FN_PATH] = renderFnPath;
      returnPath.remove();
    }
  },
  generate(ret, parsed, options) {
    if (parsed[TEMPLATE_AST]) {
      ret.template = genExpression(parsed[TEMPLATE_AST], {
        comments: false, // Remove template comments.
        concise: true, // Reduce whitespace, but not to disable all.
      });
    }
  },
};

/**
 * Get the render function path from class component declaration..
 * @param path {NodePath} A nodePath that contains a render function.
 * @return {NodePath} Path to render function.
 */
function getRenderMethodPath(path) {
  let renderMethodPath = null;

  traverse(path, {
    /**
     * Example:
     *   class {
     *     render() {}
     *   }
     */
    ClassMethod(classMethodPath) {
      const { node } = classMethodPath;
      if (t.isIdentifier(node.key, { name: 'render' })) {
        renderMethodPath = classMethodPath;
      }
    },
    /**
     * Example:
     *   class {
     *     render = function() {}
     *     render = () => {}
     *   }
     */
    ClassProperty(path) {
      // TODO: support class property defined render function.
    },
  });

  return renderMethodPath;
}
