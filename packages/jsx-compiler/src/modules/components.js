const { join } = require('path');
const { readJSONSync } = require('fs-extra');
const t = require('@babel/types');
const chalk = require('chalk');
const { _transform: transformTemplate } = require('./element');
const genExpression = require('../codegen/genExpression');
const traverse = require('../utils/traverseNodePath');
const moduleResolve = require('../utils/moduleResolve');
const createJSX = require('../utils/createJSX');


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
            if (value[i].local === tagName) return Object.assign({ from: key }, value[i]);
          }
        }
      }
    }

    function getComponentConfig(pkgName) {
      const pkgPath = moduleResolve(options.filePath, join(pkgName, 'package.json'));
      if (!pkgPath) {
        console.log(chalk.yellow(`Can not resolve rax component "${pkgName}", please check you have this module installed.`));
        throw new Error('MODULE_NOT_RESOLVE');
      }
      return readJSONSync(pkgPath);
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
        const pkg = getComponentConfig(alias.from);
        if (pkg.miniappConfig && pkg.miniappConfig.main) {
          return join(alias.from, pkg.miniappConfig.main);
        } else {
          console.warn('Can not found compatible rax miniapp component "' + pkg.name + '".');
        }
      }
    }

    traverse(parsed.templateAST, {
      JSXOpeningElement(path) {
        const { node, scope, parent } = path;

        if (t.isJSXIdentifier(node.name)) { // <View />
          const alias = getComponentAlias(node.name.name);
          removeImport(alias);
          if (alias) {
            node.name = t.jsxIdentifier(alias.name);
            // handle with close tag too.
            if (parent.closingElement) parent.closingElement.name = t.jsxIdentifier(alias.name);
            usingComponents[alias.name] = getComponentPath(alias);

            /**
             * Handle with special attrs.
             */
            if (!RELATIVE_COMPONENTS_REG.test(alias.from)) {
              const pkg = getComponentConfig(alias.from);
              if (pkg && pkg.miniappConfig && Array.isArray(pkg.miniappConfig.renderSlotProps)) {
                path.traverse({
                  JSXAttribute(attrPath) {
                    const { node } = attrPath;
                    if (pkg.miniappConfig.renderSlotProps.indexOf(node.name.name) > -1) {
                      if (t.isJSXExpressionContainer(node.value)) {
                        let fnExp;
                        if (t.isFunction(node.value.expression)) {
                          fnExp = node.value.expression;
                        } else if (t.isIdentifier(node.value.expression)) {
                          const binding = attrPath.scope.getBinding(node.value.expression.name);
                          fnExp = binding.path.node;
                        } else if (t.isMemberExpression(node.value.expression)) {
                          console.log(chalk.red(`Not support MemberExpression at render function: "${genExpression(node)}", please use anonymous function instead.`));
                          throw new Error('NOT_SUPPORTED');
                        }

                        if (fnExp) {
                          const { params, body } = fnExp;
                          let jsxEl = body;
                          if (t.isBlockStatement(body)) {
                            const returnEl = body.body.filter(el => t.isReturnStatement(el))[0];
                            if (returnEl) jsxEl = returnEl.argument;
                          }
                          const { node: slotComponentNode, dynamicValue } = createSlotComponent(jsxEl, node.name.name, params);
                          parsed.dynamicValue = Object.assign({}, parsed.dynamicValue, dynamicValue);
                          path.parentPath.node.children.push(slotComponentNode);
                        }
                        attrPath.remove();
                      }
                    }
                  },
                });
              }
            }
          }
        } else if (t.isJSXMemberExpression(node.name)) { // <RecyclerView.Cell />
          const { object, property } = node.name;
          if (t.isJSXIdentifier(object) && t.isJSXIdentifier(property)) {
            const alias = getComponentAlias(object.name);
            removeImport(alias);
            if (alias) {
              const pkg = getComponentConfig(alias.from);
              if (pkg && pkg.miniappConfig && pkg.miniappConfig.subComponents && pkg.miniappConfig.subComponents[property.name]) {
                node.name = t.jsxIdentifier(pkg.miniappConfig.subComponents[property.name].tagNameMap);
                if (path.parentPath.node.closingElement) {
                  path.parentPath.node.closingElement.name = t.jsxIdentifier(pkg.miniappConfig.subComponents[property.name].tagNameMap);
                }
              }
            }
          } else {
            console.log(chalk.red('Unsupported type of sub components.' + genExpression(node)));
            throw new Error('NOT_SUPPORTED');
          }
        }
      },
      JSXExpressionContainer(path) {
        const { node, parentPath } = path;
        // Only process under JSXEelement
        if (parentPath.isJSXElement()) {
          if ([
            'this.props.children',
            'props.children',
            'children'
          ].indexOf(genExpression(node.expression)) > -1) {
            path.replaceWith(createJSX('slot'));
          }
        }
      },
    });

    function removeImport(alias) {
      if (!alias) return;
      traverse(parsed.ast, {
        ImportDeclaration(path) {
          const { node } = path;
          if (t.isStringLiteral(node.source) && node.source.value === alias.from) {
            path.remove();
          }
        }
      });
    }
  },
  generate(ret, parsed, options) {
    ret.usingComponents = parsed.usingComponents;
  },
};

function createSlotComponent(jsxEl, slotName, args) {
  const params = {};
  if (Array.isArray(args)) {
    args.forEach(id => params[id.name] = true);
  }

  let enableScopeSlot = false;

  traverse(jsxEl, {
    Identifier(path) {
      if (params[path.node.name]) {
        path.replaceWith(t.identifier(`props.${path.node.name}`));
        enableScopeSlot = true;
      }
    },
  });

  const dynamicValue = transformTemplate(jsxEl, slotName);
  // Remove dynamicValue that created by params.
  Object.keys(dynamicValue).forEach((key) => {
    if (params.hasOwnProperty(key) || /^props\./.test(key)) delete dynamicValue[key];
  });

  if (enableScopeSlot) {
    // Add scope slot
    jsxEl.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('slot-scope'), t.stringLiteral('props')));
  }

  // Add slot attr
  jsxEl.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('slot'), t.stringLiteral(slotName)));

  return { dynamicValue, node: jsxEl };
}
