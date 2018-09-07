import 'atag';
import { render as raxRender, createElement } from 'rax';
import BrowserDriver from 'driver-browser';
import createHashHistory from 'history/createHashHistory';
import UniversalRouter from 'universal-router';

import Container from './components/Container';
import ErrorPage from './components/ErrorPage';

BrowserDriver.setTagPrefix('a-');

function getPathnameByLocation(location) {
  let { pathname = '' } = location;
  pathname = pathname.replace(/^\//, '');
  return pathname;
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
          console.warn(`Not found PageComponent when location pathname is: "${pathname}"`);
          console.error(error);
          miniappRender(ErrorPage, { history });
        });
    }

    const history = createHashHistory({ hashType: 'hashbang' });
    history.listen((location, action) => {
      const pathname = getPathnameByLocation(location);
      if (pathname) {
        routerRender(pathname);
      } else {
        console.warn(`history action: ${action}, but can not found pathname in location`);
      }
    });

    // @hack Simulation of the navigator
    // eslint-disable-next-line camelcase
    window.__renderer_to_worker__ = function __renderer_to_worker__(navigate) {
      const { navigateTo } = navigate;
      history.push(navigateTo);
    };

    const initPathname = getPathnameByLocation(history.location);

    if (initPathname) {
      routerRender(initPathname);
    } else {
      // default render of the manifest homepage field.
      history.push(manifest.homepage);
    }
  },
};
