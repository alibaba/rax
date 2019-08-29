const { join, relative } = require('path');
const { existsSync, statSync } = require('fs-extra');
const chalk = require('chalk');

const WEEX_MODULE_REG = /^@weex(-module)?\//;

function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
}

function isWeexModule(value) {
  return WEEX_MODULE_REG.test(value);
}

const defaultOptions = {
  normalizeFileName: (s) => s,
};

module.exports = function visitor({ types: t }, options) {
  options = Object.assign({}, defaultOptions, options);
  const { normalizeFileName, npmRelativePath } = options;
  const source = (value, prefix, filename, rootContext) => {
    // Example:
    // value => '@ali/universal-goldlog'
    // prefix => '../npm'
    // filename => '/Users/xxx/workspace/yyy/src/utils/logger.js'
    // rootContext => '/Users/xxx/workspace/yyy/'
    const nodeModulePath = join(rootContext, 'node_modules');
    const target = require.resolve(value, { paths: [nodeModulePath] });
    const modulePathSuffix = relative(join(nodeModulePath, value), target);
    // ret => '../npm/_ali/universal-goldlog/lib/index.js
    return t.stringLiteral(normalizeFileName(join(prefix, value, modulePathSuffix)));
  };

  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { value } = path.node.source;
        if (isWeexModule(value)) {
          path.remove();
        } else if (isNpmModule(value)) {
          path.node.source = source(value, npmRelativePath, state.filename, state.cwd);
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
                source(node.arguments[0].value, npmRelativePath, state.filename, state.cwd)
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
