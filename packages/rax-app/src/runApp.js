import { render, createElement, useState, useEffect } from 'rax';
import { Wrapper } from 'rax-pwa';
import { isWeex, isWeb } from 'universal-env';
import { useRouter } from 'rax-use-router';
import { createMemoryHistory, createHashHistory, createBrowserHistory } from 'history';
import UniversalDriver from 'driver-universal';
import { emit } from './app';

const INITIAL_DATA_FROM_SSR = '__INITIAL_DATA__';
const SHELL_DATA = 'shellData';

let history;
let appConfig;
let launched = false;
const initialDataFromSSR = global[INITIAL_DATA_FROM_SSR];

export function getHistory() {
  return history;
}

function App(props) {
  const { history, routes, InitialComponent } = props;
  const { component } = useRouter(() => ({ history, routes, InitialComponent }));

  if (isNullableComponent(component)) {
    // Return null directly if not matched.
    return null;
  } else {
    const [pageInitialProps, setPageInitialProps] = useState(
      // If SSR is enabled, set pageInitialProps: {pagePath: pageData}
      initialDataFromSSR ? { [initialDataFromSSR.pagePath || '']: initialDataFromSSR.pageData || {} } : {}
    );

    // If SSR is enabled, process getInitialProps method
    if (isWeb && initialDataFromSSR && component.getInitialProps && !pageInitialProps[component.__path]) {
      useEffect(() => {
        const getInitialPropsPromise = component.getInitialProps();

        // Check getInitialProps returns promise.
        if (process.env.NODE_ENV !== 'production') {
          if (!getInitialPropsPromise.then) {
            throw new Error('getInitialProps should be async function or return a promise. See detail at "' + Component.name + '".');
          }
        }

        getInitialPropsPromise.then((nextDefaultProps) => {
          if (nextDefaultProps) {
            // Process pageData from SSR
            const pageData = initialDataFromSSR && initialDataFromSSR.pagePath === component.__path ? initialDataFromSSR.pageData : {};
            // Do not cache getInitialPropsPromise result
            setPageInitialProps(Object.assign({}, { [component.__path]: Object.assign({}, pageData, nextDefaultProps) }));
          }
        }).catch((error) => {
          // In case of uncaught promise.
          throw error;
        });
      });
      // Early return null if initialProps were not get.
      return null;
    }

    if (isWeb) {
      return createElement(
        Wrapper,
        Object.assign(
          {
            _appConfig: appConfig,
            _component: component,
          },
          props,
          pageInitialProps[component.__path]
        )
      );
    }

    return createElement(component, Object.assign({}, props, pageInitialProps[component.__path]));
  }
}

function isNullableComponent(component) {
  return !component || Array.isArray(component) && component.length === 0;
}

export default function runApp(config) {
  if (launched) throw new Error('Error: runApp can only be called once.');
  launched = true;
  appConfig = config;
  const { hydrate = false, routes, shell } = appConfig;

  if (isWeex) {
    history = createMemoryHistory();
  } else if (initialDataFromSSR) {
    // If that contains `initialDataFromSSR`, which means SSR is enabled,
    // we should use brower history to make it works.
    history = createBrowserHistory();
  } else {
    history = createHashHistory();
  }

  let _initialComponent;
  return matchInitialComponent(history.location.pathname, routes)
    .then((initialComponent) => {
      _initialComponent = initialComponent;
      let appInstance = createElement(App, {
        preload: () => {
          // Only works in Web project for now.
        },
        prerender: () => {
          // Only works in Web project for now.
        },
        history,
        routes,
        InitialComponent: _initialComponent
      });

      if (shell) {
        const shellData = initialDataFromSSR ? initialDataFromSSR[SHELL_DATA] : null;
        appInstance = createElement(shell.component, { data: shellData }, appInstance);
      }

      // Emit app launch cycle.
      emit('launch');

      let rootEl = isWeex ? null : document.getElementById('root');
      if (isWeb && rootEl === null) throw new Error('Error: Can not find #root element, please check which exists in DOM.');

      // Async render.
      return render(
        appInstance,
        rootEl,
        { driver: UniversalDriver, hydrate }
      );
    })
    .catch((err) => {
      console.error(err);
    });
}

function matchInitialComponent(fullpath, routes) {
  let initialComponent = null;
  for (let i = 0, l = routes.length; i < l; i++) {
    if (fullpath === routes[i].path || routes[i].regexp && routes[i].regexp.test(fullpath)) {
      initialComponent = routes[i].component;
      if (typeof initialComponent === 'function') initialComponent = initialComponent();
      break;
    }
  }

  return Promise.resolve(initialComponent);
}
