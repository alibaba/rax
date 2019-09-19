import { render, createElement } from 'rax';
import { isWeex, isWeb } from 'universal-env';
import { useRouter } from 'rax-use-router/src';
import { createMemoryHistory, createHashHistory, createBrowserHistory } from 'history';
import UniversalDriver from 'driver-universal';
import { emit } from './app';

const INITIAL_DATA_FROM_SSR = '__INITIAL_DATA__';
const SHELL_DATA = 'shellData';

let history;
let launched = false;
const initialDataFromSSR = global[INITIAL_DATA_FROM_SSR];

export function getHistory() {
  return history;
}

function App(props) {
  const { history, routes, InitialComponent, initialProps } = props;
  const { component } = useRouter(() => ({ history, routes, InitialComponent }));

  if (isNullableComponent(component)) {
    // Return null directly if not matched.
    return null;
  } else {
    return createElement(component, Object.assign({}, props, initialProps));
  }
}

function isNullableComponent(component) {
  return !component || Array.isArray(component) && component.length === 0;
}

export default function runApp(appConfig) {
  if (launched) throw new Error('Error: runApp can only be called once.');
  launched = true;

  const { routes, shell, hydrate = false } = appConfig;

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
    .then((InitialComponent) => {
      _initialComponent = InitialComponent;

      let getInitialProps;
      if (isWeb && (getInitialProps = InitialComponent().getInitialProps)) {
        const getInitialPropsPromise = getInitialProps();

        // Check getInitialProps returns promise.
        if (process.env.NODE_ENV !== 'production') {
          if (!getInitialPropsPromise.then) {
            throw new Error('getInitialProps should be async function or return a promise. See detail at "' + component.name + '".');
          }
        }

        return getInitialPropsPromise;
      }
    })
    .then((initialProps) => {
      let appInstance = createElement(App, {
        history,
        routes,
        InitialComponent: _initialComponent,
        initialProps
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
  let InitialComponent = null;
  for (let i = 0, l = routes.length; i < l; i ++) {
    if (fullpath === routes[i].path || routes[i].regexp && routes[i].regexp.test(fullpath)) {
      InitialComponent = routes[i].component;
      if (typeof InitialComponent === 'function') InitialComponent = InitialComponent();
      break;
    }
  }

  return Promise.resolve(InitialComponent);
}
