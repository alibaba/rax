module.exports = (options) => {
  const withSSR = process.env.RAX_SSR === 'true';

  return `
    import definedApp from '${options.definedAppPath}';
    import { render, createElement } from '${options.renderModule}';
    import { ${options.historyMemory} as createHistory } from 'history';
    import { _invokeAppCycle } from 'universal-app-runtime';
    import DriverUniversal from 'driver-universal';
    ${options.importMods}

    const interopRequire = (mod) => mod && mod.__esModule ? mod.default : mod;
    const withSSR = ${withSSR};
    const currentHistory = createHistory();

    const getRouterConfig = () => {
      const routes = [];
      ${options.assembleRoutes}
      return {
        history: currentHistory,
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
};

