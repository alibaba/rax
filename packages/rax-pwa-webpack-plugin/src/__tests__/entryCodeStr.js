const { getEntryCodeStr } = require('../utils/SPACodeStr/');

const appConfig = {
  spa: true
}

const pathConfig = {
  appDirectory: 'TestAppDirectory',
  appIndexJs: 'TestAppIndexJs',
  appSrc: 'TestAppSrc',
  appDocument: 'TestAppDocument',
  appShell: 'TestAppShell'
}

// https://stackoverflow.com/questions/51605469/jest-how-to-compare-two-strings-with-different-format
const filterCodeStr = (codeStr) => {
  return codeStr.replace(/\s/g, '');
}

describe('SPA entry file code string test', () => {

  it('should have a shell component with App Shell', function () {
    const withAppShell = true;
    const tempRouterFilePath = 'TestTempRouterFilePath'
    const expectResult = filterCodeStr(`
      import * as DriverDOM from 'driver-dom';
      import { createElement, render } from 'rax';

      import Router from 'TestTempRouterFilePath';
      import Shell from 'TestAppShell';
      
      const pageComponent = (props) => {
        return <div id="root-page" ><Router {...props} /></div>;
      };
      
      if (document.getElementById('root-page')) {
        document.getElementById('root-page').innerHTML = '';
      }
      
      render(<Shell Component={pageComponent} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });
    `);

    expect(filterCodeStr(getEntryCodeStr({ pathConfig, tempRouterFilePath, withAppShell }))).toBe(expectResult);
  })

})

