const { _transformCondition, _transformList, _transformFragment } = require('../jsx-plus');
const { parseExpression } = require('../../parser');
const genExpression = require('../../codegen/genExpression');
const adapter = require('../../adapter');

describe('Directives', () => {
  describe('list', () => {
    it('simple', () => {
      const ast = parseExpression(`
        <View x-for={val in array}>{val}</View>
      `);
      _transformList(ast, adapter);
      expect(genExpression(ast)).toEqual('<View a:for={array} a:for-item="val">{val}</View>');
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
