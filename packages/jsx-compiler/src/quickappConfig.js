// utils include quickapp Api
const t = require('@babel/types');
const traverse = require('./utils/traverseNodePath');
const { parseCode } = require('./parser');
const genCode = require('./codegen/genCode');
const { relative, join, dirname } = require('path');
const { readJSONSync } = require('fs-extra');
const { moduleResolve } = require('./utils/moduleResolve');
const { normalizeFileName } = require('./utils/pathHelper');
// const CodeError = require('../utils/CodeError');
// const compiledComponents = require('../compiledComponents');
// const basedComponents = require('../baseComponents');

module.exports = function(rawContent, options = {}) {
  let result = false;
  const getRealSource = (value, prefix, rootContext) => {
    const npmName = getNpmName(value);
    const nodeModulePath = join(rootContext, 'node_modules');
    const searchPaths = [nodeModulePath];
    let target = require.resolve(npmName, { paths: searchPaths });
    // In tnpm, 'target will be like following (symbol linked path):
    // ***/_universal-toast_1.0.0_universal-toast/lib/index.js
    let packageJSONPath;
    try {
      packageJSONPath = require.resolve(join(npmName, 'package.json'), { paths: searchPaths });
    } catch (err) {
      throw new Error(`You may not have npm installed: "${npmName}"`);
    }
    const packageJSON = readJSONSync(packageJSONPath);
    const moduleBasePath = join(packageJSONPath, '..');
    if (packageJSON.quickappConfig) {
      result = true;
      target = join(moduleBasePath, packageJSON.quickappConfig.main);
    }
    const realNpmName = relative(nodeModulePath, moduleBasePath);
    const modulePathSuffix = relative(moduleBasePath, target);
    let ret = join(prefix, realNpmName, modulePathSuffix);
    if (ret[0] !== '.') ret = './' + ret;
    // ret => '../npm/_ali/universal-toast/lib/index.js

    return t.stringLiteral(normalizeFileName(ret));
  };
  const { outputPath, resourcePath, sourcePath, rootContext } = options;
  const ast = parseCode(rawContent);
  traverse(ast, {
    ImportDeclaration(path) {
      const { source } = path.node;
      let pkgName = source.value;
      if (pkgName.indexOf('./') === -1) {
        const targetFileDir = dirname(join(outputPath, relative(sourcePath, resourcePath)));
        let npmRelativePath = relative(targetFileDir, join(outputPath, '/npm'));
        npmRelativePath = npmRelativePath[0] !== '.' ? './' + npmRelativePath : npmRelativePath;
        // const name = normalizeFileName(join(outputPath, 'npm', relative(rootNodeModulePath, pkgName)));
        // console.log('name', name)
        path.node.source = getRealSource(pkgName, npmRelativePath, rootContext);
      }
    }
  });
  return {
    isQaConfigModules: result,
    code: genCode(ast).code
  };
};
function getNpmName(value) {
  const isScopedNpm = /^_?@/.test(value);
  return value.split('/').slice(0, isScopedNpm ? 2 : 1).join('/');
}

