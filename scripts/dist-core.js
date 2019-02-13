const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify').uglify;
const replace = require('rollup-plugin-replace');

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
      babel({
        exclude: 'node_modules/**', // only transpile our source code
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
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      shouldMinify ? uglify() : null,
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

build('driver-worker', 'DriverWorker');
build('driver-worker', 'DriverWorker', true);
build('driver-worker-renderer-webview', 'DriverWorkerRendererWebview');
build('driver-worker-renderer-webview', 'DriverWorkerRendererWebview', true);
