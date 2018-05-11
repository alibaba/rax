var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var RaxWebpackPlugin = require('rax-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var qrcode = require('qrcode-terminal');
var internalIp = require('internal-ip');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var isProducation = process.env.NODE_ENV === 'production';

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
var appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

var nodePaths = (process.env.NODE_PATH || '')
  .split(process.platform === 'win32' ? ';' : ':')
  .filter(Boolean)
  .map(resolveApp);

var paths = {
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('templates/default/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('templates/default'),
  appNodeModules: resolveApp('node_modules'),
  nodePaths: nodePaths
};

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';
var entry = {};

if (isProducation) {
  entry['index.bundle.min'] = [paths.appIndexJs];
} else {
  entry['index.bundle'] = [paths.appIndexJs];
}

if (!isProducation) {
  var ip = internalIp.v4();
  var port = 8080;
  var webUrl = 'http://' + ip + ':' + port;
  var bundleUrl = 'http://' + ip + ':' + port + '/js/index.bundle.js';
  var weexBundleUrl = bundleUrl + '?_wx_tpl=' + bundleUrl;

  qrcode.generate(webUrl, {small: true});
  console.log('Web: scan above QRCode ' + webUrl + ' or direct open in browser.\n');

  qrcode.generate(weexBundleUrl, {small: true});
  console.log('Weex: scan above QRCode ' + weexBundleUrl + ' use weex playground.\n');
}

module.exports = {
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
  plugins: [
    new RaxWebpackPlugin({
      target: 'bundle',
      externalBuiltinModules: false,
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
    new webpack.DefinePlugin({
      'process.env': {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        'NODE_ENV': JSON.stringify(
          process.env.NODE_ENV || 'development'
        ),
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        'PUBLIC_URL': JSON.stringify(publicUrl)
      }
    }),
    isProducation ? new UglifyJsPlugin({
      include: /\.min\.js$/
    }) : new webpack.NoEmitOnErrorsPlugin(),
    // This is necessary to emit hot updates (currently CSS only):
    // new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'rax'],
        }
      },
      {
        test: /\.css$/,
        loader: 'stylesheet-loader'
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'base64-image-loader'
      }
    ]
  }
};
