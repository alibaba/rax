const { resolve } = require('path');
const { readdirSync } = require('fs-extra');
const traverse = require('../utils/traverseNodePath');
const moduleResolve = require('../utils/moduleResolve');
const md5 = require('md5');

const RELATIVE_COMPONENTS_REG = /^\..*(\.jsx?)?$/i;
const RAX_COMP_REG = /^rax-/;
const RAX_COMPONENTS = new Set(
  readdirSync(resolve(__dirname, 'rax-components'))
    .filter(filename => RAX_COMP_REG.test(filename))
);

function existsRaxComponent(imported) {
  const keys = Object.keys(imported);
  for (let i = 0, l = keys.length; i < l; i ++) {
    if (RAX_COMPONENTS.has(keys[i])) return true;
  }
  return false;
}

/**
 * Rax components.
 */
module.exports = {
  parse(parsed, code, options) {
    parsed.usingComponents = new Map();
    if (!existsRaxComponent(parsed.imported)) return;
    traverse(parsed.ast, {
      ImportDeclaration(path) {
        const { node, scope } = path;
        if (RAX_COMPONENTS.has(node.source.value)) {
          // Rax base components.
          parsed.imported[node.source.value].forEach(({ local }) => {
            if (local) {
              parsed.usingComponents.set(local, {
                external: true,
                from: node.source.value,
                tagName: node.source.value,
              });
            }
          });
          path.remove();
        } else if (RELATIVE_COMPONENTS_REG.test(node.source.value)) {
          // Local jsx components.
          parsed.imported[node.source.value].forEach(({ local }) => {
            if (local) {
              if (!options.filePath) {
                throw new Error('`filePath` must be passed to calc dependency path.');
              }
              const filename = moduleResolve(options.filePath, node.source.value, '.jsx')
                || moduleResolve(options.filePath, node.source.value, '.js');

              parsed.usingComponents.set(local, {
                external: false,
                from: node.source.value,
                absolutePath: filename,
                tagName: getTagName(filename),
              });
            }
          });
          path.remove();
        }
      }
    });
  },
  generate(ret, parsed, options) {
    if (parsed.usingComponents) ret.usingComponents = parsed.usingComponents;
  },
};

function getTagName(str) {
  return 'c-' + md5(str).slice(0, 6);
}
