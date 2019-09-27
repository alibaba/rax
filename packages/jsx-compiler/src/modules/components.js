const { join, relative, dirname } = require('path');
const { readJSONSync } = require('fs-extra');
const t = require('@babel/types');
const { _transform: transformTemplate } = require('./element');
const genExpression = require('../codegen/genExpression');
const traverse = require('../utils/traverseNodePath');
const moduleResolve = require('../utils/moduleResolve');
const createJSX = require('../utils/createJSX');
const Expression = require('../utils/Expression');
const baseComponents = require('../baseComponents');

const RELATIVE_COMPONENTS_REG = /^\..*(\.jsx?)?$/i;
const PKG_NAME_REG = /^.*\/node_modules\/([^\/]*).*$/;
let tagCount = 0;

/**
 * Rax components.
 */
module.exports = {
  parse(parsed, code, options) {
    const componentsDependentProps = parsed.componentDependentProps = {};
    const usingComponents = parsed.usingComponents = {};

    traverse(parsed.templateAST, {
      JSXOpeningElement(path) {
        const { node, scope, parent, parentPath } = path;

        if (t.isJSXIdentifier(node.name)) { // <View />
          const alias = getComponentAlias(node.name.name, parsed.imported);
          removeImport(parsed.ast, alias);
          if (alias) {
            // Miniapp template tag name does not support special characters.
            const componentTag = alias.name.replace(/@|\//g, '_');
            const parentJSXListEl = path.findParent(p => p.node.__jsxlist);
            // <tag __tagId="tagId" />
            let tagId = '' + tagCount++;
            if (parentJSXListEl) {
              const { args } = parentJSXListEl.node.__jsxlist;
              const indexValue = args.length > 1 ? genExpression(args[1]) : 'index';
              parentPath.node.__tagIdExpression = [tagId, new Expression(indexValue)];
              tagId += '-{{' + indexValue + '}}';
            }
            parentPath.node.__tagId = tagId;
            componentsDependentProps[tagId] = componentsDependentProps[tagId] || {};
            if (parentPath.node.__tagIdExpression) {
              componentsDependentProps[tagId].tagIdExpression = parentPath.node.__tagIdExpression;

              if (parsed.renderFunctionPath) {
                const { loopFnBody } = parentJSXListEl.node.__jsxlist;
                componentsDependentProps[tagId].parentNode = loopFnBody.body;
              }
            }

            if (alias.isCustomEl) {
              node.attributes.push(t.jsxAttribute(
                t.jsxIdentifier('__parentId'),
                t.stringLiteral('{{__tagId}}')
              ));
            }

            node.attributes.push(t.jsxAttribute(
              t.jsxIdentifier('__tagId'),
              t.stringLiteral(tagId)
            ));

            node.name = t.jsxIdentifier(componentTag);
            // Handle with close tag too.
            if (parent.closingElement) parent.closingElement.name = t.jsxIdentifier(componentTag);
            if (!baseComponents[componentTag]) {
              usingComponents[componentTag] = getComponentPath(alias, options);
            }
            /**
             * Handle with special attrs.
             */
            if (!RELATIVE_COMPONENTS_REG.test(alias.from)) {
              const pkg = getComponentConfig(alias.from, options.resourcePath);
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
                          throw new Error(`NOT_SUPPORTED: Not support MemberExpression at render function: "${genExpression(node)}", please use anonymous function instead.`);
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
            const alias = getComponentAlias(object.name, parsed.imported);
            removeImport(parsed.ast, alias);
            if (alias) {
              const pkg = getComponentConfig(alias.from, options.resourcePath);
              if (pkg && pkg.miniappConfig && pkg.miniappConfig.subComponents && pkg.miniappConfig.subComponents[property.name]) {
                let subComponent = pkg.miniappConfig.subComponents[property.name];
                node.name = t.jsxIdentifier(subComponent.tagNameMap);
                // subComponent default style
                if (subComponent.attributes && subComponent.attributes.style) {
                  path.parentPath.node.openingElement.attributes.push(t.jsxAttribute(t.jsxIdentifier('style'), t.stringLiteral(subComponent.attributes.style)));
                }
                if (path.parentPath.node.closingElement) {
                  path.parentPath.node.closingElement.name = t.jsxIdentifier(pkg.miniappConfig.subComponents[property.name].tagNameMap);
                }
              }
            }
          } else {
            throw new Error(`NOT_SUPPORTED: Unsupported type of sub components. ${genExpression(node)}`);
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
  },
  generate(ret, parsed, options) {
    ret.usingComponents = parsed.usingComponents;
  },
};

function getComponentAlias(tagName, imported) {
  if (imported) {
    for (let [key, value] of Object.entries(imported)) {
      for (let i = 0, l = value.length; i < l; i++) {
        if (value[i].local === tagName) return Object.assign({ from: key }, value[i]);
      }
    }
  }
}

function getComponentConfig(pkgName, resourcePath) {
  const pkgPath = moduleResolve(resourcePath, join(pkgName, 'package.json'));
  if (!pkgPath) {
    throw new Error(`MODULE_NOT_RESOLVE: Can not resolve rax component "${pkgName}", please check you have this module installed.`);
  }
  return readJSONSync(pkgPath);
}

// for tnpm, the package name will be like _rax-image@1.1.2@rax-image
function getRealNpmPkgName(filePath) {
  const result = PKG_NAME_REG.exec(filePath);
  return result && result[1].replace(/@/g, '_');
}

function getComponentPath(alias, options) {
  if (RELATIVE_COMPONENTS_REG.test(alias.from)) {
    // alias.local
    if (!options.resourcePath) {
      throw new Error('`resourcePath` must be passed to calc dependency path.');
    }

    const filename = moduleResolve(options.resourcePath, alias.from, '.jsx')
      || moduleResolve(options.resourcePath, alias.from, '.js');
    return filename;
  } else {
    const realNpmFile = require.resolve(alias.from, { paths: [options.resourcePath] });
    const pkgName = getRealNpmPkgName(realNpmFile);
    // npm module
    const pkg = getComponentConfig(alias.from, options.resourcePath);
    if (pkg.miniappConfig && pkg.miniappConfig.main) {
      const targetFileDir = dirname(join(options.outputPath, relative(options.sourcePath, options.resourcePath)));
      let npmRelativePath = relative(targetFileDir, join(options.outputPath, '/npm'));
      npmRelativePath = npmRelativePath[0] !== '.' ? './' + npmRelativePath : npmRelativePath;
      return './' + join(npmRelativePath, pkgName, pkg.miniappConfig.main);
    } else {
      console.warn('Can not found compatible rax miniapp component "' + pkg.name + '".');
    }
  }
}

function removeImport(ast, alias) {
  if (!alias) return;
  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      if (t.isStringLiteral(node.source) && node.source.value === alias.from) {
        path.remove();
      }
    }
  });
}

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
