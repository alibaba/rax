const t = require('@babel/types');
const traverse = require('../../utils/traverseNodePath');
const { _transformRenderPropsFunction, _renderPropsMap } = require('../render-props');
const { parseCode } = require('../../parser/index');
const getReturnElementPath = require('../../utils/getReturnElementPath');
const adapter = require('../../adapter').ali;
const createJSX = require('../../utils/createJSX');
const createBinding = require('../../utils/createBinding');
const genExpression = require('../../codegen/genExpression');

describe('Pass render props', () => {
  it('basic render props usage', () => {
    const ast = parseCode(`
    export default function Component() {
      return (
        <View>
          <Mouse renderCat={mouse => (
            <Cat mouse={mouse} />
          )} />
        </View>
      );
    }
    `);
    const renderFnPath = getDefaultComponentFunctionPath(ast);
    const returnPath = getReturnElementPath(ast);
    const targetAST = transformReturnPath(returnPath);
    const { renderPropsFunctions } = _transformRenderPropsFunction(targetAST, renderFnPath);
    expect(renderPropsFunctions.map(fn => ({
      name: fn.name,
      originName: fn.originName
    }))).toEqual([{'name': 'renderCatState__temp0', 'originName': 'renderCat0'}]);

    expect(genExpression(targetAST)).toEqual(`<block a:if="{{$ready}}"><template name="renderCat0"><Cat mouse={mouse} /></template><View>
          <Mouse><view slot="cat"><template is="renderCat0" data="{{...renderCatState__temp0, __tagId: __tagId}}"></template></view></Mouse>
        </View></block>`);
  });

  it('pass a variable declarator of render function to render props', () => {
    const ast = parseCode(`
    export default function Component() {
      const renderCat = (mouse) => {
        return (<Cat mouse={mouse} />)
      };
      return (
        <View>
          <Mouse renderCat={renderCat} />
        </View>
      );
    }
    `);
    const renderFnPath = getDefaultComponentFunctionPath(ast);
    const returnPath = getReturnElementPath(ast);
    const targetAST = transformReturnPath(returnPath);
    const { renderPropsFunctions } = _transformRenderPropsFunction(targetAST, renderFnPath);
    expect(renderPropsFunctions.map(fn => ({
      name: fn.name,
      originName: fn.originName
    }))).toEqual([{'name': 'renderCatState__temp0', 'originName': 'renderCat0'}]);

    expect(genExpression(targetAST)).toEqual(`<block a:if="{{$ready}}"><template name="renderCat0"><Cat mouse={mouse} /></template><View>
          <Mouse><view slot="cat"><template is="renderCat0" data="{{...renderCatState__temp0, __tagId: __tagId}}"></template></view></Mouse>
        </View></block>`);
  });
});

describe('Get render props', () => {
  it('basic render props usage', () => {
    _renderPropsMap.set('Component_renderCat', 'renderCat0');
    const ast = parseCode(`
    export default function Component(props) {
      const { renderCat } = props;
      return (
        <View>
        {renderCat(name)}
        </View>
      );
    }
    `);
    const renderFnPath = getDefaultComponentFunctionPath(ast);
    const returnPath = getReturnElementPath(ast);
    const targetAST = transformReturnPath(returnPath);
    const { renderPropsFunctions } = _transformRenderPropsFunction(targetAST, renderFnPath);

    expect(genExpression(targetAST)).toEqual(`<block a:if="{{$ready}}"><View>
        <slot name="cat"></slot>
        </View></block>`);
  });

  it('basic render props usage', () => {
    const ast = parseCode(`
    export default function Component() {
      return (
        <View>
          <Mouse renderCat={mouse => (
            <Cat mouse={mouse} />
          )} />
        </View>
      );
    }
    `);
    const renderFnPath = getDefaultComponentFunctionPath(ast);
    const returnPath = getReturnElementPath(ast);
    const targetAST = transformReturnPath(returnPath);
    const { renderPropsFunctions } = _transformRenderPropsFunction(targetAST, renderFnPath);
    expect(renderPropsFunctions.map(fn => ({
      name: fn.name,
      originName: fn.originName
    }))).toEqual([{'name': 'renderCatState__temp0', 'originName': 'renderCat0'}]);

    expect(genExpression(targetAST)).toEqual(`<block a:if="{{$ready}}"><template name="renderCat0"><Cat mouse={mouse} /></template><View>
          <Mouse><view slot="cat"><template is="renderCat0" data="{{...renderCatState__temp0, __tagId: __tagId}}"></template></view></Mouse>
        </View></block>`);
  });
});

function transformReturnPath(path) {
  let returnArgument = path.get('argument').node;
  if (!['JSXText', 'JSXExpressionContainer', 'JSXSpreadChild', 'JSXElement', 'JSXFragment'].includes(returnArgument.type)) {
    returnArgument = t.jsxExpressionContainer(returnArgument);
  }
  return createJSX('block', {
    [adapter.if]: t.stringLiteral(createBinding('$ready')),
  }, [returnArgument]);
}

function getDefaultComponentFunctionPath(path) {
  let defaultComponentFunctionPath = null;
  traverse(path, {
    ExportDefaultDeclaration(exportDefaultPath) {
      const declarationPath = exportDefaultPath.get('declaration');
      if (declarationPath.isFunctionDeclaration()) {
        defaultComponentFunctionPath = declarationPath;
      }
    }
  });

  return defaultComponentFunctionPath;
}
