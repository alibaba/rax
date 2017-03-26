'use strict';
/* eslint no-console: 0 */
const address = require('address');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const colors = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const qrcode = require('qrcode-terminal');
const RaxWebpackPlugin = require('rax-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('watch-missing-node-modules-webpack-plugin');
const webpack = require('webpack');

const isProducation = process.env.NODE_ENV === 'production';

const paths = require('./paths');
const babelConfig = require('./babel.config');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = '';
const entry = {};

if (isProducation) {
  entry['index.bundle.min'] = [paths.appIndexJs];
} else {
  entry['index.bundle'] = [paths.appIndexJs];
}

if (!isProducation) {
  const ipv4 = address.ip();
  const port = 8080;
  const webUrl = 'http://' + ipv4 + ':' + port;
  const bundleUrl = 'http://' + ipv4 + ':' + port + '/js/index.bundle.js';
  const weexBundleUrl = bundleUrl + '?_wx_tpl=' + bundleUrl;

  qrcode.generate(webUrl, { small: true });
  console.log('Web: scan above QRCode ' + webUrl + ' or direct open in browser.\n');

  qrcode.generate(weexBundleUrl, { small: true });
  console.log('Weex: scan above QRCode ' + weexBundleUrl + ' use weex playground.\n');
}

module.exports = {
  context: process.cwd(),
  // Compile target should "web" when use hot reload
  target: isProducation ? 'node' : 'web',

  // devtool: 'inline-source-map',

  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // The first two entry points enable "hot" CSS and auto-refreshes for JS.
  entry: entry,

  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: !isProducation,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'js/[name].js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['.js', '.json', '.jsx', ''],
    alias: {
      react: 'rax'
    }
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle',
      externalBuiltinModules: false
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin({
      'process.env': {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: JSON.stringify(publicUrl)
      }
    }),
    isProducation
      ? new webpack.optimize.UglifyJsPlugin({
        include: /\.min\.js$/,
        minimize: true,
        compress: {
          warnings: false
        }
      })
      : new webpack.NoErrorsPlugin(),
    // This is necessary to emit hot updates (currently CSS only):
    // new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
    // show webpakc build progress
    new webpack.ProgressPlugin(function(percentage, msg) {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`webpack: ${msg}...`);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log('');
        console.log(colors.green('webpack: bundle build is now finished.'));
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel'] // 'babel-loader' is also a legal name to reference
      },
      {
        test: /\.css$/,
        loader: 'stylesheet'
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json'
      },
      // load inline images using image-source-loader for Image
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'image-source'
      }
    ]
  },
  babel: babelConfig
};
