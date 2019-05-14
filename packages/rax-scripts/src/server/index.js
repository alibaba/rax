const fs = require('fs');
const path = require('path');
const express = require('express');
const RaxServer = require('rax-server');
const getEntries = require('../utils/getEntries');
const pathConfig = require('../config/path.config');
class DevServer {
  constructor() {
    this.setupApp();
  }

  setupApp() {
    const PORT = 8080;
    const app = express();

    const router = express.Router();

    const entries = Object.keys(getEntries());
    const pages = {};
    entries.map(entry => {
      pages[entry] = {
        bundle: require(path.join(pathConfig.appBuild, 'server', entry)).default
      };
    });

    const server = new RaxServer({
      template: fs.readFileSync(pathConfig.appHtml, {encoding: 'utf8'}),
      pages
    });

    entries.map(entry => {
      router.get(`/${entry}`, (req, res) => {
        server.render(entry, req, res);
      });
    });

    if (pages.index) {
      router.get('/', (req, res) => {
        server.render('index', req, res);
      });
    }

    app.use(router);

    app.use(express.static('build/client'));

    app.listen(PORT, () => {
      console.log(`SSR running on port ${PORT}`);
    });
  }
}

module.exports = DevServer;
