const { createAdapter } = require('../../adapter');

createAdapter();
const { transformNode } = require('../key');

describe('Transpile module: key', () => {
  it('should transform static key', () => {
    const el = {
      key: 'static-key',
    };
    transformNode(el);
    expect(el.key).toEqual('static-key');
  });

  it('should transform key binded key', () => {
    const el = {
      key: 'tabs-index-{{idx}}',
    };
    transformNode(el);
    expect(el.key).toEqual('("tabs-index-") + (data[\'idx\'])');
  });
});
