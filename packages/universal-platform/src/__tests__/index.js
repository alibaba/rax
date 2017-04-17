
jest.autoMockOff();

global.WXEnvironment = {
  platform: 'ios'
};

describe('OS', () => {
  it('should use WXEnvironment platform', () => {
    const Platform = require('../index');
    const selectOS = Platform.select({
      iOS: 'test',
      Android: 'testAndroid',
      Web: 'testWeb'
    });

    expect(Platform.OS).toEqual('ios');
    expect(selectOS).toEqual('test');
  });
});
