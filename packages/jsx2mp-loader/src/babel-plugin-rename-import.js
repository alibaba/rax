const { join, relative, dirname } = require('path');
const chalk = require('chalk');

const { isNpmModule, isWeexModule, isRaxModule } = require('./utils/judgeModule');

const RUNTIME = 'jsx2mp-runtime';

const getRuntimeByPlatform = (platform) => `${RUNTIME}/dist/jsx2mp-runtime.${platform}.esm`;

const defaultOptions = {
  normalizeNpmFileName: (s) => s,
};

module.exports = function visitor({ types: t }, options) {
  options = Object.assign({}, defaultOptions, options);
  const { normalizeNpmFileName, nodeModulesPathList, distSourcePath, outputPath, disableCopyNpm, platform } = options;
  const source = (value, npmList, filename, rootContext) => {
    // Example:
    // value => '@ali/universal-goldlog' or '@ali/xxx/foo/lib'
    // npmList => ['/Users/xxx/node_modules/xxx', '/Users/xxx/node_modules/aaa/node_modules/bbb']
    // filename => '/Users/xxx/workspace/yyy/src/utils/logger.js'
    // rootContext => '/Users/xxx/workspace/yyy/'

    const searchPaths = npmList.reverse();
    const target = require.resolve(value, { paths: searchPaths });

    const rootNodeModulePath = join(rootContext, 'node_modules');
    const filePath = relative(dirname(distSourcePath), join(outputPath, 'npm', relative(rootNodeModulePath, target)));
    return t.stringLiteral(normalizeNpmFileName('./' + filePath));
  };

  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { value } = path.node.source;
        if (isWeexModule(value)) {
          path.remove();
        } else if (isRaxModule(value)) {
          let runtimePath = getRuntimeByPlatform(platform.type);
          if (!disableCopyNpm) {
            const rootNpmRelativePath = relative(dirname(distSourcePath), join(outputPath, 'npm'));
            runtimePath = './' + join(rootNpmRelativePath, RUNTIME);
          }
          path.node.source = t.stringLiteral(runtimePath);
        } else if (isNpmModule(value) && !disableCopyNpm) {
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
            const moduleName = node.arguments[0].value;
            if (isWeexModule(moduleName)) {
              path.replaceWith(t.nullLiteral());
            } else if (isRaxModule(moduleName)) {
              let runtimePath = t.stringLiteral(getRuntimeByPlatform(platform.type));
              if (!disableCopyNpm) {
                runtimePath = source(moduleName, nodeModulesPathList, state.filename, state.cwd);
              }
              path.node.arguments = [
                runtimePath
              ];
            } else if (isNpmModule(moduleName) && !disableCopyNpm) {
              path.node.arguments = [
                source(moduleName, nodeModulesPathList, state.filename, state.cwd)
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
