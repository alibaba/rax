import { isWeb } from 'universal-env';
import { getRoutes } from './Navigation/index';

// preload({path: '/page1'});
// preload({href: '//xxx.com/font.woff', as: 'font', crossorigin: true});
export default function preload(config) {
  if (isWeb) {
    if (config.path) {
      const routes = getRoutes() || [];
      const targetRoute = routes.find(route => route.path === config.path);
      targetRoute && targetRoute.component();
    } else {
      const linkElement = document.createElement('link');
      linkElement.rel = 'preload';
      linkElement.as = config.as;
      linkElement.href = config.href;
      config.crossorigin && (linkElement.crossorigin = true);
      document.head.appendChild(linkElement);
    }
  }
  // ignore
};
