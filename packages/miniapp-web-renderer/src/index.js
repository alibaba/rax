import 'atag';
import { render as raxRender, createElement } from 'rax';
import BrowserDriver from 'driver-browser';
import createHashHistory from 'history/createHashHistory';
import UniversalRouter from 'universal-router';

import { resolve } from './path';
import Container from './components/Container';
import ErrorPage from './components/ErrorPage';
import PagesManager from './PagesManager';

BrowserDriver.setTagNamePrefix(function(type) {
  return type === 'style' ? '' : 'a-';
});

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
   */
  render(manifest, pagesMap) {
    const manifestPages = manifest.pages;
    const pageManager = new PagesManager(manifestPages);
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
        path: '/' + pageName,
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
        .catch(() => {
          console.error(`Page "${pathname}" not found.`);
          miniappRender(ErrorPage, { history });
        });
    }

    const history = createHashHistory({ hashType: 'hashbang' });
    history.listen(({ pathname }) => {
      routerRender(pathname);
    });

    // @hack Simulation of the navigator
    // eslint-disable-next-line camelcase
    window.__renderer_to_worker__ = function __renderer_to_worker__({ navigateTo }) {
      const currentPathname = history.location.pathname;
      const currentPageFilepath = pageManager.getPageFilepathByPathname(currentPathname);
      const nextPageFilepath = resolve(currentPageFilepath, navigateTo);
      const pageName = pageManager.getPageNameFromFilepath(nextPageFilepath);

      history.push('/' + pageName);
    };

    const pathnameInitValue = history.location.pathname;

    if (pathnameInitValue && pathnameInitValue !== '/') {
      routerRender(pathnameInitValue);
    } else {
      // default render of the manifest homepage field.
      history.push('/' + manifest.homepage);
    }
  },
};
