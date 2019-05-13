const { resolve } = require('path');
const { readdirSync } = require('fs-extra');
const traverse = require('../utils/traverseNodePath');

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
          parsed.imported[node.source.value].forEach(({ local }) => {
            if (local) {
              parsed.usingComponents.set(local, node.source.value);
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
