const t = require('@babel/types');
const { NodePath } = require('@babel/traverse');
const isFunctionComponent = require('../utils/isFunctionComponent');
const isClassComponent = require('../utils/isClassComponent');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const genExpression = require('../codegen/genExpression');
const createJSX = require('../utils/createJSX');
const getExportComponentPath = require('../utils/getExportComponentPath');
const getProgramPath = require('../utils/getProgramPath');
const quickappConst = require('../const');

const TEMPLATE_AST = 'templateAST';
const RENDER_FN_PATH = 'renderFunctionPath';
/**
 * Extract JSXElement path.
 */
module.exports = {
  parse(parsed, code, options) {
    const { defaultExportedPath, ast } = parsed;
    if (!defaultExportedPath) return;
    const exportComponentPath = parsed.exportComponentPath = getExportComponentPath(defaultExportedPath, getProgramPath(ast), code);
    const renderFnPath = isFunctionComponent(exportComponentPath)
      ? exportComponentPath
      : isClassComponent(exportComponentPath)
        ? getRenderMethodPath(exportComponentPath)
        : undefined;
    if (!renderFnPath) return;

    const returnPath = getReturnElementPath(renderFnPath);
    if (!returnPath) throw new Error('Can not find JSX Statements in ' + options.resourcePath);
    let returnArgument = returnPath.get('argument').node;
    // support render mulit elements
    if (t.isArrayExpression(returnPath.get('argument'))) {
      returnArgument = createJSX(quickappConst.baseComponent, {
        class: t.stringLiteral('__rax-view')
      }, returnPath.get('argument').node.elements);
    }
    if (!['JSXText', 'JSXExpressionContainer', 'JSXSpreadChild', 'JSXElement', 'JSXFragment'].includes(returnArgument.type)) {
      returnArgument = t.jsxExpressionContainer(returnArgument);
    }
    returnPath.remove();
    const template = createJSX(quickappConst.baseComponent, { class: t.stringLiteral('page-container __rax-view') }, [returnArgument]);
    parsed[TEMPLATE_AST] = createJSX('template', { pagePath: t.stringLiteral('true') }, [template]);
    parsed[RENDER_FN_PATH] = renderFnPath;
  },
  generate(ret, parsed, options) {
    if (parsed[TEMPLATE_AST]) {
      ret.template = [
        genExpression(parsed[TEMPLATE_AST], {
          comments: false,
          concise: true,
        })
      ].join('\n');
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
