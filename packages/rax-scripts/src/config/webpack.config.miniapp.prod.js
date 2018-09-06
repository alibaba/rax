/* eslint-disable no-console */
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackMerge = require('webpack-merge');

const pathConfig = require('./path.config');
const webpackConfigBase = require('./webpack.config.miniapp.base');

const registerServiceWorker = `<script>
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered');
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
</script>`;

const webpackConfigProd = webpackMerge(webpackConfigBase, {
  entry: {
    'index.min': [pathConfig.appManifest],
  },
  plugins: [
    new CleanWebpackPlugin([pathConfig.appBuild]),
    new HtmlWebpackPlugin({
      inject: true,
      template: pathConfig.appHtml,
      registerServiceWorker: registerServiceWorker,
    }),

    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new SWPrecacheWebpackPlugin({
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          return;
        }
        if (message.indexOf('Skipping static resource') === 0) {
          return;
        }
        console.log(message);
      },
      minify: true,
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            unused: false,
            warnings: false,
          },
          output: {
            // eslint-disable-next-line camelcase
            ascii_only: true,
            comments: 'some',
            beautify: false,
          },
          mangle: true,
        },
      }),
    ],
  },
});

module.exports = webpackConfigProd;
