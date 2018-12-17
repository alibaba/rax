const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const address = require('address');
const colors = require('colors');
const webpack = require('webpack');
const createDevMiddleware = require('./middlewares/dev');
const registerWatcher = require('./service/registerWatcher');
const registerRouter = require('./router');
const getWebpackConfig = require('../config/getWebpackConfig');

const app = new Koa();

/**
 * Start MiniApp Dev Server
 */
module.exports = function startDevServer(opts) {
  const { projectDir, port, rendererInspect, rendererInspectHost, rendererInspectPort, rendererUrl } = opts;
  const webpackConfig = getWebpackConfig(projectDir, true);

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
    ctx.rendererInspect = rendererInspect;
    ctx.rendererInspectHost = rendererInspectHost;
    ctx.rendererInspectPort = rendererInspectPort;
    ctx.rendererUrl = rendererUrl;

    return next();
  });
  app.use(devMiddleware);
  registerWatcher(devMiddleware, projectDir);
  registerRouter(app);

  app.use(bodyParser());
  app.use(serve(projectDir));

  app.listen(port, err => {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    const ip = address.ip();
    console.log(colors.green(`DevServer Running At http://127.0.0.1:${port}/`));
    console.log(`Local bundle Scan QR of http://${ip}:${port}/app/bundle.zip?_wml_debug=true`);
  });
};
