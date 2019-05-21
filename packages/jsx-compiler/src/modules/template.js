const t = require('@babel/types');
const { NodePath } = require('@babel/traverse');
const isFunctionComponent = require('../utils/isFunctionComponent');
const isClassComponent = require('../utils/isClassComponent');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');

const TEMPLATE_AST = 'templateAST';

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

      parsed[TEMPLATE_AST] = returnPath.node;
      // parsed[TEMPLATE_NODES] = parseElement(returnPath.node);

      returnPath.remove();
    } else if (isClassComponent(defaultExportedPath)) {
      const renderFnPath = getRenderMethodPath(defaultExportedPath);
      if (!renderFnPath) return;

      const returnPath = getReturnElementPath(renderFnPath);
      if (!returnPath) return;

      parsed[TEMPLATE_AST] = returnPath.node;
      // parsed[TEMPLATE_NODES] = parseElement(returnPath.node, {
      //   tagName(rawTagName) {
      //     if (parsed.usingComponents && parsed.usingComponents.has(rawTagName)) {
      //       const { tagName } = parsed.usingComponents.get(rawTagName);
      //       return tagName;
      //     } else {
      //       return kebabCase(rawTagName).replace(/^-/, '');
      //     }
      //   },
      // });

      renderFnPath.remove();
    }
  },
  generate(ret, parsed, options) {
    if (parsed[TEMPLATE_AST]) {
      ret.template = genExpression(parsed[TEMPLATE_AST]);
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
