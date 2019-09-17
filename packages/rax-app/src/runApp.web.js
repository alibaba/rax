import { render, createElement, useState } from 'rax';
import { useRouter } from 'rax-use-router';
import { createHashHistory, createBrowserHistory } from 'history';
import UniversalDriver from 'driver-universal';
import { emit } from './app';

let currentPagePath;

let launched = false;
let pageInitialProps = {};
const initialData = window.__INITIAL_DATA__ || {};

function Entry(props) {
  const { history } = props;
  const { component } = useRouter(() => props);

  // For async getInitialProps method update Entry component.
  const [tempPath, setTempPath] = useState('');

  if (!component || Array.isArray(component) && component.length === 0) {
    // Return null directly if not matched.
    return null;
  } else {
    // TODO new SSR app.js
    if (component.getInitialProps && currentPagePath !== history.location.pathname) {
      pageInitialProps = {};
      currentPagePath = history.location.pathname;
      component.getInitialProps().then((props) => {
        pageInitialProps = props;
        setTempPath(currentPagePath);
      }).catch(() => {
        pageInitialProps = {};
        setTempPath(currentPagePath);
      });
      return null;
    }
    return createElement(component, { ...props, ...pageInitialProps });
  }
}

export default function runApp(appConfig) {
  const { routes, shell, hydrate = false } = appConfig;
  const withSSR = !!window.__INITIAL_DATA__;

  let history;
  if (withSSR) {
    history = createBrowserHistory();
  } else {
    history = createHashHistory();
  }

  let entry = createElement(Entry, { history, routes });

  if (shell) {
    entry = createElement(shell.component, { data: initialData.shellData }, entry);
  }

  if (!launched) {
    launched = true;
    emit('launch');
  }

  render(
    entry,
    document.getElementById('root'),
    { driver: UniversalDriver, hydrate }
  );
}
