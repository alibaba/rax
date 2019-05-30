const { transformNode } = require('../attrs');

describe('Transpile module: attrs', () => {
  it('should transform attr', () => {
    const el = {
      attrsList: [
        { name: 'foo-bar', value: 'foo' },
        { name: 'foobar', value: 'foo' },
      ],
    };
    transformNode(el);
    expect(el.attrsList[0].name).toEqual('fooBar');
    expect(el.attrsList[1].name).toEqual('foobar');
  });

  it('should not transform dataset or aria', () => {
    const el = {
      attrsList: [
        { name: 'data-foo', value: 'foo' },
        { name: 'aria-label', value: 'foo' },
      ],
    };
    transformNode(el);
    expect(el.attrsList[0].name).toEqual('data-foo');
    expect(el.attrsList[1].name).toEqual('aria-label');
  });
});
