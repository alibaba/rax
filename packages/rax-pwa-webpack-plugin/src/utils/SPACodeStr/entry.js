
const getEntryCodeStr = (options) => {
  const { pathConfig, tempRouterFilePath, withAppShell } = options;

  let importsCodeStr = '';
  let renderCodeStr = 'render(<pageComponent t="test" />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });';

  if (withAppShell) {
    importsCodeStr += `import Shell from '${pathConfig.appShell}';`;
    renderCodeStr = 'render(<Shell Component={pageComponent} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });'
  }

  return `
    import * as DriverDOM from 'driver-dom';
    import { createElement, render } from 'rax';

    import Router from '${tempRouterFilePath}';
    ${importsCodeStr}
    
    const pageComponent = (props) => {
      return <div id="root-page" ><Router {...props} /></div>;
    };
    
    if (document.getElementById('root-page')) {
      document.getElementById('root-page').innerHTML = '';
    }
    
    ${renderCodeStr}
  `;
}

module.exports = getEntryCodeStr;