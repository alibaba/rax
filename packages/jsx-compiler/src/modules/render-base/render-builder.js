const t = require('@babel/types');
const isFunctionComponent = require('../../utils/isFunctionComponent');
const isClassComponent = require('../../utils/isClassComponent');
const traverse = require('../../utils/traverseNodePath');
const { buildJSXExpressionAst } = require('../../utils/astUtils');
const FULL_RETURN_AST = 'FULL_RETURN_AST';

function renderBuilder({ name, parse, generate }) {
  return {
    parse(parsed, code, options) {
      const { defaultExportedPath } = parsed;
      if (!defaultExportedPath) return;

      let returnPath = getReturnAstPath(defaultExportedPath);
      if (!returnPath) return;

      let renderAst = returnPath.node;
      parse(parsed, buildJSXExpressionAst(renderAst), returnPath);
    },
    generate(ret, parsed, options) {
      generate(ret, parsed, options);
    },
  };
};

/**
 * Get Function or Class Return JSX Ast
 * @param defaultExportedPath
 * @returns {*}
 */
function getReturnAstPath(defaultExportedPath) {
  if (isFunctionComponent(defaultExportedPath)) {
    return getReturnElementPath(defaultExportedPath);
  } else if (isClassComponent(defaultExportedPath)) {
    const renderFnPath = getRenderMethodPath(defaultExportedPath);
    if (!renderFnPath) return;
    return getReturnElementPath(renderFnPath);
  }
}

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

module.exports = renderBuilder;
