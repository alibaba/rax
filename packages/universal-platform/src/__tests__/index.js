
jest.autoMockOff();

describe('OS', () => {

  Object.defineProperty(navigator, 'platform', {
    value: 'MacIntel'
  });

  it('should use navigator platform', () => {
    const Platform = require('../index');
    const selectOS = Platform.select({
      macintel: 'test'
    });

    expect(Platform.OS).toEqual('macintel');
    expect(selectOS).toEqual('test');
  });
});
