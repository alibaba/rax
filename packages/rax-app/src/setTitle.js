// In a single-page application, sometimes we need to set the title for the page.
// According to the title attribute set by window config in app.json
// The title in the route window config takes precedence over the global title.
// {
//   'routes': [
//     {
//       'path': '/',
//       'source': 'pages/Home/index',
//       'window': {
//         'title': 'hello'
//       }
//     }
//   ],
//   'window': {
//     'title': 'Rax App 1.0'
//   }
// }
import { isWeex, isWeb } from 'universal-env';

export default function setTitle(history, appConfig) {
  try {
    const { routes } = appConfig;
    const currentPath = history.location.pathname;

    let title = '';

    let currentRoute = {};

    for (let i = 0, l = routes.length; i < l; i++) {
      if (currentPath === routes[i].path) {
        currentRoute = routes[i];
        break;
      }
    }

    // Use page config first.
    if (currentRoute.window && currentRoute.window.title) {
      title = currentRoute.window.title;
    }

    // If there is no `window.title` in page config,  try global config.
    if (!title && appConfig.window.title) {
      title = appConfig.window.title;
    }

    if (title) {
      if (isWeb) {
        document.title = title;
      } else if (isWeex) {
        // It depends on the API provided by the client WEEX.
        // If `navigationBar` API is not available, the client must implement it.
        const navigationBar = weex.requireModule('navigationBar');
        const emptyFn = () => { };
        navigationBar.setTitle({ title }, emptyFn, emptyFn);
      }
    }
  } catch (e) {
    // ignore
  }
}