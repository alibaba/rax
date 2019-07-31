const { join } = require('path');
const { getOptions } = require('loader-utils');

const historyMemory = {
  hash: 'createHashHistory',
  memory: 'createMemoryHistory',
  browser: 'createBrowserHistory',
};

/**
 * Universal App Shell Loader for Rax.
 */
module.exports = function(content) {
  const options = getOptions(this) || {};
  const renderMoudle = options.renderModule || 'rax';

  if (this.data.appConfig !== null) {
    let { routes, historyType = 'hash' } = this.data.appConfig;
    if (!Array.isArray(routes)) {
      this.emitError(new Error('Unsupported field in app.json: routes.'));
      routes = [];
    }

    let fixRootStyle = '';
    /**
     * Weex only support memory history.
     */
    if (options.type === 'weex') historyType = 'memory';
    /**
     * Web only compatible with 750rpx.
     */
    if (options.type === 'web') {
      const mutiple = options.mutiple || 100;
      fixRootStyle = `
        const html = document.documentElement;
        html.style.fontSize = html.clientWidth / 750 * ${mutiple} + 'px';
      `;
    }

    /**
     * Example format of routes:
     * [
     *  {
     *    "path": "/page1",
     *    "component": "pages/page1"
     *  }
     * ]
     */
    const assembleRoutes = routes.map((route, index) => {
      return `routes.push({
        index: ${index},
        path: '${route.path}',
        component: interopRequire(require('${getDepPath(route.component, this.rootContext)}')),
      });`;
    }).join('\n');

    const source = `
      import definedApp from '${this.resourcePath}';
      import { render } from '${renderMoudle}';
      import { ${historyMemory[historyType]} as createHistory } from 'history';
      import DriverUniversal from 'driver-universal';
      
      const interopRequire = (mod) => mod && mod.__esModule ? mod.default : mod;

      const getRouterConfig = () => {
        const routes = [];
        ${assembleRoutes}
        return {
          history: createHistory(),
          routes,
        };
      };

      ${/* Extendable app props. */''}
      const appProps = {
        routerConfig: getRouterConfig(),
      };
      const app = definedApp(appProps);
      
      ${fixRootStyle}
      render(app, null, { driver: DriverUniversal });
    `;
    return source;
  } else {
    return content;
  }
};

/**
 * Get app.json content at picth loader.
 * @param remainingRequest
 * @param precedingRequest
 * @param data
 */
module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.appConfig = null; // Provide default value.

  try {
    const configPath = this.resourcePath.replace(/\.js$/, '.json');
    const rawContent = this.fs.readFileSync(configPath).toString();

    data.appConfig = JSON.parse(rawContent);
    this.addDependency(configPath);
  } catch (err) {
    throw new Error('Can not get app.json, please check.');
  }
};

/**
 * ./pages/foo -> based on src, return original
 * /pages/foo -> based on rootContext
 * pages/foo -> based on src, add prefix: './'
 */
function getDepPath(path, rootContext = '') {
  if (path[0] === '.') {
    return path;
  } else if (path[0] === '/') {
    return join(rootContext, path);
  } else {
    return './' + path;
  }
}
