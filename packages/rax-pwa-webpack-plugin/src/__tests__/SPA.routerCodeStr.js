const { getRouterCodeStr } = require('../utils/SPACodeStr');

const appConfig = {
  spa: true
}

const pathConfig = {
  appDirectory: 'TestAppDirectory',
  appIndexJs: 'TestAppIndexJs',
  appSrc: 'TestAppSrc',
  appDocument: 'TestAppDocument',
  appShell: 'TestAppShell'
}

// https://stackoverflow.com/questions/51605469/jest-how-to-compare-two-strings-with-different-format
const filterCodeStr = (codeStr) => {
  return codeStr.replace(/\s/g, '');
}

describe('SPA router file code string test', () => {

  it('should have a router component', function () {
    const withSSR = false;
    const withSPAPageSplitting = true;

    const pagesConfig = {
      "index": {
        "path": '/index',
        "title": "Index",
      },
      "detail": {
        "path": '/detail',
      }
    }

    const expectResult = filterCodeStr(`
      import { createElement } from 'rax';
      import { createHashHistory, createBrowserHistory } from 'history';
      import { useRouter, updateChildrenProps } from 'rax-use-router';
      import { Error } from 'rax-pwa';
      
      const interopRequire = (obj) => { returnobj && obj.__esModule ? obj.default : obj; };
      const pageHistory = createHashHistory();
      
      let routerProps = null;
      let routerConfig = null;
     
      const getRouterConfig = () => {
        return {
          history: pageHistory,
          routes: [
            {
              path: '',
              component: () => import(/*webpackChunkName:"pages.index"*/ 'TestAppSrc/pages/index/index')
                .then(interopRequire)
                .then((Page) => {
                  document.title = 'Index';
                  return <Page{...routerProps} />;
                })
            }, {
              path: '/index',
              component: () => import(/*webpackChunkName:\"pages.index\"*/ 'TestAppSrc/pages/index/index')
                .then(interopRequire)
                .then((Page) => {
                  document.title = 'Index';
                  return <Page{...routerProps} />;
                })
            },
            {
              path: '/detail',
              component: () => import(/*webpackChunkName:\"pages.detail\"*/ 'TestAppSrc/pages/detail/index')
                .then(interopRequire)
                .then((Page) => {
                  document.title = document.title;
                  return <Page{...routerProps} />;
                })
            },
            {
              component: () => <Error />
            }
          ]
        };
      };

      updateChildrenProps({
        preload: (config) => {
          if (config.page) {
            import(\`TestAppSrc/pages/\${config.page}/index\`);
          } else {
            const linkElement = document.createElement('link');
            linkElement.rel = 'preload';
            linkElement.as = config.as;
            linkElement.href = config.href;
            config.crossorigin && (linkElement.crossorigin = true);
            document.head.appendChild(linkElement);
          }
        },
        prerender: (config) => {
          if (config.page) {
            import(\`TestAppSrc/pages/\${config.page}/index\`);
          } else {
            const linkElement = document.createElement('link');
            linkElement.rel = 'prerender';
            linkElement.href = config.href;
            document.head.appendChild(linkElement);
          }
        },
      });

      export default function Router(props) {
        if (!routerConfig) {
          routerProps = props;
          routerConfig = getRouterConfig();
        }
        const { component } = useRouter(routerConfig);
        return component;
      };
    `);

    expect(filterCodeStr(getRouterCodeStr({
      appConfig,
      pathConfig,
      pagesConfig,
      withSSR,
      withSPAPageSplitting
    }))).toBe(expectResult);

  })
})

