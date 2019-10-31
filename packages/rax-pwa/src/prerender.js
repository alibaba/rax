import { isWeb } from 'universal-env';
import { getRoutes, activatePageComponent } from './Navigation/index';

// rerender({path: '/page1'});
// rerender({href:'https://m.taobao.com'});
export default function preload(config) {
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
    } else {
      const linkElement = document.createElement('link');
      linkElement.rel = 'prerender';
      linkElement.href = config.href;
      document.head.appendChild(linkElement);
    }
  }
  // ignore
};