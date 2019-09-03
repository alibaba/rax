const { join } = require('path');
const { getOptions } = require('loader-utils');
const { existsSync } = require('fs');
const pathToRegexp = require('path-to-regexp');
const getDepPath = require('./getDepPath');
const getSourceCode = require('./getSourceCode');
const babel = require('@babel/core');
const { getBabelConfig, getRouteName } = require('rax-compile-config');

const babelConfig = getBabelConfig();

const historyMemory = {
  hash: 'createHashHistory',
  memory: 'createMemoryHistory',
  browser: 'createBrowserHistory',
};

/**
 * Universal App Shell Loader for Rax.
 */
module.exports = function(content) {
  const options = getOptions(this) || {};
  const renderModule = options.renderModule || 'rax';
  const PWASnapshot = options.PWASnapshot;

  if (!this.data.appConfig) {
    return content;
  }

  let { routes, historyType = 'hash' } = this.data.appConfig;
  if (!Array.isArray(routes)) {
    this.emitError(new Error('Unsupported field in app.json: routes.'));
    routes = [];
  }

  let appRender = '';
  let importMods = '';

  /**
   * Weex only support memory history.
   */
  if (options.type === 'weex') {
    historyType = 'memory';
    appRender = 'render(createElement(Entry), null, { driver: DriverUniversal });';
  }
  /**
   * Web only compatible with 750rpx.
   */
  if (options.type === 'web') {
    let appRenderMethod = '';
    importMods += 'import { getCurrentComponent } from "rax-pwa";';

    if (existsSync(join(this.rootContext, 'src/shell/index.jsx'))) {
      // app shell
      appRender += `import Shell from "${getDepPath('shell/index', this.rootContext)}";`;
      appRenderMethod = `
        // process Shell.getInitialProps
        // use global props appProps as shell default props
        const shellProps = {...appProps};
        if (withSSR && window.__INITIAL_DATA__.shellData !== null) {
          Object.assign(shellProps, window.__INITIAL_DATA__.shellData);
        } else if (Shell.getInitialProps) {
          Object.assign(shellProps, await Shell.getInitialProps());
        }
        render(createElement(Shell, shellProps, createElement(Entry)), document.getElementById("root"), { driver: DriverUniversal, hydrate: true });
      `;
    } else {
      // common web app
      appRenderMethod = 'render(createElement(Entry), document.getElementById("root"), { driver: DriverUniversal, hydrate: withSSR || ${PWASnapshot} });';
    }

    appRender += `
      const renderApp = async function() {
        // process App.getInitialProps
        if (withSSR && window.__INITIAL_DATA__.appData !== null) {
          Object.assign(appProps, window.__INITIAL_DATA__.appData);
        } else if (definedApp.getInitialProps) {
          Object.assign(appProps, await definedApp.getInitialProps());
        }
        ${appRenderMethod}
      }
      
      if (withSSR ${PWASnapshot ? "|| localStorage.getItem('__INITIAL_HTML_' + currentHistory.location.pathname + '__')" : ''} ) {
        getCurrentComponent(appProps.routerConfig.routes, withSSR)().then(function(InitialComponent) {
          if (InitialComponent !== null) {
            appProps.routerConfig.InitialComponent = InitialComponent;
          }
          renderApp();
        });
      } else {
        renderApp();
      }
    `;
  }

  /**
   * Example format of routes:
   * [
   *  {
   *    "path": "/page1",
   *    "component": "pages/page1"
   *  }
   * ]
   */
  const assembleRoutes = routes.map((route, index) => {
    // First level function to support hooks will autorun function type state,
    // Second level function to support rax-use-router rule autorun function type component.
    const dynamicImportComponent =
      `() =>
      import(/* webpackChunkName: "${getRouteName(route, this.rootContext)}" */ '${getDepPath(route.component, this.rootContext)}')
      .then((mod) => () => interopRequire(mod))
    `;
    const importComponent = `() => () => interopRequire(require('${getDepPath(route.component, this.rootContext)}'))`;

    return `routes.push({
      index: ${index},
      regexp: ${pathToRegexp(route.path).toString()},
      path: '${route.path}',
      component: ${options.type === 'web' ? dynamicImportComponent : importComponent}
    });`;
  }).join('\n');

  const source = getSourceCode({
    appRender,
    assembleRoutes,
    importMods,
    routes,
    renderModule,
    definedAppPath: this.resourcePath,
    historyMemory: historyMemory[historyType],
    routeIndex: options.routeIndex
  });

  const { code } = babel.transformSync(source, babelConfig);

  return code;
};

/**
 * Get app.json content at picth loader.
 * @param remainingRequest
 * @param precedingRequest
 * @param data
 */
module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.appConfig = null; // Provide default value.

  try {
    const configPath = this.resourcePath.replace(/\.js$/, '.json');
    const rawContent = this.fs.readFileSync(configPath).toString();

    data.appConfig = JSON.parse(rawContent);
    this.addDependency(configPath);
  } catch (err) {
    throw new Error('Can not get app.json, please check.');
  }
};
