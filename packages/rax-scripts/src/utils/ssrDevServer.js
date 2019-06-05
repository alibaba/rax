const fs = require('fs');
const path = require('path');
const express = require('express');
const RaxServer = require('rax-server');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const getEntries = require('./getEntries');
const getAppConfig = require('./getAppConfig');
const evnConfig = require('../config/env.config');
const pathConfig = require('../config/path.config');

class DevServer {
  constructor(compiler) {
    this.setupApp(compiler);
  }

  setupApp(compiler) {
    const app = express();

    // eslint-disable-next-line new-cap
    const router = express.Router();

    const server = new RaxServer();

    const entries = getEntries();

    Object.keys(entries).map(entry => {
      // _document, _shell
      if (entry.indexOf('_') > -1) {
        return;
      }

      router.get(`/${entry}`, (req, res) => {
        const pageConfig = this.getPageConfig(res, entry, entries);
        server.render(req, res, pageConfig);
      });
    });

    if (entries.index) {
      router.get('/', (req, res) => {
        const pageConfig = this.getPageConfig(res, 'index', entries);
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

  close() {}

  listen(port, hostname, callback) {
    this.hostname = hostname;
    this.app.listen(port, callback);
  }

  getPageConfig(res, page, entries) {
    const appConfig = getAppConfig();
    const pageConfig = {
      page,
      component: this.loadComponent(page, res),
      scripts: {
        es5: [`${evnConfig.publicPath || './'}client/${page}.js`]
      },
      document: {
        title: appConfig.title
      }
    };

    if (entries._shell) {
      pageConfig.shell = {
        component: this.loadComponent('_shell', res)
      };
    }

    if (entries._document) {
      pageConfig.document.component = this.loadComponent('_document', res);
    }

    return pageConfig;
  }

  loadComponent(page, res) {
    const fs = res.locals.fs;
    const bundlePath = path.join(pathConfig.appBuild, 'server', `${page}.js`);
    const bundleContent = fs.readFileSync(bundlePath, 'utf8');
    const mod = eval(bundleContent);
    return interopDefault(mod);
  }
}

function interopDefault(mod) {
  return mod.default || mod;
}

module.exports = DevServer;
