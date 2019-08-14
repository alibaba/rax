const { join, relative, dirname } = require('path');
const { readJSONSync } = require('fs-extra');
const t = require('@babel/types');
const { _transform: transformTemplate } = require('./element');
const genExpression = require('../codegen/genExpression');
const traverse = require('../utils/traverseNodePath');
const moduleResolve = require('../utils/moduleResolve');
const createJSX = require('../utils/createJSX');
const Expression = require('../utils/Expression');

const RELATIVE_COMPONENTS_REG = /^\..*(\.jsx?)?$/i;
let tagCount = 0;

/**
 * Rax components.
 */
module.exports = {
  parse(parsed, code, options) {
    const componentsDependentProps = parsed.componentDependentProps = {};
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
      const pkgPath = moduleResolve(options.resourcePath, join(pkgName, 'package.json'));
      if (!pkgPath) {
        throw new Error(`MODULE_NOT_RESOLVE: Can not resolve rax component "${pkgName}", please check you have this module installed.`);
      }
      return readJSONSync(pkgPath);
    }

    function getComponentPath(alias) {
      if (RELATIVE_COMPONENTS_REG.test(alias.from)) {
        // alias.local
        if (!options.resourcePath) {
          throw new Error('`resourcePath` must be passed to calc dependency path.');
        }

        const filename = moduleResolve(options.resourcePath, alias.from, '.jsx')
          || moduleResolve(options.resourcePath, alias.from, '.js');
        return filename;
      } else {
        // npm module
        const pkg = getComponentConfig(alias.from);
        if (pkg.miniappConfig && pkg.miniappConfig.main) {
          const targetFileDir = dirname(join(options.outputPath, relative(options.sourcePath, options.resourcePath)));
          let npmRelativePath = relative(targetFileDir, join(options.outputPath, '/npm'));
          npmRelativePath = npmRelativePath[0] !== '.' ? './' + npmRelativePath : npmRelativePath;
          return './' + join(npmRelativePath, alias.from, pkg.miniappConfig.main);
        } else {
          console.warn('Can not found compatible rax miniapp component "' + pkg.name + '".');
        }
      }
    }

    traverse(parsed.templateAST, {
      JSXOpeningElement(path) {
        const { node, scope, parent, parentPath } = path;

        if (t.isJSXIdentifier(node.name)) { // <View />
          const alias = getComponentAlias(node.name.name);
          removeImport(alias);
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
                const { args, iterValue, loopFnBody } = parentJSXListEl.node.__jsxlist;
                const __args = [
                  args[0] || t.identifier('item'),
                  args[1] || t.identifier('index'),
                ];
                const callee = t.memberExpression(iterValue, t.identifier('forEach'));
                const block = t.blockStatement([]);

                const loopArgs = [t.arrowFunctionExpression(__args, block)];
                const loopExp = t.expressionStatement(t.callExpression(callee, loopArgs));

                const fnBody = parsed.renderFunctionPath.node.body.body;
                const grandJSXListEl = parentJSXListEl.findParent(p => p.node.__jsxlist);
                const body = grandJSXListEl && grandJSXListEl.node.__jsxlist.loopBlockStatement
                  ? grandJSXListEl.node.__jsxlist.loopBlockStatement.body
                  : fnBody;

                body.push(loopExp);
                // Can be removed if not used.
                block.body.remove = () => {
                  const index = body.indexOf(loopExp);
                  body.splice(index, 1);
                };
                componentsDependentProps[tagId].parentNode = block.body;
                parentJSXListEl.node.__jsxlist.loopBlockStatement = block;
              }
            }

            node.attributes.push(t.jsxAttribute(
              t.jsxIdentifier('__tagId'),
              t.stringLiteral(tagId)
            ));

            node.name = t.jsxIdentifier(componentTag);
            // Handle with close tag too.
            if (parent.closingElement) parent.closingElement.name = t.jsxIdentifier(componentTag);
            usingComponents[componentTag] = getComponentPath(alias);

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
            const alias = getComponentAlias(object.name);
            removeImport(alias);
            if (alias) {
              const pkg = getComponentConfig(alias.from);
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
