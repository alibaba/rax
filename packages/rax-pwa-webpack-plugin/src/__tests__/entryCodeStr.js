const { getEntryCodeStr } = require('../utils/SPACodeStr/');

const appConfig = {
  spa: true
}

const pathConfig = {
  appDirectory: 'TestAppDirectory',
  appIndexJs: 'TestAppIndexJs',
  appSrc: 'TestAppSrc',
  appDocument: 'TestAppDocument',
  appShell: 'TestAppShell',
}

describe('SPA entry file code string test', () => {

  it('should have a shell component with App Shell', function () {
    const withAppShell = true;
    expect(getEntryCodeStr({ appConfig, pathConfig, withAppShell })).toBe('foo');
  })

})

