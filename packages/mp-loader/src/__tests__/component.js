const compile = require('./__files__/test-compiler');

describe('Component', () => {
  it('should compile component', () => {
    return compile('component');
  });
});
