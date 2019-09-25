const { join, relative, dirname } = require('path');
const { existsSync, statSync } = require('fs-extra');
const chalk = require('chalk');

const { isNpmModule, isWeexModule, isRaxModule } = require('./utils/judgeModule');

const defaultOptions = {
  normalizeNpmFileName: (s) => s,
};

function getNpmName(value) {
  const isScopedNpm = /^_?@/.test(value);
  return value.split('/').slice(0, isScopedNpm ? 2 : 1).join('/');
}

module.exports = function visitor({ types: t }, options) {
  options = Object.assign({}, defaultOptions, options);
  const { normalizeNpmFileName, nodeModulesPathList, distSourcePath, outputPath } = options;
  const source = (value, npmList, filename, rootContext) => {
    const npmName = getNpmName(value);
    // Example:
    // value => '@ali/universal-goldlog' or '@ali/xxx/foo/lib'
    // npmList => ['/Users/xxx/node_modules/xxx', '/Users/xxx/node_modules/aaa/node_modules/bbb']
    // filename => '/Users/xxx/workspace/yyy/src/utils/logger.js'
    // rootContext => '/Users/xxx/workspace/yyy/'

    const searchPaths = npmList.reverse();
    const target = require.resolve(value, { paths: searchPaths });

    // In tnpm, target will be like following (symbol linked path):
    // ***/_universal-toast_1.0.0_universal-toast/lib/index.js
    let packageJSONPath;
    try {
      packageJSONPath = require.resolve(join(npmName, 'package.json'), { paths: searchPaths });
    } catch (err) {
      throw new Error(`You may not have npm installed: "${npmName}"`);
    }

    const moduleBasePath = join(packageJSONPath, '..');
    const modulePathSuffix = relative(moduleBasePath, target);
    // ret => '../npm/_ali/universal-goldlog/lib/index.js

    const rootNodeModulePath = join(rootContext, 'node_modules');
    const filePath = relative(dirname(distSourcePath), join(outputPath, 'npm', relative(rootNodeModulePath, target)));
    return t.stringLiteral(normalizeNpmFileName(filePath));
  };

  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { value } = path.node.source;
        if (isWeexModule(value)) {
          path.remove();
        } else if (isRaxModule(value)) {
          const rootNpmRelativePath = relative(dirname(distSourcePath), join(outputPath, 'npm'));
          path.node.source = t.stringLiteral('./' + join(rootNpmRelativePath, 'jsx2mp-runtime'));
        } else if (isNpmModule(value)) {
          path.node.source = source(value, nodeModulesPathList, state.filename, state.cwd);
        }
      },

      CallExpression(path, state) {
        const { node } = path;
        if (
          node.callee.name === 'require' &&
          node.arguments &&
          node.arguments.length === 1
        ) {
          if (t.isStringLiteral(node.arguments[0])) {
            if (isWeexModule(node.arguments[0].value)) {
              path.replaceWith(t.nullLiteral());
            } else if (isNpmModule(node.arguments[0].value)) {
              path.node.arguments = [
                source(node.arguments[0].value, nodeModulesPathList, state.filename, state.cwd)
              ];
            }
          } else if (t.isExpression(node.arguments[0])) {
            // require with expression, can not staticly find target.
            console.warn(chalk.yellow(`Critical requirement of "${path.toString()}", which have been removed at \n${state.filename}.`));
            path.replaceWith(t.nullLiteral());
          }
        }
      }
    }
  };
};
