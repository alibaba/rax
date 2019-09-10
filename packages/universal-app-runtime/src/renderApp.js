import { render, createElement } from 'rax';
import { createHashHistory, createMemoryHistory, createBrowserHistory } from 'history';
import { getCurrentComponent } from 'rax-pwa';
import { _invokeAppCycle } from './index';


let appLaunched = false;

export default function renderApp(App, options) {
  const { appConfig, driver, hydrate } = options;
  const { type, routes, withSSR, AppShell } = appConfig;

  // Process history
  let currentHistory = createHashHistory();
  if (type === 'weex') {
    currentHistory = createMemoryHistory();
  } else if (type === 'web' && withSSR) {
    currentHistory = createBrowserHistory();
  }

  // routerConfig
  const getRouterConfig = () => {
    return {
      history: currentHistory,
      routes,
    };
  };

  // Default App props
  const appProps = {
    routerConfig: getRouterConfig(),
  };

  function Entry() {
    const app = App(appProps);
    const startOptions = {};

    if (!appLaunched) {
      appLaunched = true;
      _invokeAppCycle('launch', startOptions);
    }

    return app;
  }

  // Process render app
  if (type === 'weex') {
    render(createElement(Entry), null, { driver, hydrate });
  }

  if (type === 'web') {
    const processRenderWebApp = function(shellProps) {
      if (AppShell !== null) {
        render(createElement(AppShell, shellProps, createElement(Entry)), document.getElementById('root'), { driver, hydrate });
      } else {
        render(createElement(Entry), document.getElementById('root'), { driver, hydrate });
      }
    };

    // process Shell.getInitialProps
    // use global props appProps as shell default props
    const shellProps = { ...appProps };
    if (withSSR && AppShell !== null && window.__INITIAL_DATA__.shellData !== null) {
      Object.assign(shellProps, window.__INITIAL_DATA__.shellData);
    }

    // process App.getInitialProps
    if (withSSR && window.__INITIAL_DATA__.appData !== null) {
      Object.assign(appProps, window.__INITIAL_DATA__.appData);
    }

    // Render
    if (hydrate) {
      // Avoid router empty initialComponent
      getCurrentComponent(appProps.routerConfig.routes, withSSR)().then(function(InitialComponent) {
        if (InitialComponent !== null) {
          appProps.routerConfig.InitialComponent = InitialComponent;
        }
        processRenderWebApp(shellProps);
      });
    } else {
      processRenderWebApp(shellProps);
    }
  }
};
