const { join } = require('path');
const { copySync } = require('fs-extra');

const runtime = 'jsx2mp-runtime';

module.exports = class JSX2MPRuntimePlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'JSX2MPRuntimePlugin',
      (compilation, callback) => {
        const distModule = join(compiler.outputPath, 'npm', runtime);
        const fromModulePackage = require.resolve(join(runtime, 'package.json'));
        const fromModuleDist = join(fromModulePackage, '../dist');

        copySync(fromModulePackage, join(distModule, 'package.json'));
        copySync(fromModuleDist, join(distModule, 'dist'));
        callback();
      }
    );
  }
};
