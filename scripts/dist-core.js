const { join } = require('path');
const { readFileSync, existsSync } = require('fs');
const { green } = require('chalk');
const rollup = require('rollup');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const { terser } = require('rollup-plugin-terser');
const replace = require('@rollup/plugin-replace');
const gzipSize = require('gzip-size');

const UMD = 'umd';
const ESM = 'esm';
const CJS = 'cjs';

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

/**
 * Rollup build options
 * @param buildOptions - rollup build options.
 * @param {string} buildOptions.packageName - package name
 * @param {string} buildOptions.name - package export name, such as umd format: window.Rax
 * @param {string} buildOptions.entry package entry path
 * @param {string} buildOptions.outputPath package output path
 * @param {boolean} buildOptions.shouldMinify compress code or not
 * @param {string} buildOptions.format bundle format (cjs|esm|iife|umd)
 * @param {Array} buildOptions.external external dependencies list
 * @param {Object} buildOptions.replaceValues rollup replace plugin values
 */
async function build({
  packageName,
  name,
  entry = 'src/index.js',
  outputPath,
  shouldMinify = false,
  format = UMD,
  external,
  replaceValues,
}) {
  const input = `./packages/${packageName}/${entry}`;
  const output = {
    name,
    exports: 'named',
    sourcemap: 'hidden',
    compact: false, // This will minify the wrapper code generated by rollup.
    freeze: false,
    strict: false,
    esModule: format === ESM,
  };

  const terserOptions = {
    compress: {
      loops: false,
      keep_fargs: false,
      unsafe: true,
      pure_getters: true
    },
  };

  if (shouldMinify) {
    // Apply mangle rules.
    terserOptions.mangle = {
      properties: {
        regex: /^__/,
      },
    };
  }

  // For development
  const bundle = await rollup.rollup({
    input,
    external,
    plugins: [
      nodeResolve(),
      commonjs({
        // style-unit for build while packages linked
        // use /packages/ would get error and it seemed to be a rollup-plugin-commonjs bug
        include: /node_modules|style-unit/
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**', // only transpile our source code
        presets: [
          ['@babel/preset-env', {
            modules: false,
            loose: true,
            targets: {
              browsers: ['last 2 versions', 'IE >= 9']
            }
          }]
        ]
      }),
      replace({
        values: {
          ...replaceValues,
          'process.env.NODE_ENV': JSON.stringify(shouldMinify ? 'production' : 'development'),
        },
        preventAssignment: true,
      }),
      shouldMinify ? terser(terserOptions) : null,
    ]
  });

  const ext = getExtension(format);

  if (shouldMinify) {
    const file = outputPath || `./packages/${packageName}/dist/${packageName}.min${ext}`;
    await bundle.write({
      ...output,
      format,
      file,
    });

    const size = gzipSize.fileSync(file, {
      level: 6
    });

    console.log(file, `${green((size / 1024).toPrecision(8) + 'KiB')} (Gzipped)`);
  } else {
    await bundle.write({
      ...output,
      format,
      file: outputPath || `./packages/${packageName}/dist/${packageName}${ext}`,
    });
  }
}

function buildCorePackages(options) {
  build(options);
  build({ ...options, shouldMinify: true });
  build({ ...options, format: CJS });
  build({ ...options, format: CJS, shouldMinify: true });
  build({ ...options, format: ESM });
  build({ ...options, format: ESM, shouldMinify: true });
}

// Get rax version
function getRaxVersion() {
  const packageJSONPath = join(process.cwd(), 'packages/rax/package.json');
  if (!existsSync(packageJSONPath)) {
    throw new Error('rax package.json is not exists!');
  }
  const packageData = JSON.parse(readFileSync(packageJSONPath, { encoding: 'utf-8' }));
  return JSON.stringify(packageData.version);
}

const raxVersion = getRaxVersion();

buildCorePackages({
  packageName: 'rax',
  name: 'Rax',
  replaceValues: {
    'process.env.RAX_VERSION': raxVersion
  }
});
buildCorePackages({
  packageName: 'driver-dom',
  name: 'DriverDom'
});
buildCorePackages({
  packageName: 'driver-kraken',
  name: 'DriverKraken'
});
buildCorePackages({
  packageName: 'driver-weex',
  name: 'DriverKraken'
});

// Build rax compat react version to rax/lib/compat/index.js
// It needs external ../../index, which won't bundle rax into lib/compat/index.js
build({
  packageName: 'rax',
  name: 'Rax',
  entry: 'src/compat/index.js',
  outputPath: './packages/rax/lib/compat/index.js',
  format: CJS,
  external: ['../..index', 'rax-children', 'rax-is-valid-element', 'rax-create-factory', 'rax-clone-element'],
  replaceValues: { 'process.env.RAX_VERSION': raxVersion },
});
