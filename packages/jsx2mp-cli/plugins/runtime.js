const { join } = require('path');
const { copySync, readJSONSync } = require('fs-extra');

/**
 * Runtime packages should be a dependency of jsx2mp-cli,
 * for convenient to copy vendors.
 */
const runtime = 'jsx2mp-runtime';
const runtimePackageJSONPath = require.resolve(join(runtime, 'package.json'));
const runtimePackageJSON = readJSONSync(runtimePackageJSONPath);
const runtimePackagePath = join(runtimePackageJSONPath, '..');

module.exports = class JSX2MPRuntimePlugin {
  constructor({ platform = 'ali' }) {
    this.platform = platform;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'JSX2MPRuntimePlugin',
      (compilation, callback) => {
        const runtimeTargetPath = runtimePackageJSON.miniprogram && runtimePackageJSON.miniprogram[this.platform]
          ? runtimePackageJSON.miniprogram[this.platform]
          : runtimePackageJSON.main || 'index.js';
        const sourceFile = require.resolve(join(runtimePackagePath, runtimeTargetPath));
        const targetFile = join(compiler.outputPath, 'npm', runtime + '.js');

        copySync(sourceFile, targetFile);
        callback();
      }
    );
  }
};
