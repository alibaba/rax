import { isWeb } from 'universal-env';
import { getRoutes } from './Navigation/index';

// preload({path: '/page1'});
// preload({href: '//xxx.com/font.woff', as: 'font', crossorigin: true});
export default function preload(config) {
  if (isWeb) {
    if (config.path) {
      const routes = getRoutes() || [];
      const targetRoute = routes.find(route => route.path === config.path);
      if (targetRoute && typeof targetRoute.component === 'function') {
        setTimeout(targetRoute.component, 0);
      }
    } else if (config.href) {
      // https://www.w3.org/TR/preload/
      const linkElement = document.createElement('link');
      linkElement.rel = 'preload';
      linkElement.as = config.as || '';
      linkElement.href = config.href;
      config.crossorigin && (linkElement.crossorigin = true);
      document.head.appendChild(linkElement);
    }
  } else {
    // It just only work in Web App for now
  }
};
