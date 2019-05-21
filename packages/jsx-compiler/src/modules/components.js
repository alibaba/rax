const { join } = require('path');
const { readJSONSync } = require('fs-extra');
const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const moduleResolve = require('../utils/moduleResolve');

const RELATIVE_COMPONENTS_REG = /^\..*(\.jsx?)?$/i;

/**
 * Rax components.
 */
module.exports = {
  parse(parsed, code, options) {
    const usingComponents = parsed.usingComponents = {};

    function getComponentAlias(tagName) {
      if (parsed.imported) {
        for (let [key, value] of Object.entries(parsed.imported)) {
          for (let i = 0, l = value.length; i < l; i++) {
            if (value[i].local === tagName) return { from: key, ...value[i] };
          }
        }
      }
    }

    function getComponentPath(alias) {
      if (RELATIVE_COMPONENTS_REG.test(alias.from)) {
        // alias.local
        if (!options.filePath) {
          throw new Error('`filePath` must be passed to calc dependency path.');
        }

        const filename = moduleResolve(options.filePath, alias.from, '.jsx')
          || moduleResolve(options.filePath, alias.from, '.js');
        return filename;
      } else {
        // npm module
        const pkg = readJSONSync(moduleResolve(options.filePath, join(alias.from, 'package.json')));
        if (pkg.miniappConfig && pkg.miniappConfig.main) {
          return join(alias.from, pkg.miniappConfig.main);
        } else {
          console.warn('Not found compatible npm component "' + pkg.name + '".');
        }
      }
    }

    traverse(parsed['templateAST'], {
      JSXOpeningElement(path) {
        const { node, parent } = path;

        if (t.isJSXIdentifier(node.name)) { // <View />
          const alias = getComponentAlias(node.name.name);
          if (alias) {
            node.name = t.jsxIdentifier(alias.name);
            // handle with close tag too.
            if (parent.closingElement) parent.closingElement.name = t.jsxIdentifier(alias.name);
            usingComponents[alias.name] = getComponentPath(alias);
          }
        } else if (t.isJSXMemberExpression(node.name)) { // <RecyclerView.Cell />
          // TODO: handle sub components.
          throw new Error('Not support of sub components.');
        }
      },
    });
  },
  generate(ret, parsed, options) {
    ret.usingComponents = parsed.usingComponents;
  },
};

