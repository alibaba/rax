import { isWeb } from 'universal-env';
import { getRoutes, activatePageComponent } from './Navigation/index';

// prerender({path: '/page1'});
// prerender({href:'https://m.taobao.com'});
export default function prerender(config) {
  if (isWeb) {
    if (config.path) {
      const routes = getRoutes() || [];
      const targetRoute = routes.find(route => route.path === config.path);
      if (targetRoute) {
        if (targetRoute.keepAlive) {
          activatePageComponent(targetRoute);
        } else {
          targetRoute.component();
        }
      }
    } else if (config.href) {
      // https://www.w3.org/TR/resource-hints/#prerender
      const linkElement = document.createElement('link');
      linkElement.rel = 'prerender';
      linkElement.href = config.href;
      document.head.appendChild(linkElement);
    }
  } else {
    // ignore
  }
};