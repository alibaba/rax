'use strict';

const path = require('path');
const devMiddleware = require('webpack-dev-middleware');

let dev = null;
/**
 * @method koaDevware
 * @desc   Middleware for Koa to proxy webpack-dev-middleware
 **/
function koaDevware(compiler) {
  /**
   * @method waitMiddleware
   * @desc   Provides blocking for the Webpack processes to complete.
   **/
  function waitMiddleware(context) {
    return new Promise((resolve, reject) => {
      dev.waitUntilValid(() => {
        resolve(true);
      });

      function tapHook(comp) {
        comp.hooks.failed.tap('KoaWebpack', (error) => {
          reject(error);
        });
      }

      if (compiler.compilers) {
        for (const child of compiler.compilers) {
          tapHook(child);
        }
      } else {
        tapHook(compiler);
      }
    });
  }

  compiler.hooks.emit.tap('MiniappPlugin', (compilation) => {
    global.APPJSContent = compilation.assets['app.raw.js'].source();
  });

  return (context, next) => {
    return Promise.all([
      waitMiddleware(context),
      new Promise((resolve) => {
        dev(context.req, {
          end: (content) => {
            context.body = content; // eslint-disable-line no-param-reassign
            resolve();
          },
          setHeader: context.set.bind(context),
          locals: context.state
        }, () => resolve(next()));
      })
    ]);
  };
}


/**
 * The entry point for the Koa middleware.
 **/
module.exports = function createDevMiddleware(opts) {
  const defaults = { dev: {} };

  const options = Object.assign(defaults, opts);

  let { compiler } = options;

  if (!options.dev.publicPath) {
    const { publicPath } = compiler.options.output;

    if (!publicPath) {
      throw new Error('koa-webpack: publicPath must be set on `dev` options, or in a compiler\'s `output` configuration.');
    }

    options.dev.publicPath = publicPath;
  }

  dev = devMiddleware(compiler, options.dev);

  return Object.assign(koaDevware(compiler), {
    dev() {
      return dev;
    },
    close(callback) {
      dev.close(callback);
    },
    update(_compiler) {
      dev = devMiddleware(_compiler, options.dev);
    }
  });
};