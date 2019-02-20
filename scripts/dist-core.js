const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify').uglify;
const replace = require('rollup-plugin-replace');

function build(packageName, { name, shouldMinify = false, format = 'umd' }) {
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
        format,
        file: `./packages/${packageName}/dist/${packageName}.min.js`,
      });
    } else {
      const ext = format === 'esm' ? '.mjs' : '.js';
      bundle.write({
        ...output,
        format,
        file: `./packages/${packageName}/dist/${packageName}${ext}`,
      });
    }
  }).catch(error => {
    console.error(error);
  });
}

console.log('Build...');

build('rax', { name: 'Rax' });
build('rax', { name: 'Rax', format: 'esm' });
build('rax', { name: 'Rax', shouldMinify: true });

build('driver-dom', { name: 'DriverDOM' });
build('driver-dom', { name: 'DriverDOM', format: 'esm' });
build('driver-dom', { name: 'DriverDOM', shouldMinify: true });

build('driver-worker', { name: 'DriverWorker' });
build('driver-worker', { name: 'DriverWorker', format: 'esm' });
build('driver-worker', { name: 'DriverWorker', shouldMinify: true });

build('rax-miniapp-renderer', { format: 'cjs' });
build('rax-miniapp-renderer', { format: 'cjs', shouldMinify: true });
