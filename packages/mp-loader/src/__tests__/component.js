const compile = require('./__file__/test-compiler');

describe('Component', () => {
  it('should compile component', () => {
    return compile('component');
  });
});
