const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const address = require('address');
const colors = require('colors');
const webpack = require('webpack');
const createDevMiddleware = require('./middlewares/dev');
const registerWatcher = require('./service/registerWatcher');
const registerRouter = require('./router');
const {
  getWebpackConfig,
  getMiniappType,
  goldlog,
} = require('miniapp-compiler-shared');

const app = new Koa();

/**
 * Start MiniApp Dev Server
 */
module.exports = function startDevServer(projectDir, port, isDebug) {
  const webpackConfig = getWebpackConfig(projectDir, true);
  const miniappType = getMiniappType();
  const devMiddleware = createDevMiddleware({
    compiler: webpack(webpackConfig),
    dev: {
      stats: {
        colors: true,
        children: false,
        modules: false,
        chunks: false,
        entrypoints: false,
        assets: false,
      },
      publicPath: '/build',
    },
  });

  /**
   * inject instance env
   */
  app.use(function(ctx, next) {
    ctx.projectDir = projectDir;
    ctx.port = port;
    ctx.isDebug = isDebug;
    return next();
  });
  app.use(devMiddleware);
  registerWatcher(devMiddleware, projectDir);
  registerRouter(app);

  app.use(bodyParser());
  app.use(serve(projectDir));

  app.listen(port, (err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    const ip = address.ip();

    console.log(colors.green(`DevServer Running At http://127.0.0.1:${port}/`));
    isDebug &&
      console.log(
        `Debug Scan QR of http://${ip}:${port}/app/bundle.zip?_wml_debug=true`,
      );

    /**
     * log
     */
    goldlog('taobao-developers.build.start-dev-server', {
      miniapp_type: miniappType,
      ip,
      port,
    });
  });
};
