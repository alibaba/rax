import 'atag';
import { render as raxRender, createElement } from 'rax';
import BrowserDriver from 'driver-browser';
import createHashHistory from 'history/createHashHistory';
import UniversalRouter from 'universal-router';

import Container from './components/Container';
import ErrorPage from './components/ErrorPage';

BrowserDriver.setTagPrefix('a-');

function getPathnameByLocation(location) {
  return new Promise((resolve, reject) => {
    let { pathname = '' } = location;
    pathname = pathname.replace(/^\//, '');
    if (pathname) {
      resolve(pathname);
    } else {
      reject();
    }
  });
}

export default {
  /**
   * Render App from manifest source.
   *
   * @param {object} manifest project manifest data
   * @param {object} pagesMap map of pages
   * @param {string} pagesMap.key page name
   * @param {function} pagesMap.value page component
   * @example
   *  render({name: "demo"}, { home: HomeComponent })
   *
   */
  render(manifest, pagesMap) {
    function miniappRender(Component, props = {}) {
      raxRender(
        <Container manifest={manifest}>
          <Component {...props} />
        </Container>,
        null,
        { driver: BrowserDriver },
      );
    }

    const routers = [];
    Object.entries(pagesMap).forEach(([pageName, pageComponent]) => {
      routers.push({
        path: pageName,
        action: () => pageComponent,
      });
    });
    const router = new UniversalRouter(routers);

    function routerRender(pathname) {
      router
        .resolve({ pathname: pathname })
        .then((Component) => {
          miniappRender(Component);
        })
        .catch((error) => {
          console.error(`Not found PageComponent on location pathname: "${pathname}"`);
          miniappRender(ErrorPage, { history });
        });
    }

    const history = createHashHistory({ hashType: 'hashbang' });
    history.listen((location, action) => {
      getPathnameByLocation(location)
        .then(routerRender)
        .catch(() => {
          console.warn(`history action: ${action}, but can not found pathname in location`);
        });
    });

    // @hack Simulation of the navigator
    // eslint-disable-next-line camelcase
    window.__renderer_to_worker__ = function __renderer_to_worker__(navigate) {
      const { navigateTo } = navigate;
      history.push(navigateTo);
    };

    getPathnameByLocation(history.location)
      .then(routerRender)
      .catch(() => {
        history.push(manifest.homepage);
      });
  },
};
