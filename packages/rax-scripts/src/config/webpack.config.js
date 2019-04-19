const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const pathConfig = require('./path.config');
const path = require('path');

const tsLoader = require.resolve('ts-loader');
const getBabelRuntimePath = () => {
  const pkgJsonPath = require.resolve('@babel/runtime/package.json');
  return path.dirname(pkgJsonPath);
};

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const publicPath = process.env.PUBLIC_PATH || '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = publicPath.replace(/\/$/, '');

module.exports = {
  mode: process.env.NODE_ENV,
  // Compile target should "web" when use hot reload
  target: 'web',
  context: process.cwd(),
  entry: {},
  resolve: {
    alias: {
      '@babel/runtime': getBabelRuntimePath()
    },
    extensions: ['.js', '.json', '.jsx', '.html', '.vue', '.sfc', '.ts', '.tsx'],
  },
  output: {
    pathinfo: process.env.NODE_ENV === 'development',
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: pathConfig.appBuild,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'js/[name].js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: tsLoader,
      }
    ],
  },

  plugins: {
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }.
    define: new webpack.DefinePlugin({
      'process.env': {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: JSON.stringify(publicUrl),
      },
    }),
    // This is necessary to emit hot updates (currently CSS only):
    // new webpack.HotModuleReplacementPlugin(),
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    caseSensitivePaths: new CaseSensitivePathsPlugin()
  }
};
