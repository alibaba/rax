const fs = require('fs');
const express = require('express');

// const RaxServer = require('rax-server');

class DevServer {
  constructor() {
    this.setupApp();
  }

  setupApp() {
    const PORT = 8080;
    const app = express();
  
    const router = express.Router();
  
    // const server = new RaxServer({
    //   template: fs.readFileSync('./public/index.html', {
    //     encoding: 'utf8'
    //   }),
    //   pages: {
    //     'app': {
    //       bundle: require('./dist/server/app').default
    //     }
    //   }
    // });
  
    // router.get('/', (req, res) => {
    //   server.render('app', req, res);
    // });
    
    // tell the app to use the above rules
    app.use(router);
    
    app.use(express.static('dist/client'));
    
    app.listen(PORT, () => {
      console.log(`SSR running on port ${PORT}`);
    });
  }
}

module.exports = DevServer;
