const {
  _transformCondition,
  _transformList,
  _transformFragment,
} = require('../jsx-plus');
const { parseExpression } = require('../../parser');
const genExpression = require('../../codegen/genExpression');
const adapter = require('../../adapter');

describe('Directives', () => {
  describe('list', () => {
    it('simple', () => {
      const code = `
      <View x-for={val in array}>{val}</View>
    `;
      const ast = parseExpression(code);
      _transformList(ast, code, adapter);
      expect(genExpression(ast))
        .toEqual(`<View a:for={array.map((val, index) => {
  return {
    val: val,
    index: index
  };
})} a:for-item="val" a:for-index="index">{val}</View>`);
    });

    it('nested', () => {
      const code = `
      <View x-for={item in array}>
        <View x-for={item2 in item}>
          {item2}
        </View>
      </View>
    `;
      const ast = parseExpression(code);
      _transformList(ast, code, adapter);
      expect(genExpression(ast))
        .toEqual(`<View a:for={array.map((item, index) => {
  item = item.map((item2, index) => {
    return {
      item2: item2,
      index: index
    };
  });
  return {
    item: item,
    index: index
  };
})} a:for-item="item" a:for-index="index">
        <View a:for={item} a:for-item="item2" a:for-index="index">
          {item2}
        </View>
      </View>`);
    });
  });

  describe('condition', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <View x-if={value}></View>
      `);
      _transformCondition(ast, adapter);
      expect(genExpression(ast)).toEqual('<View a:if={value}></View>');
    });
  });

  describe('fragment', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <Fragment foo="bar"></Fragment>
      `);
      _transformFragment(ast);
      expect(genExpression(ast)).toEqual('<block foo="bar"></block>');
    });
  });
});
