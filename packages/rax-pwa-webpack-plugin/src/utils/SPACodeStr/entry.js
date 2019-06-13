module.exports = function getEntryCodeStr(options) {

  const { pathConfig, tempRouterFilePath, withAppShell } = options;

  let importTemplate = '';
  let renderTemplate = 'render(<pageComponent t="test" />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });';

  if (withAppShell) {
    importTemplate += `import Shell from '${pathConfig.appShell}';`;
    renderTemplate = 'render(<Shell Component={pageComponent} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });'
  }

  return `
    import * as DriverDOM from 'driver-dom';
    import { createElement, render } from 'rax';

    import Router from '${tempRouterFilePath}';
    ${importTemplate}
    
    const pageComponent = (props) => {
      return <div id="root-page" ><Router {...props} /></div>;
    };
    
    if (document.getElementById('root-page')) {
      document.getElementById('root-page').innerHTML = '';
    }
    
    ${renderTemplate}
  `;
}