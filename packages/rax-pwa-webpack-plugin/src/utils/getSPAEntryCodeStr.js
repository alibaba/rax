const getSPAEntryCodeStr = (options) => {
  /**
   * Generate index.js for SPA
   * Features to be implemented:
   * 1. Insert App Shell and SPA router into the template
   * 2. receive data injected by SSR
   */

  const { appConfig, pathConfig, pagesConfig, withSSR, withAppShell } = options;
  let importsCodeStr = '';
  let renderCodeStr = '';
  let pagesConfigCodeStr = '';

  // process router config
  Object.keys(pagesConfig).forEach((pageName) => {
    if (pageName === '_error') return;

    pagesConfigCodeStr += `
      ${pageName}: {
        path: '${pagesConfig[pageName].path}', 
        regexp: ${pagesConfig[pageName]._regexp},
        pageAlive: ${!!pagesConfig[pageName].pageAlive},
        component: () => import(/* webpackChunkName: "${pageName}" */ '${pathConfig.appSrc}/pages/${pageName}/index'),
        ${pagesConfig[pageName].skeleton ? `skeleton: "${pagesConfig[pageName].skeleton}",` : ''}
        ${pagesConfig[pageName].title || appConfig.title ? `title: "${pagesConfig[pageName].title || appConfig.title}",` : ''}
      },
    `;
  });

  if (pagesConfig._error) {
    pagesConfigCodeStr += `
      _error: {
        component: () => import(/* webpackChunkName: "_error" */ '${pathConfig.appSrc}/pages/_error/index')
      }
    `;
  }


  // process App Shell
  if (withAppShell) {
    importsCodeStr += `import Shell from '${pathConfig.appShell}';`;
    renderCodeStr += 'render(<Shell Component={PageComponent} {...initialProps} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });';
  } else {
    renderCodeStr += 'render(<PageComponent {...initialProps} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });';
  }

  return `
    import * as DriverDOM from 'driver-dom';
    import { createElement, render, useState } from 'rax';
    import { createRouter, getCurrentComponent } from 'rax-pwa';
    ${importsCodeStr}

    const pagesConfig = {
      ${pagesConfigCodeStr}
    };
    
    const app = () => {
      // Clear skeleton
      if (document.getElementById('root-page')) {
        document.getElementById('root-page').innerHTML = '';
      }
      
      let initialProps;
      try {
        initialProps = JSON.parse(document.querySelector("[data-from='server']").innerHTML);
      } catch (e) {
        initialProps = {};
      }

      // In Code Splitting mode, the <Router /> is not rendering the routing content for the first time, result in unsuccessful hydrate components. 
      // Match the first component for hydrate
      getCurrentComponent(pagesConfig, ${withSSR})().then((InitialComponent) => {
        if (InitialComponent === null) {
          document.getElementById('root').innerHTML = '';
        } else {
          InitialComponent = InitialComponent.__esModule ? InitialComponent.default : InitialComponent;
        }
        const Router = createRouter(pagesConfig, ${withSSR}, InitialComponent);
        const PageComponent = (props) => {
          ${withAppShell && !withSSR ? 'return <div id="root-page" ><Router {...props}/></div>;' : 'return <Router {...props}/>'}      
        };
        ${renderCodeStr}
      });
    };

    ${withSSR}? window.onload = app : app();
  `;
};

module.exports = getSPAEntryCodeStr;
