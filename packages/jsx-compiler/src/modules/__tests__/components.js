const { _transformComponents } = require('../components');
const { parseExpression, parseCode, getImported } = require('../../parser/index');
const genCode = require('../../codegen/genCode');
const adapter = require('../../adapter').ali;
const wxAdapter = require('../../adapter').wechat;

describe('Transform components', () => {
  it('should transform Provider', () => {
    const ast = parseExpression(`
    <ThemeContext.Provider value={this.state}>
        <View>Test</View>
      </ThemeContext.Provider>`);
    const parsed = {
      templateAST: ast
    };
    const options = {
      adapter
    };
    const { contextList } = _transformComponents(parsed, options);
    expect(genCode(ast).code).toEqual(`<block>
        <View>Test</View>
      </block>`);
    expect(contextList[0].contextName).toEqual('ThemeContext');
    expect(genCode(contextList[0].contextInitValue).code).toEqual('this.state');
  });
  it('should transform Custom Component', () => {
    const importedAST = parseCode(`
      import CustomEl from '../components/CustomEl';
      import View from 'rax-view';
    `);
    const imported = getImported(importedAST);
    const ast = parseExpression(`
      <View>
        <CustomEl />
      </View>
    `);
    const parsed = {
      templateAST: ast,
      imported,
      componentDependentProps: {},
      componentsAlias: {}
    };
    const options = {
      adapter
    };
    const { componentsAlias } = _transformComponents(parsed, options);
    expect(genCode(ast).code).toEqual(`<rax-view>
        <c-a94616 __tagId="{{__tagId}}-0" />
      </rax-view>`);
    expect(componentsAlias).toEqual({'c-a94616': {'default': true, 'namespace': false, 'from': '../components/CustomEl', 'isCustomEl': true, 'local': 'CustomEl', 'name': 'c-a94616'}});
  });
  it('should handle wechat miniprogram text', () => {
    const importedAST = parseCode(`
      import CustomEl from '../components/CustomEl';
      import Text from 'rax-text';
    `);
    const imported = getImported(importedAST);
    const sourceCode = '<Text style={styles.name} onClick={handleClick}>123</Text>';
    const ast = parseExpression(sourceCode);
    _transformComponents({
      templateAST: ast,
      imported,
      componentDependentProps: {},
      componentsAlias: {}
    }, {
      adapter: wxAdapter
    });
    expect(genCode(ast).code).toEqual('<rax-text style={styles.name} onClick={handleClick}>123</rax-text>');
  });
  it('should transform JSX Fragment', () => {
    const ast = parseExpression('<View><>Test</></View>');
    const parsed = {
      templateAST: ast
    };
    const options = {
      adapter
    };
    _transformComponents(parsed, options);
    expect(genCode(ast).code).toEqual('<View><block>Test</block></View>');
  });
  it('should transform Muilt Component', () => {
    const parsed = {
      templateAST: undefined, // nuilt export -> templateAST undefined
      imported: {
        './button': [
          {
            local: 'Button',
            default: true,
            namespace: false,
            name: 'c-7bac49',
            isCustomEl: true,
          },
        ],
      },
      exported: ['Button'],
    };
    const options = {
      adapter,
    };
    let res = _transformComponents(parsed, options);

    // transformComponents return componentsAlias like this:
    // {"c-7bac49":{"from":"./button","local":"Button","default":true,"namespace":false,"name":"c-7bac49","isCustomEl":true}}
    expect(Object.keys(res.componentsAlias)[0]).toEqual('c-7bac49');
    // then parse function => exported component has usingComponent
  });
});
