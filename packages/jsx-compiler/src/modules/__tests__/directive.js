const t = require('@babel/types');
const { _transformCondition, _transformList } = require('../directive');
const { parseExpression } = require('../../parser');
const genExpression = require('../../codegen/genExpression');
const genCode = require('../../codegen/genCode');

describe('Directives', () => {
  describe('list', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <View x-for={val in array}>{val}</View>
      `);
      const dynamicValue = _transformList(ast);
      expect(genExpression(ast)).toEqual('<View a:for="{{array}}" a:for-item="val">{val}</View>');
      expect(dynamicValue.array.name).toEqual('array');
    });
  });

  describe('condition', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <View x-if={value}></View>
      `);
      const dynamicValue = _transformCondition(ast);
      expect(genExpression(ast)).toEqual('<View a:if="{{value}}"></View>');
      expect(dynamicValue.value.name).toEqual('value');
    });
  });
});
