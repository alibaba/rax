const getEntryCodeStr = (options) => {

  /**
   * Generate index. js for SPA
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
        component: () => import(/* webpackChunkName: "pages.${pageName}" */ '${pathConfig.appSrc}/pages/${pageName}/index'),
        ${pagesConfig[pageName].skeleton ? `skeleton: "${pagesConfig[pageName].skeleton}",` : ''}
        ${(pagesConfig[pageName].title || appConfig.title) ? `title: "${pagesConfig[pageName].title || appConfig.title}",` : ''}
      },
    `;
  });

  if (pagesConfig._error) {
    pagesConfigCodeStr += `
      _error: {
        component: () => import(/* webpackChunkName: "pages._error" */ '${pathConfig.appSrc}/pages/_error/index')
      }
    `;
  }



  // process App Shell
  if (withAppShell) {
    importsCodeStr += `import Shell from '${pathConfig.appShell}';`;
    renderCodeStr += 'render(<Shell Component={PageComponent} {...initialProps} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });'
  } else {
    renderCodeStr += 'render(<PageComponent {...initialProps} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });'
  }

  return `
    import * as DriverDOM from 'driver-dom';
    import { createElement, render, useState } from 'rax';
    import { createRouter } from 'rax-pwa';
    ${importsCodeStr}

    const pagesConfig = {
      ${pagesConfigCodeStr}
    };

    const Router = createRouter(pagesConfig, ${withSSR});
    const PageComponent = (props) => {
      return <div id="root-page" ><Router {...props}/></div>;
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