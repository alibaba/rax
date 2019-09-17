import { render, createElement, useState, useEffect } from 'rax';
import { isWeex, isWeb } from 'universal-env';
import { useRouter } from 'rax-use-router';
import { createMemoryHistory, createHashHistory, createBrowserHistory } from 'history';
import UniversalDriver from 'driver-universal';
import { emit } from './app';

const INITIAL_DATA = '__INITIAL_DATA__';

let prevPagePath;
let history;
let launched = false;
const initialData = global[INITIAL_DATA];

export function getHistory() {
  return history;
}


function Entry(props) {
  const { history, routes } = props;
  const { component } = useRouter(() => ({ history, routes }));

  if (!component || Array.isArray(component) && component.length === 0) {
    // Return null directly if not matched.
    return null;
  } else {
    const [initialProps, setInitialProps] = useState(null);

    if (isWeb && component.getInitialProps && prevPagePath !== history.location.pathname) {
      prevPagePath = history.location.pathname;
      useEffect(() => {
        component.getInitialProps().then((props) => {
          const isPageActive = prevPagePath === history.location.pathname;
          if (isPageActive && props) setInitialProps(props);
        }).catch((error) => {
          throw error;
        });
      });
    }

    return createElement(component, Object.assign({}, props, initialProps));
  }
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

  let entry = createElement(Entry, { history, routes });

  if (shell) {
    const shellData = initialData ? initialData.shellData : null;
    entry = createElement(shell.component, { data: shellData }, entry);
  }

  // Emit app launch cycle.
  emit('launch');

  let rootEl = isWeex ? null : document.getElementById('root');
  if (isWeb && rootEl === null) throw new Error('Error: Can not find #root element, please check which exists in DOM.');

  return render(
    entry,
    rootEl,
    { driver: UniversalDriver, hydrate }
  );
}
