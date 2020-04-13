const t = require('@babel/types');
const traverse = require('../../utils/traverseNodePath');
const { _transformRenderFunction } = require('../render-function');
const { parseCode } = require('../../parser/index');
const getDefaultExportedPath = require('../../utils/getDefaultExportedPath');
const adapter = require('../../adapter').quickapp;
const createJSX = require('../../utils/createJSX');
const createBinding = require('../../utils/createBinding');
const genExpression = require('../../codegen/genExpression');
const isClassComponent = require('../../utils/isClassComponent');
const isFunctionComponent = require('../../utils/isFunctionComponent');
const getReturnElementPath = require('../../utils/getReturnElementPath');


const TEMPLATE_AST = 'templateAST';
const RENDER_FN_PATH = 'renderFunctionPath';

function _transformTemplate(defaultExportedPath, code, options) {
  const renderFnPath = isFunctionComponent(defaultExportedPath)
    ? defaultExportedPath
    : isClassComponent(defaultExportedPath)
      ? getRenderMethodPath(defaultExportedPath)
      : undefined;
  if (!renderFnPath) return;

  const returnPath = getReturnElementPath(renderFnPath);
  if (!returnPath) throw new Error('Can not find JSX Statements in ' + options.resourcePath);
  let returnArgument = returnPath.get('argument').node;
  if (t.isArrayExpression(returnPath.get('argument'))) {
    returnArgument = createJSX('div', {
      class: t.stringLiteral('__rax-view')
    }, returnPath.get('argument').node.elements);
  }
  if (!['JSXText', 'JSXExpressionContainer', 'JSXSpreadChild', 'JSXElement', 'JSXFragment'].includes(returnArgument.type)) {
    returnArgument = t.jsxExpressionContainer(returnArgument);
  }
  returnPath.remove();
  const result = {};
  const template = createJSX('div', { class: t.stringLiteral('page-container __rax-view') }, [returnArgument]);
  result[TEMPLATE_AST] = createJSX('template', { pagePath: t.stringLiteral('true') }, [template]);
  result[RENDER_FN_PATH] = renderFnPath;
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

describe('Render item function', () => {
  it('should transform this.renderItem function', () => {
    const ast = parseCode(`
       import { createElement, Component } from 'rax';
       export default class Home extends Component {
         renderItem(x) {
           b = 2;
           return <View onClick={this.handleClick}>{x}</View>;
         }
         handleClick() {}
         render() {
           return (
             <View>
               <View>{this.renderItem(1)}</View>
               <View>{this.renderItem(2)}</View>
             </View>
           );
         }
       }
    `);
    const defaultExportedPath = getDefaultExportedPath(ast);
    const { templateAST, renderFunctionPath } = _transformTemplate(defaultExportedPath);
    const { renderItemFunctions } = _transformRenderFunction(templateAST, renderFunctionPath);
    expect(renderItemFunctions.map(fn => ({
      name: fn.name,
      originName: fn.originName
    }))).toEqual([{'name': 'renderItemStateTemp0', 'originName': 'renderItem'},
      {'name': 'renderItemStateTemp1', 'originName': 'renderItem'}]);
  });
});