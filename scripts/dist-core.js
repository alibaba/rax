const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify').uglify;
const replace = require('rollup-plugin-replace');
const filesize = require('rollup-plugin-filesize');
const commonjs = require('rollup-plugin-commonjs');
const string = require('./rollup-plugin-string');

function build(packageName, name, shouldMinify) {
  const output = {
    name,
    exports: 'named',
    sourcemap: true
  };

  // For development
  rollup.rollup({
    input: './packages/' + packageName + '/src/index.js',
    plugins: [
      resolve(),
      string(),
      babel({
        exclude: [/node_modules/, /vendors/], // only transpile our source code
        presets: [
          ['@babel/preset-env', {
            modules: false,
            loose: true,
            targets: {
              browsers: ['last 2 versions', 'IE >= 9']
            }
          }]
        ],
      }),
      commonjs({
        include: [/node_modules/, /vendors/],
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      shouldMinify ? uglify() : null,
      filesize(),
    ]
  }).then(bundle => {
    if (shouldMinify) {
      bundle.write({
        ...output,
        format: 'umd',
        file: `./packages/${packageName}/dist/${packageName}.min.js`,
      });
    } else {
      bundle.write({
        ...output,
        format: 'umd',
        file: `./packages/${packageName}/dist/${packageName}.js`,
      });

      bundle.write({
        ...output,
        format: 'esm',
        file: `./packages/${packageName}/dist/${packageName}.mjs`,
      });
    }
  }).catch(error => {
    console.error(error);
  });
}

console.log('Build...');

build('rax', 'Rax');
build('rax', 'Rax', true);

build('driver-dom', 'DriverDOM');
build('driver-dom', 'DriverDOM', true);

build('miniapp-framework-windmill', 'MiniAppWindmill', true);
build('miniapp-framework-windmill-renderer', 'MiniAppWindmillRenderer', true);
