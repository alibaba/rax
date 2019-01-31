describe('setImmediate', () => {
  beforeAll(() => {
    global._setImmediate = global.setImmediate;
    global.setImmediate = null;
  });
  afterAll(() => {
    global.setImmediate = global._setImmediate;
    delete global._setImmediate;
  });

  it('setImmediate', (done) => {
    const setImmediate = require('../setImmediate').default;
    setImmediate(done);
  });
});
