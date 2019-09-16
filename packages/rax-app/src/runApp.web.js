import { render, createElement } from 'rax';
import { useRouter } from 'rax-use-router';
import { createHashHistory, createBrowserHistory } from 'history';
import { getCurrentComponent } from 'rax-pwa';
import UniversalDriver from 'driver-universal';
import { emit } from './app';

export default function runApp(config) {
  // TODO: AppShell should not passby config
  const { routes, withSSR, AppShell } = config;

  let currentHistory;
  if (withSSR) {
    currentHistory = createBrowserHistory();
  } else {
    currentHistory = createHashHistory();
  }

  const initialData = window.__INITIAL_DATA__ || {};

  let launched = false;

  function renderEntry() {
    if (!launched) {
      launched = true;
      emit('launch');
    }

    let { entry } = useRouter({
      history: currentHistory,
      routes,
    });

    if (AppShell !== null) {
      entry = createElement(AppShell, { data: initialData.shellData }, entry);
    }

    render(
      entry,
      document.getElementById('root'),
      { driver: UniversalDriver, hydrate: withSSR }
    );
  }

  if (withSSR) {
    // Avoid router empty initialComponent
    getCurrentComponent(routes, withSSR)().then( component => {
      if (component !== null) {
        routes.InitialComponent = component;
      }
      renderEntry();
    });
  } else {
    renderEntry();
  }
}
