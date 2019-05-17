const fs = require('fs');
const path = require('path');
const express = require('express');
const RaxServer = require('rax-server');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const getEntries = require('./getPWAEntries');
const pathConfig = require('../config/path.config');

class DevServer {
  constructor(configs) {
    this.setupApp(configs);
  }

  setupApp(configs) {
    const PORT = 8080;
    const app = express();

    const compiler = webpack(configs);

    // eslint-disable-next-line new-cap
    const router = express.Router();

    const server = new RaxServer({
      template: fs.readFileSync(pathConfig.appHtml, {encoding: 'utf8'})
    });

    const entries = getEntries();

    Object.keys(entries).map(entry => {
      router.get(`/${entry}`, (req, res) => {
        server.render(entry, req, res, {
          Component: this.loadComponent(entry, res)
        });
      });
    });

    if (entries.index) {
      router.get('/', (req, res) => {
        server.render('index', req, res, {
          Component: this.loadComponent('index', res)
        });
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

    app.listen(PORT, () => {
      console.log(`SSR running on port ${PORT}`);
    });
  }

  loadComponent(page, res) {
    const fs = res.locals.fs;
    const bundelPath = path.join(pathConfig.appBuild, 'server', `${page}.js`);
    const bundleContent = fs.readFileSync(bundelPath, 'utf8');
    const mod = eval(bundleContent);
    return interopDefault(mod);
  }
}

function interopDefault(mod) {
  return mod.default || mod;
}

module.exports = DevServer;
