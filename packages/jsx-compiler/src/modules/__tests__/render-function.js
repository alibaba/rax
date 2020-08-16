const t = require('@babel/types');
const traverse = require('../../utils/traverseNodePath');
const { _transformRenderFunction } = require('../render-function');
const { parseCode } = require('../../parser/index');
const getReturnElementPath = require('../../utils/getReturnElementPath');
const adapter = require('../../adapter').ali;
const createJSX = require('../../utils/createJSX');
const createBinding = require('../../utils/createBinding');
const genExpression = require('../../codegen/genExpression');

describe('Render item function', () => {
  it('should transform this.renderItem function', () => {
    const ast = parseCode(`
       class Home extends Component {
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
    const renderFnPath = getRenderMethodPath(ast);
    const returnPath = getReturnElementPath(ast);
    const targetAST = transformReturnPath(returnPath);
    const renderItemFunctions = _transformRenderFunction(targetAST, renderFnPath);
    expect(renderItemFunctions.map(fn => ({
      name: fn.name,
      originName: fn.originName
    }))).toEqual([{'name': 'renderItemState__temp0', 'originName': 'renderItem'},
      {'name': 'renderItemState__temp1', 'originName': 'renderItem'}]);

    expect(genExpression(targetAST)).toEqual(`<block a:if="{{$ready}}"><template name="renderItem"><View onClick={this.handleClick}>{x}</View></template><View>
               <View><template is="renderItem" data="{{...renderItemState__temp0}}"></template></View>
               <View><template is="renderItem" data="{{...renderItemState__temp1}}"></template></View>
             </View></block>`);
  });
});

describe('Render closure function component', () => {
  it('should transform basic closure function component', () => {
    const ast = parseCode(`
    export default function Component() {
      const renderItem = () => {
        return <View>item</View>;
      }
      return (
        <View>
          <View>{renderItem()}</View>
        </View>
      );
    }
    `);
    const renderFnPath = getDefaultComponentFunctionPath(ast);
    const returnPath = getReturnElementPath(ast);
    const targetAST = transformReturnPath(returnPath);
    const renderItemFunctions = _transformRenderFunction(targetAST, renderFnPath);
    expect(renderItemFunctions.map(fn => ({
      name: fn.name,
      originName: fn.originName
    }))).toEqual([{'name': 'renderItemState__temp0', 'originName': 'renderItem'}]);

    expect(genExpression(targetAST)).toEqual(`<block a:if="{{$ready}}"><template name="renderItem"><View>item</View></template><View>
          <View><template is="renderItem" data="{{...renderItemState__temp0}}"></template></View>
        </View></block>`);
  });
  it('should transform closure function component used function declaration', () => {
    const ast = parseCode(`
    export default function Component() {
      function renderItem() {
        return <View>item</View>;
      }
      return (
        <View>
          <View>{renderItem()}</View>
        </View>
      );
    }
    `);
    const renderFnPath = getDefaultComponentFunctionPath(ast);
    const returnPath = getReturnElementPath(ast);
    const targetAST = transformReturnPath(returnPath);
    const renderItemFunctions = _transformRenderFunction(targetAST, renderFnPath);
    expect(renderItemFunctions.map(fn => ({
      name: fn.name,
      originName: fn.originName
    }))).toEqual([{'name': 'renderItemState__temp0', 'originName': 'renderItem'}]);

    expect(genExpression(targetAST)).toEqual(`<block a:if="{{$ready}}"><template name="renderItem"><View>item</View></template><View>
          <View><template is="renderItem" data="{{...renderItemState__temp0}}"></template></View>
        </View></block>`);
  });
  it('should transform closure function component with params', () => {
    const ast = parseCode(`
    export default function Component() {
      const renderItem = (name) => {
        return <View>{name}</View>;
      }
      return (
        <View>
          <View>{renderItem('rax')}</View>
        </View>
      );
    }
    `);
    const renderFnPath = getDefaultComponentFunctionPath(ast);
    const returnPath = getReturnElementPath(ast);
    const targetAST = transformReturnPath(returnPath);
    const renderItemFunctions = _transformRenderFunction(targetAST, renderFnPath);
    expect(renderItemFunctions.map(fn => ({
      name: fn.name,
      originName: fn.originName
    }))).toEqual([{'name': 'renderItemState__temp0', 'originName': 'renderItem'}]);

    expect(genExpression(targetAST)).toEqual(`<block a:if="{{$ready}}"><template name="renderItem"><View>{name}</View></template><View>
          <View><template is="renderItem" data="{{...renderItemState__temp0}}"></template></View>
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
    }
  });

  return renderMethodPath;
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
