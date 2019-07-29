const fs = require('fs');
const express = require('express');
const RaxServer = require('rax-server');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const httpProxyMiddleware = require('http-proxy-middleware');

class DevServer {
  constructor(compiler, options) {
    this.options = options;
    this.setupApp(compiler);
  }

  setupApp(compiler) {
    const app = express();
    this.app = app;

    // eslint-disable-next-line new-cap
    const router = express.Router();

    const server = new RaxServer();

    const {
      pagesManifest,
    } = this.options;

    Object.keys(pagesManifest).forEach(page => {
      // _document, _shell
      if (page.indexOf('_') > -1) {
        return;
      }

      router.get(`/${page}`, (req, res) => {
        const pageConfig = this.getPageConfig(res, page);
        server.render(req, res, pageConfig);
      });
    });

    if (pagesManifest.index) {
      router.get('/', (req, res) => {
        const pageConfig = this.getPageConfig(res, 'index');
        server.render(req, res, pageConfig);
      });
    }

    app.use(
      devMiddleware(compiler, {
        serverSideRender: true,
        index: false
      })
    );

    app.use(
      hotMiddleware(compiler)
    );

    if (this.options.proxy) {
      this.setupProxyFeature();
    }

    app.use(router);
  }

  close() { }

  listen(port, hostname, callback) {
    this.hostname = hostname;
    this.app.listen(port, callback);
  }

  getPageConfig(res, page) {
    const {
      appConfig = {},
      pagesManifest,
      assetsManifest,
      assetsManifestPath
    } = this.options;

    let assets = assetsManifest || {};
    if (assetsManifestPath) {
      const assetsContent = fs.readFileSync(assetsManifestPath, res);
      assets = JSON.parse(assetsContent);
    };

    const pageConfig = {
      page,
      ...assets[page],
      component: this.loadComponent(page, res),
      document: {
        title: appConfig.title,
        component: pagesManifest._document ? this.loadComponent('_document', res) : null
      },
      shell: {
        component: pagesManifest._shell ? this.loadComponent('_shell', res) : null
      }
    };

    return pageConfig;
  }

  loadComponent(page, res) {
    const {
      pagesManifest
    } = this.options;

    const bundlePath = pagesManifest[page];
    const bundleContent = this.readFileSyncFromWebpack(bundlePath, res);
    const mod = eval(bundleContent);

    return interopDefault(mod);
  }

  readFileSyncFromWebpack(filePath, res) {
    const fs = res.locals.fs;
    return fs.readFileSync(filePath, 'utf8');
  }

  // https://github.com/webpack/webpack-dev-server/blob/master/lib/Server.js
  setupProxyFeature() {
    /**
     * Assume a proxy configuration specified as:
     * proxy: {
     *   'context': { options }
     * }
     * OR
     * proxy: {
     *   'context': 'target'
     * }
     */
    if (!Array.isArray(this.options.proxy)) {
      if (Object.prototype.hasOwnProperty.call(this.options.proxy, 'target')) {
        this.options.proxy = [this.options.proxy];
      } else {
        this.options.proxy = Object.keys(this.options.proxy).map((context) => {
          let proxyOptions;
          // For backwards compatibility reasons.
          const correctedContext = context
            .replace(/^\*$/, '**')
            .replace(/\/\*$/, '');

          if (typeof this.options.proxy[context] === 'string') {
            proxyOptions = {
              context: correctedContext,
              target: this.options.proxy[context],
            };
          } else {
            proxyOptions = Object.assign({}, this.options.proxy[context]);
            proxyOptions.context = correctedContext;
          }

          proxyOptions.logLevel = proxyOptions.logLevel || 'warn';

          return proxyOptions;
        });
      }
    }

    const getProxyMiddleware = (proxyConfig) => {
      const context = proxyConfig.context || proxyConfig.path;

      // It is possible to use the `bypass` method without a `target`.
      // However, the proxy middleware has no use in this case, and will fail to instantiate.
      if (proxyConfig.target) {
        return httpProxyMiddleware(context, proxyConfig);
      }
    };
    /**
     * Assume a proxy configuration specified as:
     * proxy: [
     *   {
     *     context: ...,
     *     ...options...
     *   },
     *   // or:
     *   function() {
     *     return {
     *       context: ...,
     *       ...options...
     *     };
     *   }
     * ]
     */
    this.options.proxy.forEach((proxyConfigOrCallback) => {
      let proxyConfig;
      let proxyMiddleware;

      if (typeof proxyConfigOrCallback === 'function') {
        proxyConfig = proxyConfigOrCallback();
      } else {
        proxyConfig = proxyConfigOrCallback;
      }

      proxyMiddleware = getProxyMiddleware(proxyConfig);

      if (proxyConfig.ws) {
        this.websocketProxies.push(proxyMiddleware);
      }

      this.app.use((req, res, next) => {
        if (typeof proxyConfigOrCallback === 'function') {
          const newProxyConfig = proxyConfigOrCallback();

          if (newProxyConfig !== proxyConfig) {
            proxyConfig = newProxyConfig;
            proxyMiddleware = getProxyMiddleware(proxyConfig);
          }
        }

        // - Check if we have a bypass function defined
        // - In case the bypass function is defined we'll retrieve the
        // bypassUrl from it otherwise byPassUrl would be null
        const isByPassFuncDefined = typeof proxyConfig.bypass === 'function';
        const bypassUrl = isByPassFuncDefined
          ? proxyConfig.bypass(req, res, proxyConfig)
          : null;

        if (typeof bypassUrl === 'boolean') {
          // skip the proxy
          req.url = null;
          next();
        } else if (typeof bypassUrl === 'string') {
          // byPass to that url
          req.url = bypassUrl;
          next();
        } else if (proxyMiddleware) {
          return proxyMiddleware(req, res, next);
        } else {
          next();
        }
      });
    });
  }
}

function interopDefault(mod) {
  return mod.default || mod;
}

module.exports = DevServer;
