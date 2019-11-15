const { _transformComponents } = require('../components');
const { parseExpression, parseCode, getImported } = require('../../parser/index');
const genCode = require('../../codegen/genCode');

describe('Transform components', () => {
  it('should transform Provider', () => {
    const ast = parseExpression(`
    <ThemeContext.Provider value={this.state}>
        <View>Test</View>
      </ThemeContext.Provider>`);
    const parsed = {
      templateAST: ast
    };
    const options = {};
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
    const options = {};
    const { componentsAlias } = _transformComponents(parsed, options);
    expect(genCode(ast).code).toEqual(`<rax-view>
        <c-a94616 __parentId="{{__tagId}}" __tagId="0" />
      </rax-view>`);
    expect(componentsAlias).toEqual({'c-a94616': {'default': true, 'namespace': false, 'from': '../components/CustomEl', 'isCustomEl': true, 'local': 'CustomEl', 'name': 'c-a94616'}});
  });
});
