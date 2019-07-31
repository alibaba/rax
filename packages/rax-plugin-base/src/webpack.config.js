const webpack = require('webpack');
const Chain = require('webpack-chain');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const path = require('path');

module.exports = () => {
  const config = new Chain();

  const appBuild = path.resolve(process.cwd(), 'build');

  // Webpack uses `publicPath` to determine where the app is being served from.
  // In development, we always serve from the root. This makes config easier.
  const publicPath = '/';
  // `publicUrl` is just like `publicPath`, but we will provide it to our app
  // as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
  // Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
  const publicUrl = publicPath.replace(/\/$/, '');

  config.mode(process.env.NODE_ENV);
  config.target('web');
  config.context(process.cwd());

  config.resolve.alias
    .set('babel-runtime-jsx-plus', require.resolve('babel-runtime-jsx-plus'))
    .set('@babel/runtime', path.dirname(require.resolve('@babel/runtime/package.json')));

  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.html', '.vue', '.sfc', '.ts', '.tsx']);

  config.output
    .path(appBuild)
    .filename('js/[name].js',)
    .publicPath(publicPath);

  config.plugin('define')
    .use(webpack.DefinePlugin, [{
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
    }]);

  config.plugin('caseSensitivePaths')
    .use(CaseSensitivePathsPlugin);

  return config;
};
