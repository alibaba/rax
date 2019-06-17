const getEntryCodeStr = (options) => {

  /**
   * Generate index. js for SPA
   * Features to be implemented:
   * 1. Insert App Shell and SPA router into the template
   * 2. receive data injected by SSR
   */

  const { pathConfig, tempRouterFilePath, withAppShell } = options;

  let importsCodeStr = '';
  let renderCodeStr = '';

  if (withAppShell) {
    importsCodeStr += `import Shell from '${pathConfig.appShell}';`;
    renderCodeStr += 'render(<Shell Component={PageComponent} {...initialProps} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });'
  } else {
    renderCodeStr += 'render(<PageComponent {...initialProps} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });'
  }

  return `
    import * as DriverDOM from 'driver-dom';
    import { createElement, render } from 'rax';

    import Router from '${tempRouterFilePath}';
    
    ${importsCodeStr}
    
    const PageComponent = (props) => {
      return <div id="root-page" ><Router {...props} /></div>;
    };
    
    if (document.getElementById('root-page')) {
      document.getElementById('root-page').innerHTML = '';
    }
    
    let initialProps;
    try {
      initialProps = JSON.parse(document.querySelector("[data-from='server']").innerHTML);
    } catch (e) {
      initialProps = {};
    }

    ${renderCodeStr}
  `;
}

module.exports = getEntryCodeStr;