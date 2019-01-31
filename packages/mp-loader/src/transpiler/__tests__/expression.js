const { hasExpression, transformExpression } = require('../expression');

describe('expression', () => {
  describe('hasExpression', () => {
    it('no expression', () => {
      expect(hasExpression('exp'))
        .toBeFalsy();
    });

    it('simple expression', () => {
      expect(hasExpression('{{exp}}'))
        .toBeTruthy();
    });

    it('complex expression', () => {
      expect(hasExpression('foo {{bar}}'))
        .toBeTruthy();
      expect(hasExpression('foo {{ bar + {} }}'))
        .toBeTruthy();
    });
  });

  describe('transformExpression', () => {
    it('no expression', () => {
      expect(transformExpression('exp')).toEqual('("exp")');
    });

    it('simple expression', () => {
      expect(transformExpression('{{exp}}')).toEqual('(exp)');
    });

    it('complex expression', () => {
      expect(transformExpression('hello {{exp}}')).toEqual('("hello ") + (exp)');

      expect(
        transformExpression('{{[{},{}]}}')
      ).toEqual('([{}, {}])');

      expect(
        transformExpression('{{x:{y:1}}}')
      ).toMatchSnapshot();

      expect(
        transformExpression('{{x}} {{y}}')
      ).toEqual('(x) + (" ") + (y)');

      expect(
        transformExpression(`
           {{
              a: 1
           }}
        `)
      ).toMatchSnapshot();
    });
  });
});
