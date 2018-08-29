const Router = require('koa-router');

const router = new Router();

const masterCtrl = require('./controllers/master');
const bundleCtrl = require('./controllers/bundle');

module.exports = function registerRouter(app) {
  router.get('/', masterCtrl);
  router.get('/app/index.html', masterCtrl);

  router.get('/app/bundle.zip', bundleCtrl);
  router.get('/build/bundle.zip', bundleCtrl);

  app.use(router.routes());
  app.use(router.allowedMethods());
};