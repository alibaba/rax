const t = require('_@babel_types@7.1.3@@babel/types/lib/index');
const isFunctionComponent = require('../../utils/isFunctionComponent');
const isClassComponent = require('../../utils/isClassComponent');
const traverse = require('../../utils/traverseNodePath');

/**
 * Get Function or Class Return JSX NodePath
 * @param defaultExportedPath
 * @returns {NodePath|void}
 */
function getReturnPath(defaultExportedPath) {
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

module.exports = function createTemplatePlugin({ parse, generate }) {
  return {
    parse(parsed, code, options) {
      const { defaultExportedPath } = parsed;
      if (!defaultExportedPath) return;

      let returnPath = getReturnPath(defaultExportedPath);
      if (!returnPath) return;

      parse(parsed, returnPath);
    },
    generate(ret, parsed, options) {
      generate(ret, parsed, options);
    },
  };
};
