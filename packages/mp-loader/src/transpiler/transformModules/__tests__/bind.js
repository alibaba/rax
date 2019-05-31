const { createAdapter } = require('../../adapter');

createAdapter();
const { transformNode } = require('../bind');

describe('Transpile module: bind', () => {
  it('should transform attr', () => {
    const el = {
      attrsList: [
        { name: 'foo-bar', value: '{{foo}}' },
        { name: 'foobar', value: '{{foo}}' },
      ],
      attrsMap: {
        'foo-bar': '{{foo}}',
        'foobar': '{{foo}}',
      },
    };
    transformNode(el);
    expect(el.attrs[0].name).toEqual('fooBar');
    expect(el.attrs[1].name).toEqual('foobar');
  });

  it('should not transform dataset or aria', () => {
    const el = {
      attrsList: [
        { name: 'data-foo', value: '{{foo}}' },
        { name: 'aria-label', value: '{{foo}}' },
      ],
      attrsMap: {
        'data-foo': '{{foo}}',
        'aria-label': '{{foo}}',
      },
    };
    transformNode(el);
    expect(el.attrsList.length).toEqual(0);
    expect(el.attrs.length).toEqual(2);
    expect(el.attrs[0].name).toEqual('data-foo');
    expect(el.attrs[1].name).toEqual('aria-label');
  });
});
