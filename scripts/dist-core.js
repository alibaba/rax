const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify').uglify;
const replace = require('rollup-plugin-replace');
const gzipSize = require('gzip-size');

async function build({ package: packageName, entry = 'src/index.js', name, shouldMinify = false, format = 'umd' }) {
  const output = {
    name,
    exports: 'named',
    sourcemap: true
  };

  // For development
  const bundle = await rollup.rollup({
    input: `./packages/${packageName}/${entry}`,
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
      shouldMinify ? uglify({
        compress: {
          loops: false,
          keep_fargs: false,
          unsafe: true,
          pure_getters: true
        }
      }) : null,
    ]
  });

  if (shouldMinify) {
    const file = `./packages/${packageName}/dist/${packageName}.min.js`;
    await bundle.write({
      ...output,
      format,
      file,
    });

    const size = gzipSize.fileSync(file, {
      level: 6
    });

    console.log(file, `${(size / 1024).toPrecision(3)}kb (gzip)`);
  } else {
    const ext = format === 'esm' ? '.mjs' : '.js';
    await bundle.write({
      ...output,
      format,
      file: `./packages/${packageName}/dist/${packageName}${ext}`,
    });
  }
}

build({ package: 'rax', name: 'Rax' });
build({ package: 'rax', name: 'Rax', format: 'esm' });
build({ package: 'rax', name: 'Rax', shouldMinify: true });

build({ package: 'driver-dom', name: 'DriverDOM' });
build({ package: 'driver-dom', name: 'DriverDOM', format: 'esm' });
build({ package: 'driver-dom', name: 'DriverDOM', shouldMinify: true });

build({ package: 'driver-weex', name: 'DriverWeex' });
build({ package: 'driver-weex', name: 'DriverWeex', format: 'esm' });
build({ package: 'driver-weex', name: 'DriverWeex', shouldMinify: true });

build({ package: 'driver-worker', name: 'DriverWorker' });
build({ package: 'driver-worker', name: 'DriverWorker', format: 'esm' });
build({ package: 'driver-worker', name: 'DriverWorker', shouldMinify: true });

build({ package: 'rax-miniapp-renderer', format: 'cjs' });
build({ package: 'rax-miniapp-renderer', format: 'cjs', shouldMinify: true });
