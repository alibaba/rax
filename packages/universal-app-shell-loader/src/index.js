const t = require('@babel/types');
const parse = require('./parse');
const traverse = require('./traverse');
const getDefaultExportedPath = require('./getDefaultExportedPath');
const convertAstExpressionToVariable = require('./convertAstExpressionToVariable');

const historyMemory = {
  hash: 'createHashHistory',
  memory: 'createMemoryHistory',
  browser: 'createBrowserHistory',
};

/**
 * Universal App Shell Loader for Rax.
 */
module.exports = function(content) {
  if (this.data.appConfig !== null) {
    const { pages = [], historyType = 'hash' } = this.data.appConfig;
    const requestPages = pages
      .map((path, index) => `import Page${index} from './${path}';`)
      .join('\n');
    const assembleRoutes = pages.map((path, index) => {
      let extra = '';
      if (index === 0) {
        extra = `routes.push({ 
          path: '/', 
          component: () => createElement(Redirect, { to: '/${path}' }),
        });`;
      }
      return extra + `routes.push({
        path: '/${path}',
        component: () => createElement(Page${index}, { app: appInstance }),
      });`;
    }).join('\n');
    const source = `
      import App from '${this.resourcePath}';
      import { render, createElement, useLayoutEffect } from 'rax';
      import { useRouter, replace } from 'rax-use-router';
      import { ${historyMemory[historyType]} as createHistory } from 'history';
      import DriverUniversal from 'driver-universal';
      ${requestPages}
      
      const appInstance = new App();
      const getRouteConfig = () => {
        const routes = [];
        ${assembleRoutes}
        return {
          history: createHistory(),
          routes,
        };
      };
      
      function Redirect(props) {
        useLayoutEffect(() => {
          replace(props.to);
        }, []);
      }
      
      function Entry() {
        const { component } = useRouter(getRouteConfig);
        return component;
      }

      render(createElement(Entry), null, { driver: DriverUniversal });
    `;
    return source;
  } else {
    return content;
  }
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.appConfig = null; // Provide default value.

  const rawContent = this.fs.readFileSync(this.resource).toString();
  const ast = parse(rawContent);
  const defaultExportedPath = getDefaultExportedPath(ast);
  if (defaultExportedPath) {
    traverse(defaultExportedPath, {
      ClassProperty(path) {
        const { node } = path;
        if (node.static && t.isIdentifier(node.key, { name: 'config' })) {
          data.appConfig = convertAstExpressionToVariable(node.value);
        }
      }
    });
  }
};

