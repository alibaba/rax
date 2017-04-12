
jest.autoMockOff();

describe('OS', () => {
  it('should use default platform', () => {
    global.WXEnvironment = undefined;
    const Platform = require('../index');
    const selectOS = Platform.select({
      ios: 'test',
      android: 'testAndroid',
      web: 'testWeb'
    });

    expect(Platform.OS).toEqual('web');
    expect(selectOS).toEqual('testWeb');
  });

  it('should use WXEnvironment platform', () => {
    global.WXEnvironment = {
      platform: 'ios'
    };
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
