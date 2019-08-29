const rollup = require('rollup');
const memory = require('rollup-plugin-memory');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const uglify = require('rollup-plugin-uglify').uglify;
const replace = require('rollup-plugin-replace');
const gzipSize = require('gzip-size');
const path = require('path');

const IIFE = 'iife';
const UMD = 'umd';
const ESM = 'esm';
const CJS = 'cjs';

function transformBundleFormat({input, name, format, entry, shouldExportDefault}) {
  return format === IIFE ? memory({
    path: input,
    contents: `
    import ${shouldExportDefault ? name : `* as ${name}`} from './${path.basename(entry)}';
    if (typeof module !== 'undefined') module.exports = ${name};
    else self.${name} = ${name};
    `
  }) : null;
}

function getExtension(format) {
  let ext = '.js';
  switch (format) {
    case 'umd': ext = '.umd.js';
      break;
    case 'esm': ext = '.mjs';
      break;
  }
  return ext;
}

async function build({ package: packageName, entry = 'src/index.js', name, shouldMinify = false, format = UMD, shouldExportDefault = false }) {
  const output = {
    name,
    exports: 'named',
    sourcemap: true
  };
  const input = `./packages/${packageName}/${entry}`;
  // For development
  const bundle = await rollup.rollup({
    input,
    plugins: [
      transformBundleFormat({ input, name, format, entry, shouldExportDefault }),
      resolve(),
      commonjs({
        // style-unit for build while packages linked
        // use /pakacges/ would get error and it seemed to be a rollup-plugin-commonjs bug
        include: /(node_modules|style-unit)/,
      }),
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
        'process.env.NODE_ENV': JSON.stringify(shouldMinify ? 'production' : 'development'),
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
    const ext = getExtension(format);
    await bundle.write({
      ...output,
      format,
      file: `./packages/${packageName}/dist/${packageName}${ext}`,
    });
  }
}

build({ package: 'rax', name: 'Rax' });
build({ package: 'rax', name: 'Rax', format: IIFE });
build({ package: 'rax', name: 'Rax', format: IIFE, shouldMinify: true });
build({ package: 'rax', name: 'Rax', format: ESM });

build({ package: 'driver-dom', name: 'DriverDOM' });
build({ package: 'driver-dom', name: 'DriverDOM', format: IIFE });
build({ package: 'driver-dom', name: 'DriverDOM', format: IIFE, shouldMinify: true });
build({ package: 'driver-dom', name: 'DriverDOM', format: ESM });

build({ package: 'driver-weex', name: 'DriverWeex' });
build({ package: 'driver-weex', name: 'DriverWeex', format: IIFE });
build({ package: 'driver-weex', name: 'DriverWeex', format: IIFE, shouldMinify: true });
build({ package: 'driver-weex', name: 'DriverWeex', format: ESM });

build({ package: 'driver-worker', name: 'DriverWorker' });
build({ package: 'driver-worker', name: 'DriverWorker', format: IIFE, shouldExportDefault: true });
build({ package: 'driver-worker', name: 'DriverWorker', format: IIFE, shouldExportDefault: true, shouldMinify: true });
build({ package: 'driver-worker', name: 'DriverWorker', format: ESM });

build({ package: 'rax-miniapp-renderer', format: CJS });
build({ package: 'rax-miniapp-renderer', format: CJS, shouldMinify: true });
