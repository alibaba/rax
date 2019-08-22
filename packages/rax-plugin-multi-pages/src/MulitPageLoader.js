const path = require('path');
const fs = require('fs-extra');
const babel = require('@babel/core');
const { getOptions } = require('loader-utils');
const { getBabelConfig } = require('rax-compile-config');

const babelConfig = getBabelConfig();

module.exports = function(content) {
  const options = getOptions(this) || {};
  const renderModule = options.renderModule || 'rax';
  const withSSR = process.env.RAX_SSR === 'true';

  let appRender = '';
  let importStr = '';

  if (options.type === 'weex') {
    appRender = 'render(createElement(Entry), null, { driver: DriverUniversal });';
  } else if (options.type === 'web') {
    let appRenderMethod = '';
    if (fs.existsSync(path.join(this.rootContext, 'src/shell/index.jsx'))) {
      // app shell
      importStr += `import Shell from "${path.join(this.rootContext, 'src/shell/index')}";`;
      appRenderMethod = `
        // process Shell.getInitialProps
        // use global props comProps as shell default props
        const shellProps = {...comProps};
        if (withSSR && window.__INITIAL_DATA__.shellData !== null) {
          Object.assign(shellProps, window.__INITIAL_DATA__.shellData);
        } else if (Shell.getInitialProps) {
          Object.assign(shellProps, await Shell.getInitialProps());
        }
        render(createElement(Shell, shellProps, createElement(Entry)), document.getElementById("root"), { driver: DriverUniversal, hydrate: true });
      `;
    } else {
      // common web app
      appRenderMethod = 'render(createElement(Entry), document.getElementById("root"), { driver: DriverUniversal, hydrate: withSSR });';
    }

    appRender = `
      const renderApp = async function() {
        // process App.getInitialProps
        if (withSSR && window.__INITIAL_DATA__.pageData !== null) {
          Object.assign(comProps, window.__INITIAL_DATA__.pageData);
        } else if (Component.getInitialProps) {
          Object.assign(comProps, await Component.getInitialProps());
        }
        ${appRenderMethod}
      }

      renderApp();
    `;
  }

  const source = `
    import { render, createElement } from '${renderModule}';
    import Component from '${this.resourcePath}';
    import DriverUniversal from 'driver-universal';
    ${importStr}

    const withSSR = ${withSSR};

    const comProps = {};

    function Entry() {
      return createElement(Component, comProps);
    }

    ${appRender}
  `;

  const { code } = babel.transformSync(source, babelConfig);

  return code;
};
