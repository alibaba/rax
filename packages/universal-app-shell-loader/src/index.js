const { join } = require('path');
const { getOptions } = require('loader-utils');
const { existsSync } = require('fs');

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
  const renderMoudle = options.renderModule || 'rax';

  if (this.data.appConfig !== null) {
    let { routes, historyType = 'hash' } = this.data.appConfig;
    if (!Array.isArray(routes)) {
      this.emitError(new Error('Unsupported field in app.json: routes.'));
      routes = [];
    }

    let appRender = '';
    let fixRootStyle = '';
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
      const mutiple = options.mutiple || 100;
      fixRootStyle = `
        const html = document.documentElement;
        html.style.fontSize = html.clientWidth / 750 * ${mutiple} + 'px';
      `;
      if (existsSync(join(this.rootContext, 'src/shell/index.jsx'))) {
        // app shell
        appRender += `import Shell from "${getDepPath('shell/index', this.rootContext)}";`;
        appRenderMethod = `
          // process Shell.getInitialProps
          const shellProps = {};
          if (withSSR && window.__initialData__.shellData !== null) {
            Object.assign(shellProps, window.__initialData__.shellData);
          } else if (Shell.getInitialProps) {
            Object.assign(shellProps, await Shell.getInitialProps());
          }
          render(createElement(Shell, shellProps, createElement(Entry)), document.getElementById("root"), { driver: DriverUniversal, hydrate: true });
        `;
      } else {
        // common web app
        appRenderMethod = 'render(createElement(Entry), document.getElementById("root"), { driver: DriverUniversal, hydrate: withSSR });';
      }

      appRender += `
        const renderApp = async function() {
          // process SSR History
          if (withSSR) {
            Object.assign(appProps, window.__initialData__.appData);
          }
          
          // process App.getInitialProps
          if (withSSR && window.__initialData__.appData !== null) {
            Object.assign(appProps, window.__initialData__.appData);
          } else if (definedApp.getInitialProps) {
            Object.assign(appProps, await definedApp.getInitialProps());
          }
          ${appRenderMethod}
        }
        renderApp();
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
        import(/* webpackChunkName: "${route.component.replace(/\//g, '_')}" */ '${getDepPath(route.component, this.rootContext)}')
        .then((mod) => () => interopRequire(mod))
      `;
      const importComponent = `() => () => interopRequire(require('${getDepPath(route.component, this.rootContext)}'))`;

      return `routes.push({
        index: ${index},
        path: '${route.path}',
        component: ${options.type === 'web' ? dynamicImportComponent : importComponent}
      });`;
    }).join('\n');

    const source = `
      import definedApp from '${this.resourcePath}';
      import { render, createElement } from '${renderMoudle}';
      import { ${historyMemory[historyType]} as createHistory } from 'history';
      import { _invokeAppCycle } from 'universal-app-runtime';
      import DriverUniversal from 'driver-universal';
      
      const interopRequire = (mod) => mod && mod.__esModule ? mod.default : mod;
      const withSSR = !!window.__initialData__;
      
      const getRouterConfig = () => {
        const routes = [];
        ${assembleRoutes}
        return {
          history: createHistory(),
          routes,
        };
      };

      ${/* Extendable app props. */''}
      const appProps = {
        routerConfig: getRouterConfig(),
      };
      
      ${fixRootStyle}
      
      let appLaunched = false;
      
      function Entry() {
        const app = definedApp(appProps);
        const startOptions = {};

        if (!appLaunched) {
          appLaunched = true;
          _invokeAppCycle('launch', startOptions);
        }

        return app;
      }
      
      ${appRender}
    `;
    return source;
  } else {
    return content;
  }
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

/**
 * ./pages/foo -> based on src, return original
 * /pages/foo -> based on rootContext
 * pages/foo -> based on src, add prefix: './'
 */
function getDepPath(path, rootContext = '') {
  if (path[0] === '.') {
    return path;
  } else if (path[0] === '/') {
    return join(rootContext, path);
  } else {
    return './' + path;
  }
}
