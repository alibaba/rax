const path = require('path');
const { getBabelConfig, setBabelAlias } = require('rax-compile-config');
const nodeExternals = require('webpack-node-externals');

module.exports = (config, context) => {
  const { rootDir, userConfig } = context;
  const { distDir } = userConfig;

  config.target('web');
  const babelConfig = getBabelConfig({
    styleSheet: !!userConfig.inlineStyle,
    custom: {
      ignore: ['**/**/*.d.ts']
    }
  });

  config.mode('production');
  config.context(rootDir);

  setBabelAlias(config);

  config.entryPoints.clear();

  config.resolve.extensions
    .merge(['.js', '.json', '.jsx', '.html', '.ts', '.tsx']);

  config.entry('index')
    .add('./src/index');

  config.output
    .path(path.resolve(rootDir, distDir))
    .publicPath('/');

  config.externals(nodeExternals());

  config.module.rule('jsx')
    .test(/\.(js|mjs|jsx)$/)
    .exclude
      .add(/(node_modules|bower_components)/)
      .end()
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(babelConfig);

  config.module.rule('css')
    .test(/\.css?$/)
    .use('css')
      .loader(require.resolve('stylesheet-loader'));

  config.module.rule('assets')
    .test(/\.(svg|png|webp|jpe?g|gif)$/i)
    .use('source')
      .loader(require.resolve('image-source-loader'));
};
