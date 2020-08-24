const { join, relative, dirname, resolve } = require('path');
const { readJSONSync } = require('fs-extra');
const resolveModule = require('resolve');
const t = require('@babel/types');
const { _transform: transformTemplate } = require('./element');
const genExpression = require('../codegen/genExpression');
const traverse = require('../utils/traverseNodePath');
const { moduleResolve, multipleModuleResolve } = require('../utils/moduleResolve');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const Expression = require('../utils/Expression');
const getCompiledComponents = require('../getCompiledComponents');
const replaceComponentTagName = require('../utils/replaceComponentTagName');
const { getNpmName, normalizeFileName, addRelativePathPrefix, normalizeOutputFilePath } = require('../utils/pathHelper');
const { RELATIVE_COMPONENTS_REG, MINIAPP_PLUGIN_COMPONENTS_REG, PKG_NAME_REG, GROUP_PKG_NAME_REG} = require('../constants');

let tagCount = 0;

/**
 * Transform the component name is identifier
 * @param {Object} path
 * @param {Object} alias
 * @param {Object} dynamicValue
 * @param {Object} parsed
 * @param {Object} options
 */
function transformIdentifierComponentName(path, alias, dynamicValue, parsed, options) {
  const { node, parentPath } = path;
  const {
    renderFunctionPath,
    componentDependentProps,
  } = parsed;
  // Miniapp template tag name does not support special characters.
  const aliasName = alias.name.replace(/@|\//g, '_');
  const componentTag = alias.default ? aliasName : `${aliasName}-${alias.local.toLowerCase()}`;
  replaceComponentTagName(path, t.jsxIdentifier(componentTag));
  node.isCustomEl = alias.isCustomEl;
  node.name.isCustom = true;

  if (!getCompiledComponents(options.adapter.platform)[componentTag]) {
    // <tag __tagId="tagId" />

    let tagId;

    if (!node.__slotChildEl) {
      tagId = '' + tagCount;

      const parentsJSXList = findParentsJSXListEl(path);
      if (parentsJSXList.length > 0) {
        parentPath.node.__tagIdExpression = [];
        for (let i = parentsJSXList.length - 1; i >= 0; i--) {
          const { args } = parentsJSXList[i].node.__jsxlist;
          const indexValue = args.length > 1 ? genExpression(args[1]) : 'index';
          parentPath.node.__tagIdExpression.push(new Expression(indexValue));
          tagId += `-{{${indexValue}}}`;
        }
        parentPath.node.__tagIdExpression.unshift(tagCount);
      }
      tagCount++;
      parentPath.node.__tagId = tagId;
      componentDependentProps[tagId] = componentDependentProps[tagId] || {};
      if (parentPath.node.__tagIdExpression) {
        componentDependentProps[tagId].tagIdExpression =
          parentPath.node.__tagIdExpression;

        if (renderFunctionPath) {
          const { loopFnBody } = parentsJSXList[0].node.__jsxlist;
          componentDependentProps[tagId].parentNode = loopFnBody.body;
        }
      }

      tagId = '{{__tagId}}-' + tagId;
    } else {
      tagId = createBinding(
        genExpression(
          t.memberExpression(
            t.identifier(node.__slotChildEl.scopeName.value),
            t.identifier('__tagId')
          )
        )
      );
    }

    node.attributes.push(
      t.jsxAttribute(t.jsxIdentifier('__tagId'), t.stringLiteral(tagId)),
    );

    if (componentTag === 'slot') return;

    /**
     * Handle with special attrs &&
     * Judge whether the component is from component library
     */
    if (!RELATIVE_COMPONENTS_REG.test(alias.from)) {
      const packageName = getNpmName(alias.from);
      if (packageName === alias.from) {
        const pkg = getComponentConfig(alias.default ? alias.from : alias.name, options.resourcePath);
        if (pkg && pkg.miniappConfig) {
          if (Array.isArray(pkg.miniappConfig.renderSlotProps)) {
            path.traverse({
              JSXAttribute(attrPath) {
                const { node } = attrPath;
                if (
                  pkg.miniappConfig.renderSlotProps.indexOf(node.name.name) > -1
                ) {
                  if (t.isJSXExpressionContainer(node.value)) {
                    let fnExp;
                    if (t.isFunction(node.value.expression)) {
                      fnExp = node.value.expression;
                    } else if (t.isIdentifier(node.value.expression)) {
                      const binding = attrPath.scope.getBinding(
                        node.value.expression.name,
                      );
                      fnExp = binding.path.node;
                    } else if (t.isMemberExpression(node.value.expression)) {
                      throw new Error(
                        `NOT_SUPPORTED: Not support MemberExpression at render function: "${genExpression(
                          node,
                        )}", please use anonymous function instead.`,
                      );
                    }

                    if (fnExp) {
                      const { params, body } = fnExp;
                      let jsxEl = body;
                      if (t.isBlockStatement(body)) {
                        const returnEl = body.body.filter(el =>
                          t.isReturnStatement(el),
                        )[0];
                        if (returnEl) jsxEl = returnEl.argument;
                      }
                      const {
                        node: slotComponentNode,
                        dynamicValue: slotComponentDynamicValue,
                      } = createSlotComponent(jsxEl, node.name.name, params);
                      Object.assign(dynamicValue, slotComponentDynamicValue);
                      path.parentPath.node.children.push(slotComponentNode);
                    }
                    attrPath.remove();
                  }
                }
              },
            });
          }

          if (pkg.miniappConfig.subPackages) {
            parsed.imported[alias.from].forEach(importedComponent => {
              importedComponent.isFromComponentLibrary = true;
            });
          }
        }
      }
    }
    return componentTag;
  }
}

function transformComponents(parsed, options) {
  const { ast, templateAST, imported, exported } = parsed;
  const dynamicValue = {};
  const contextList = [];
  const componentsAlias = {};

  if (templateAST) {
    traverse(templateAST, {
      JSXOpeningElement(path) {
        const { node } = path;
        if (t.isJSXIdentifier(node.name)) {
          // <View/>
          const componentTag = node.name.name;
          const alias = getComponentAlias(componentTag, imported);
          if (alias) {
            removeImport(ast, alias);
            const componentTag = transformIdentifierComponentName(path, alias, dynamicValue, parsed, options);
            if (componentTag) {
              // Collect renamed component tag & path info
              componentsAlias[componentTag] = alias;
            }
          } else if (componentTag === 'slot') {
            transformIdentifierComponentName(
              path,
              {
                name: 'slot',
                default: true
              },
              dynamicValue,
              parsed,
              options
            );
          }
        } else if (t.isJSXMemberExpression(node.name)) {
          // <RecyclerView.Cell /> or <Context.Provider>
          const { object, property } = node.name;
          if (t.isJSXIdentifier(object) && t.isJSXIdentifier(property)) {
            if (property.name === 'Provider') {
              // <Context.Provider>
              const valueAttribute = node.attributes.find(a =>
                t.isJSXIdentifier(a.name, { name: 'value' }),
              );
              const contextInitValue = valueAttribute && valueAttribute.value.expression;
              const contextItem = {
                contextInitValue,
                contextName: object.name,
              };
              contextList.push(contextItem);
              replaceComponentTagName(path, t.jsxIdentifier('block'));
              node.attributes = [];
            } else {
              // <RecyclerView.Cell />
              const alias = getComponentAlias(object.name, imported);
              removeImport(parsed.ast, alias);
              if (alias) {
                const pkg = getComponentConfig(alias.from, options.resourcePath);
                const isSingleComponent = pkg.miniappConfig && pkg.miniappConfig.subComponents && pkg.miniappConfig.subComponents[property.name];
                const isComponentLibrary = pkg.miniappConfig && pkg.miniappConfig.subPackages && pkg.miniappConfig.subPackages[alias.local] && pkg.miniappConfig.subPackages[alias.local].subComponents && pkg.miniappConfig.subPackages[alias.local].subComponents[property.name];

                if (isSingleComponent) {
                  let subComponent = pkg.miniappConfig.subComponents[property.name];
                  replaceComponentTagName(
                    path,
                    t.jsxIdentifier(subComponent.tagNameMap),
                  );
                  // subComponent default style
                  if (subComponent.attributes && subComponent.attributes.style) {
                    node.attributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier('style'),
                        t.stringLiteral(subComponent.attributes.style),
                      ),
                    );
                  }
                } else if (isComponentLibrary) {
                  let subComponent = pkg.miniappConfig.subPackages[alias.local].subComponents[property.name];
                  const componentTag = subComponent.tagNameMap || `${alias.name}-${object.name}-${property.name}`.toLowerCase().replace(/@|\//g, '_');
                  replaceComponentTagName(
                    path,
                    t.jsxIdentifier(componentTag)
                  );
                  componentsAlias[componentTag] = Object.assign({
                    isSubComponent: true,
                    subComponentName: property.name
                  }, alias);
                }
              }
            }
          } else {
            throw new Error(
              `NOT_SUPPORTED: Unsupported type of sub components. ${genExpression(
                node,
              )}`,
            );
          }
        }
      },
      JSXExpressionContainer(path) {
        const { node, parentPath } = path;
        // Only process under JSXEelement
        if (parentPath.isJSXElement()) {
          if (
            ['this.props.children', 'props.children', 'children'].indexOf(
              genExpression(node.expression),
            ) > -1
          ) {
            path.replaceWith(createJSX('slot'));
          }
        }
      },
      JSXFragment(path) {
        // Transform <></> => <block></block>
        const blockNode = t.jsxIdentifier('block');
        const { children = [] } = path.node;
        path.replaceWith(t.jsxElement(t.jsxOpeningElement(blockNode, []), t.jsxClosingElement(blockNode), children));
      }
    });
  } else {
    // add export muilt component
    for (let exportName of exported) {
      const alias = getComponentAlias(exportName, imported);
      if (alias && alias.name) componentsAlias[alias.name] = alias;
    }
  }
  return {
    contextList,
    dynamicValue,
    componentsAlias
  };
}

/**
 * Rax components.
 */
module.exports = {
  parse(parsed, code, options) {
    if (!parsed.componentDependentProps) {
      parsed.componentDependentProps = {};
    }
    const { contextList, dynamicValue, componentsAlias } = transformComponents(parsed, options);
    // Collect used components
    Object.keys(componentsAlias).forEach(componentTag => {
      if (!parsed.usingComponents) {
        parsed.usingComponents = {};
      }
      parsed.usingComponents[componentTag] = getComponentPath(componentsAlias[componentTag], options);
    });
    // Assign used context
    parsed.contextList = contextList;
    // Collect dynamicValue
    if (parsed.dynamicValue) {
      Object.assign(parsed.dynamicValue, dynamicValue);
    } else {
      parsed.dynamicValue = dynamicValue;
    }
  },
  generate(ret, parsed, options) {
    ret.usingComponents = parsed.usingComponents;
  },
  // For test case.
  _transformComponents: transformComponents
};

function getComponentAlias(quoteName, imported) {
  if (imported) {
    for (let [key, value] of Object.entries(imported)) {
      for (let i = 0, l = value.length; i < l; i++) {
        if (value[i].local === quoteName)
          return Object.assign({ from: key }, value[i]);
      }
    }
  }
}

function getComponentConfig(pkgName, resourcePath) {
  const pkgPath = moduleResolve(resourcePath, join(pkgName, 'package.json'));
  if (!pkgPath) {
    throw new Error(
      `MODULE_NOT_RESOLVE: Can not resolve rax component "${pkgName}", please check you have this module installed.`,
    );
  }
  return readJSONSync(pkgPath);
}

// for tnpm, the package name will be like _rax-image@1.1.2@rax-image
function getRealNpmPkgName(filePath, pkgName) {
  const isGroupPkg = pkgName.indexOf('/') !== -1;

  const result = isGroupPkg ? GROUP_PKG_NAME_REG.exec(filePath) : PKG_NAME_REG.exec(filePath);
  return result && result[1];
}

function getComponentPath(alias, options) {
  if (MINIAPP_PLUGIN_COMPONENTS_REG.test(alias.from)) {
    return alias.from;
  } else if (RELATIVE_COMPONENTS_REG.test(alias.from)) {
    // alias.local
    if (!options.resourcePath) {
      throw new Error('`resourcePath` must be passed to calc dependency path.');
    }

    const filename = multipleModuleResolve(options.resourcePath, alias.from, [
      '.jsx', '.js', '.tsx', '.ts'
    ]);
    return filename;
  } else {
    const { disableCopyNpm } = options;
    const realNpmFile = resolveModule.sync(alias.from, { basedir: dirname(options.resourcePath), preserveSymlinks: false });
    const pkgName = getNpmName(alias.from);
    const realPkgName = getRealNpmPkgName(realNpmFile, pkgName);
    const targetFileDir = dirname(join(options.outputPath, relative(options.sourcePath, options.resourcePath)));
    const npmRelativePath = relative(targetFileDir, join(options.outputPath, 'npm'));

    // Use specific path to import native miniapp component
    if (pkgName !== alias.from) {
      return disableCopyNpm ? alias.from : normalizeFileName(addRelativePathPrefix(normalizeOutputFilePath(join(npmRelativePath, alias.from.replace(pkgName, realPkgName)))));
    }
    // Use miniappConfig in package.json to import native miniapp component
    const pkg = getComponentConfig(alias.from, options.resourcePath);
    let mainName = 'main';
    if (options.platform.type !== 'ali') {
      mainName += `:${options.platform.type}`;
    }

    const isSingleComponent = pkg.miniappConfig && pkg.miniappConfig[mainName];
    const isComponentLibrary = pkg.miniappConfig && pkg.miniappConfig.subPackages;
    if (!isSingleComponent && !isComponentLibrary) {
      console.warn(
        'Can not found compatible rax miniapp component "' + pkg.name + '".',
      );
      return;
    } else {
      const miniappComponentPath = isSingleComponent ?
        pkg.miniappConfig[mainName] :
        alias.isSubComponent ?
          pkg.miniappConfig.subPackages[alias.local].subComponents[alias.subComponentName][mainName] :
          pkg.miniappConfig.subPackages[alias.local][mainName];

      if (disableCopyNpm) {
        return normalizeOutputFilePath(join(pkg.name, miniappComponentPath));
      }

      const miniappConfigRelativePath = relative(pkg.main, miniappComponentPath);
      const realMiniappAbsPath = resolve(realNpmFile, miniappConfigRelativePath);
      const realMiniappRelativePath = realMiniappAbsPath.slice(realMiniappAbsPath.indexOf(realPkgName) + realPkgName.length);
      return normalizeFileName(addRelativePathPrefix(normalizeOutputFilePath(join(npmRelativePath, realPkgName, realMiniappRelativePath))));
    }
  }
}

function removeImport(ast, alias) {
  if (!alias) return;
  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      if (t.isStringLiteral(node.source) && node.source.value === alias.from) {
        node.specifiers = (node.specifiers || []).filter(function(s) {
          return !(s.local && s.local.name === alias.local);
        });
        if (!node.specifiers.length) path.remove();
      }
    },
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
  Object.keys(dynamicValue).forEach(key => {
    if (params.hasOwnProperty(key) || /^props\./.test(key))
      delete dynamicValue[key];
  });

  if (enableScopeSlot) {
    // Add scope slot
    jsxEl.openingElement.attributes.push(
      t.jsxAttribute(t.jsxIdentifier('slot-scope'), t.stringLiteral('props')),
    );
  }

  // Add slot attr
  jsxEl.openingElement.attributes.push(
    t.jsxAttribute(t.jsxIdentifier('slot'), t.stringLiteral(slotName)),
  );

  return { dynamicValue, node: jsxEl };
}


function findParentsJSXListEl(path, parentList = []) {
  const parentJSXListEl = path.findParent(p => p.node.__jsxlist);
  if (parentJSXListEl) {
    parentList.push(parentJSXListEl);
    return findParentsJSXListEl(parentJSXListEl, parentList);
  } else {
    return parentList;
  }
}
