
jest.autoMockOff();

global.WXEnvironment = {
  platform: 'ios'
};

describe('OS', () => {
  it('should use WXEnvironment platform', () => {
    const Platform = require('../index');
    const selectOS = Platform.select({
      ios: 'test',
      android: 'testAndroid',
      web: 'testWeb'
    });

    expect(Platform.OS).toEqual('ios');
    expect(selectOS).toEqual('test');
  });
});
