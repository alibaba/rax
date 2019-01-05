const Router = require('koa-router');

const router = new Router();

const containerCtrl = require('./controllers/container');
const bundleCtrl = require('./controllers/bundle');

module.exports = function registerRouter(app) {
  router.get('/', containerCtrl);
  router.get('/app/index.html', containerCtrl);

  router.get('/app/bundle.zip', bundleCtrl);
  router.get('/build/bundle.zip', bundleCtrl);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
