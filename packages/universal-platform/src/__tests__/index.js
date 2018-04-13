
jest.autoMockOff();

global.WXEnvironment = {
  platform: 'iOS'
};

describe('OS', () => {
  it('should use WXEnvironment platform', () => {
    const Platform = require('../index');
    const selectOS = Platform.select({
      iOS: 'test',
      Android: 'testAndroid',
      Web: 'testWeb'
    });

    expect(Platform.OS).toEqual('iOS');
    expect(selectOS).toEqual('test');
  });
});
