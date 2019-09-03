const webpack = require('webpack');
const Chain = require('webpack-chain');
const { getBabelConfig, setBabelAlias } = require('rax-compile-config');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const babelConfig = getBabelConfig({
  styleSheet: true,
  custom: {
    ignore: ['**/**/*.d.ts']
  }
});

module.exports = (context) => {
  const { rootDir, command } = context;

  const config = new Chain();

  setBabelAlias(config);

  config.target('web');
  config.context(rootDir);

  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.ts', '.tsx', '.html']);

  config.module.rule('jsx')
    .test(/\.(js|mjs|jsx)$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfig);

  config.module.rule('tsx')
    .test(/\.tsx?$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfig)
      .end()
    .use('ts')
      .loader(require.resolve('ts-loader'));

  config.module.rule('assets')
    .test(/\.(svg|png|webp|jpe?g|gif)$/i)
    .use('source')
      .loader(require.resolve('image-source-loader'));

  config.plugin('caseSensitivePaths')
    .use(CaseSensitivePathsPlugin);

  config.plugin('noError')
    .use(webpack.NoEmitOnErrorsPlugin);

  if (command === 'dev') {
    config.mode('development');
    config.devtool('inline-module-source-map');
  } else if (command === 'build') {
    config.mode('production');
    config.devtool('source-map');

    config.optimization
      .minimizer('uglify')
        .use(UglifyJSPlugin, [{
          cache: true,
          sourceMap: true,
        }])
        .end()
      .minimizer('optimizeCSS')
        .use(OptimizeCSSAssetsPlugin, [{
          canPrint: true,
        }]);
  }

  return config;
};
