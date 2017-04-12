
jest.autoMockOff();

describe('OS', () => {
  global.WXEnvironment = undefined;

  it('should use default platform', () => {
    const Platform = require('../index');
    const selectOS = Platform.select({
      ios: 'test',
      android: 'testAndroid',
      web: 'testWeb'
    });

    expect(Platform.OS).toEqual('web');
    expect(selectOS).toEqual('testWeb');
  });

  global.WXEnvironment = {
    platform: 'ios'
  };

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
