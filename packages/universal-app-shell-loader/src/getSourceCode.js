const getDepPath = require('./getDepPath');

module.exports = (options) => {
  let source = '';
  if (options.isMultiPageWebApp) {
    source = `
    import definedApp from '${options.definedAppPath}';
    import { render, createElement } from '${options.renderModule}';
    import Component from '${getDepPath(options.routes[options.routeIndex].component, this.rootContext)}';
    import DriverUniversal from 'driver-universal';
    ${options.importMods}
    
    const withSSR = !!window.__INITIAL_DATA__;

    ${/* Extendable app props. */''}
    const appProps = {
      Component,
    };
    
    function Entry() {
      const app = definedApp(appProps);
      return app;
    }
    
    ${options.appRender}
  `;
  } else {
    source = `
    import definedApp from '${options.definedAppPath}';
    import { render, createElement } from '${options.renderModule}';
    import { ${options.historyMemory} as createHistory } from 'history';
    import { _invokeAppCycle } from 'universal-app-runtime';
    import DriverUniversal from 'driver-universal';
    ${options.importMods}
    
    const interopRequire = (mod) => mod && mod.__esModule ? mod.default : mod;
    const withSSR = !!window.__INITIAL_DATA__;
    
    const getRouterConfig = () => {
      const routes = [];
      ${options.assembleRoutes}
      return {
        history: createHistory(),
        routes,
      };
    };

    ${/* Extendable app props. */''}
    const appProps = {
      routerConfig: getRouterConfig(),
    };
    
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
    
    ${options.appRender}
  `;
  }
  return source;
};

