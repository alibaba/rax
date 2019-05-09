const t = require('@babel/types');
const { NodePath } = require('@babel/traverse');
const isFunctionComponent = require('../utils/isFunctionComponent');
const isClassComponent = require('../utils/isClassComponent');
const traverse = require('../utils/traverseNodePath');
const TEMPLATE_PATH = 'templatePath';

/**
 * Extract JSXElement path.
 */
module.exports = {
  parse(parsed, code, options) {
    const { defaultExportedPath } = parsed;
    if (!defaultExportedPath) return;

    if (isFunctionComponent(defaultExportedPath)) {
      const returnPath = getReturnElementPath(defaultExportedPath);
      parsed[TEMPLATE_PATH] = returnPath;
    } else if (isClassComponent(defaultExportedPath)) {
      const renderFnPath = getRenderMethodPath(defaultExportedPath);
      const returnPath = getReturnElementPath(renderFnPath);
      parsed[TEMPLATE_PATH] = returnPath;
    }
  },
  generate(ret, parsed, options) {
    if (parsed[TEMPLATE_PATH]) {
      ret.template = generate(parsed[TEMPLATE_PATH]);
    }
  },
};

/**
 * Get reutrn statement element.
 */
function getReturnElementPath(path) {
  let result = null;

  traverse(path, {
    ReturnStatement: {
      exit(returnStatementPath) {
        result = returnStatementPath.get('argument');
      }
    },
  });

  return result;
}

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
