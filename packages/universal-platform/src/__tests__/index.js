
jest.autoMockOff();

global.WXEnvironment = {
  platform: 'iOS'
};

describe('OS', () => {
  it('should use WXEnvironment platform', () => {
    let Platform = require('../index');
    if (Platform && Platform.__esModule) {
      Platform = Platform.default;
    }

    const selectOS = Platform.select({
      iOS: 'test',
      Android: 'testAndroid',
      Web: 'testWeb'
    });

    expect(Platform.OS).toEqual('iOS');
    expect(selectOS).toEqual('test');
  });
});
