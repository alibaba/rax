import { render, createElement, useState, useEffect } from 'rax';
import { isWeex, isWeb } from 'universal-env';
import { useRouter } from 'rax-use-router';
import { createMemoryHistory, createHashHistory, createBrowserHistory } from 'history';
import UniversalDriver from 'driver-universal';
import { emit } from './app';

const INITIAL_DATA = '__INITIAL_DATA__';

let history;
let launched = false;
const initialData = global[INITIAL_DATA];

function App(props) {
  const { history, routes } = props;
  const { component } = useRouter(() => ({ history, routes }));

  if (isNullableComponent(component)) {
    // Return null directly if not matched.
    return null;
  } else {
    // {
    //   [pagePath]: initialProps,
    // }
    const [initialProps, setInitialProps] = useState({});

    if (isWeb && component.getInitialProps && !initialProps[component.__path]) {
      useEffect(() => {
        const getInitialPropsPromise = component.getInitialProps();

        // Check getInitialProps returns promise.
        if (process.env.NODE_ENV !== 'production') {
          if (!getInitialPropsPromise.then) {
            throw new Error('getInitialProps should be async function or return a promise. See detail at "' + component.name + '".');
          }
        }

        getInitialPropsPromise.then((nextDefaultProps) => {
          if (nextDefaultProps) {
            const pageData = initialData && initialData.pagePath === component.__path ? initialData.pageData : {};
            // Do not cache getInitialPropsPromise result
            setInitialProps(Object.assign({}, { [component.__path]: Object.assign({}, pageData, nextDefaultProps) }));
          }
        }).catch((error) => {
          // In case of uncaught promise.
          throw error;
        });
      });

      // Early return null if initialProps were not get.
      return null;
    }

    return createElement(component, Object.assign({}, props, initialProps[component.__path]));
  }
}

function isNullableComponent(component) {
  return !component || Array.isArray(component) && component.length === 0;
}

export function getHistory() {
  return history;
}

export default function runApp(appConfig) {
  if (launched) throw new Error('Error: runApp can only be called once.');
  launched = true;

  const { routes, shell, hydrate = false } = appConfig;

  if (isWeex) {
    history = createMemoryHistory();
  } else if (initialData) {
    // If that contains `initialData`, which means SSR is enabled,
    // we should use brower history to make it works.
    history = createBrowserHistory();
  } else {
    history = createHashHistory();
  }

  let appInstance = createElement(App, { history, routes });

  if (shell) {
    const shellData = initialData ? initialData.shellData : null;
    appInstance = createElement(shell.component, { data: shellData }, appInstance);
  }

  // Emit app launch cycle.
  emit('launch');

  let rootEl = isWeex ? null : document.getElementById('root');
  if (isWeb && rootEl === null) throw new Error('Error: Can not find #root element, please check which exists in DOM.');

  return render(
    appInstance,
    rootEl,
    { driver: UniversalDriver, hydrate }
  );
}
