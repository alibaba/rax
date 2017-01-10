jest.autoMockOff();

describe('OS', () => {
  it('should use navigator platform', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel'
    });
    const Platform = require('../index');
    const selectOS = Platform.select({
      macintel: 'test'
    });
    expect(Platform.OS).toEqual('macintel');
    expect(selectOS).toEqual('test');
  });
});
