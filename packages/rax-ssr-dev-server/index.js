const fs = require('fs');
const express = require('express');
const RaxServer = require('rax-server');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

class DevServer {
  constructor(compiler, options) {
    this.options = options;
    this.setupApp(compiler);
  }

  setupApp(compiler) {
    const app = express();

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

    app.use(router);

    this.app = app;
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
}

function interopDefault(mod) {
  return mod.default || mod;
}

module.exports = DevServer;
