const _ = require('../index');

const getRouterBaseCodeStr = (options) => {

  const { appConfig, pathConfig, pagesConfig, withSSR, withSPAPageSplitting } = options;

  let importsCodeStr = '';
  let routesCodeStr = '';

  const routerItemFnConfigs = { withSPAPageSplitting, appConfig, pathConfig, pagesConfig };

  // process router config
  Object.keys(pagesConfig).forEach((pageName) => {
    if (pageName === '_error') return;
    const routerItemCodeStrObj = getRouterItemCodeStrObj(pageName, _.firstUpperCase(pageName), routerItemFnConfigs);
    importsCodeStr += routerItemCodeStrObj.importsCodeStr;
    routesCodeStr += `
      {
        path: '${pagesConfig[pageName].path}', 
        component: ${routerItemCodeStrObj.componentCodeStr}
      },
    `;
  });

  // process special router
  const indexRouterItemCodeStrObj = getRouterItemCodeStrObj('index', 'Index', routerItemFnConfigs);
  routesCodeStr = `{path: '', component: ${indexRouterItemCodeStrObj.componentCodeStr}},` + routesCodeStr;
  if (pagesConfig._error) {
    const errorRouterItemCodeStrObj = getRouterItemCodeStrObj('_error', 'Error', routerItemFnConfigs);
    importsCodeStr += errorRouterItemCodeStrObj.importsCodeStr;
    routesCodeStr += `{component: ${errorRouterItemCodeStrObj.componentCodeStr}},`;
  } else {
    importTemplate += `import { Error } from '${pathConfig.appSrc}/_rax-pwa';`;
    routesCodeStr += `component: () => <Error />`;
  }

  return `
    import { createElement } from 'rax';
    import { createHashHistory, createBrowserHistory } from 'history';
    import { useRouter, updateChildrenProps } from '${pathConfig.appSrc}/_rax-use-router';
    
    ${importsCodeStr}
    
    const pageHistory = ${ withSSR ? 'createBrowserHistory();' : 'createHashHistory();'}
    const interopRequire = (obj) => {
      return obj && obj.__esModule ? obj.default : obj;
    };
    
    let routerProps = null;
    let routerConfig = null;
    const getRouterConfig = () => {
      return {
        history: pageHistory,
        routes: [${routesCodeStr}]
      };
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
          ${withSPAPageSplitting ? `import(\`${pathConfig.appSrc}/pages/\${config.page}/index\`)` : '// ignore'};
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
  `;
}

const getRouterItemCodeStrObj = (pageName, modeName, configs) => {
  const { withSPAPageSplitting, appConfig, pathConfig, pagesConfig } = configs;

  let commonCodeStr = '';
  if (pagesConfig[pageName].title || appConfig.title) {
    commonCodeStr = `document.title = '${pagesConfig[pageName].title || appConfig.title}';`
  } else {
    commonCodeStr = 'document.title = document.title;'
  }

  let importsCodeStr = '';
  let componentCodeStr = '';

  if (withSPAPageSplitting) {
    componentCodeStr = `
      () => import(/* webpackChunkName: "pages.${pageName}" */ '${pathConfig.appSrc}/pages/${pageName}/index')
      .then(interopRequire)
      .then((Page) => {
        ${commonCodeStr}
        return <Page {...routerProps} />;
      })
    `;
  } else {
    componentCodeStr = `() => {
        ${commonCodeStr}
        return <${modeName} />
      }`

    // add import
    const importSrt = `import ${modeName} from '${pathConfig.appSrc}/pages/${pageName}/index';`
    if (importsCodeStr.indexOf(importSrt) === -1) {
      importsCodeStr += importSrt;
    }
  }

  return { importsCodeStr, componentCodeStr };
}

module.exports = {
  getRouterBaseCodeStr,
  getRouterItemCodeStrObj
};