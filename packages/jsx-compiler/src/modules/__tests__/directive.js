const t = require('@babel/types');
const { _transformCondition, _transformList } = require('../directive');
const { parseExpression } = require('../../parser');
const genExpression = require('../../codegen/genExpression');

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

  describe('nested list', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <View x-for={val in array}>
          <View key={index} x-for={(item,index) in array.items}>{item}</View>
        </View>
      `);
      const dynamicValue = _transformList(ast);
      expect(genExpression(ast).replace('\n', '').replace(/\s\s+/g, ''))
        .toEqual('<View a:for="{{array}}" a:for-item="val"><View key={index} a:for="{{array.items}}" a:for-item="item" a:for-index="index">{item}</View></View>');
      expect(dynamicValue.array.name).toEqual('array');
      expect(dynamicValue.item).toEqual(undefined);
      expect(dynamicValue.index).toEqual(undefined);
    });
  });

  describe('condition', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <View x-if={value}></View>
      `);
      _transformCondition(ast);
      expect(genExpression(ast)).toEqual('<View a:if={value}></View>');
    });
  });
});
