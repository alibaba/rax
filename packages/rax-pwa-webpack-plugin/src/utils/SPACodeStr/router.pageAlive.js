const _ = require('../index');
const pathToRegexp = require('path-to-regexp');
const { interopRequireCodeStr } = require('./_common');
const { getRouterItemCodeStrObj } = require('./router.base');

const getRouterPageAliveCodeStr = (options) => {

  const { appConfig, pathConfig, pagesConfig, withSSR, withSPAPageSplitting } = options;

  let importsCodeStr = '';
  let routesCodeStr = '';
  let routesCacheCodeStr = '';

  const routerItemFnConfigs = { withSPAPageSplitting, appConfig, pathConfig, pagesConfig };

  // process router config
  Object.keys(pagesConfig).forEach((pageName) => {
    if (pageName === '_error') return;
    if (pagesConfig[pageName].pageAlive === true) {
      routesCodeStr += `
        {
          path: '${pagesConfig[pageName].path}', 
          component: () => <div/>
        },
      `;
      routesCacheCodeStr += `
        ${pageName}: {
          path: '${pagesConfig[pageName].path}',
          ${pagesConfig[pageName].title ? `title: '${pagesConfig[pageName].title}',` : ''}
          regexp: ${pagesConfig[pageName]._regexp},
          ${withSPAPageSplitting ? `_setChunkName: ()=> {import(/* webpackChunkName: 'pages.${pageName}' */ '${pathConfig.appSrc}/pages/${pageName}/index')},` : ''}
          component: null
        },
      `;
    } else {
      const routerItemCodeStrObj = getRouterItemCodeStrObj(pageName, _.firstUpperCase(pageName), routerItemFnConfigs);
      importsCodeStr += routerItemCodeStrObj.importsCodeStr;
      routesCodeStr += `
        {
          path: '${pagesConfig[pageName].path}', 
          component: ${routerItemCodeStrObj.componentCodeStr}
        },
      `;
    }
  });

  // process special router
  if (pagesConfig.index.pageAlive) {
    routesCodeStr = `
      {
        path: '', 
        component: () => <div/>
      },
    ` + routesCodeStr;
  } else {
    const indexRouterItemCodeStrObj = getRouterItemCodeStrObj('index', 'Index', routerItemFnConfigs);
    routesCodeStr = `{path: '', component: ${indexRouterItemCodeStrObj.componentCodeStr}},` + routesCodeStr;
  }

  if (pagesConfig._error) {
    const errorRouterItemCodeStrObj = getRouterItemCodeStrObj('_error', 'Error', routerItemFnConfigs);
    importsCodeStr += errorRouterItemCodeStrObj.importsCodeStr;
    routesCodeStr += `{component: ${errorRouterItemCodeStrObj.componentCodeStr}},`;
  } else {
    importsCodeStr += `import { Error } from 'rax-pwa';`;
    routesCodeStr += `{component: () => <Error />}`;
  }

  return `
    import { createElement,useState } from 'rax';
    import { createHashHistory, createBrowserHistory } from 'history';
    import { useRouter, updateChildrenProps } from '$rax-use-router';
    
    ${importsCodeStr}
    ${interopRequireCodeStr}
    
    const pageHistory = ${ withSSR ? 'createBrowserHistory();' : 'createHashHistory();'}
    
    let routerProps = null;
    let routerConfig = null;
    const getRouterConfig = () => {
      return {
        history: pageHistory,
        routes: [${routesCodeStr}]
      };
    };

    
    let updateTrigger = () => { };
    const pageCache = {${routesCacheCodeStr}};

    const updatePageCacheComponent = (pageName) => {
      if(!pageCache[pageName]) return false;
      ${withSPAPageSplitting ? `
        import(\`${pathConfig.appSrc}/pages/\${pageName}/index\`)
          .then(interopRequire)
          .then(Page => {
            pageCache[pageName].component = <Page {...routerProps} />;
            updateTrigger(pageHistory.location.pathname + pageName);
          });
      `: '// ignore'}
    };
    
    updateChildrenProps({
      preload: (config) => {
        if (config.page) {
          ${withSPAPageSplitting ? `import(\`${pathConfig.appSrc}/pages/\${config.page}/index\`)` : '// ignore'};
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
          updatePageCacheComponent(config.page);
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
      const [updateTemp, setUpdateTemp] = useState(null);
      updateTrigger = setUpdateTemp;

      let cachePageMatched = false;
      return (
        <div style={{ position: 'relative' }}>
          {Object.keys(pageCache).map((pageName) => {
            const {pathname, hash} = window.location;
            const isMatched = function (regexp, type) {
                return 'hash' === type ? regexp.test(hash.replace('#', '')) : 'history' === type && regexp.test(pathname);
            };
            cachePageMatched = isMatched(pageCache[pageName].regexp, "${withSSR ? 'history' : 'hash'}");
            const element = pageCache[pageName].component;
            if (cachePageMatched && element === null) {
              updatePageCacheComponent(pageName);
            }
            if (cachePageMatched && pageCache[pageName].title) {
              document.title = pageCache[pageName].title;
            }
            return <div style={{ display: cachePageMatched ? 'block' : 'none' }}>{element}</div>;
          })}
          {cachePageMatched ? null : component}
        </div>
      );
    };
  `;
}

module.exports = {
  getRouterPageAliveCodeStr
};