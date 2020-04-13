const { join, relative, dirname, resolve, sep } = require('path');
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

const RELATIVE_COMPONENTS_REG = /^\..*(\.jsx?)?$/i;
const PKG_NAME_REG = new RegExp(`^.*\\${sep}node_modules\\${sep}([^\\${sep}]*).*$`);
const GROUP_PKG_NAME_REG = new RegExp(`^.*\\${sep}node_modules\\${sep}([^\\${sep}]*?\\${sep}[^\\${sep}]*).*$`);

let tagCount = 0;
let iconFontIndex = 0;

/**
 * Transform the component name is identifier
 * @param {Object} path
 * @param {Object} alias
 * @param {Object} dynamicValue
 * @param {Object} parsed
 * @param {Object} options
 */
function transformIdentifierComponentName(path, alias, dynamicValue, parsed, options) {
  const { adapter } = options;
  const componentConfig = 'quickappConfig';
  const tagIdKey = 'tag-id';
  const tagIdValue = 'tagId';
  const { node, parentPath } = path;
  const {
    renderFunctionPath,
    componentDependentProps,
  } = parsed;
  // Miniapp template tag name does not support special characters.
  const aliasName = alias.name.replace(/@|\//g, '_');
  const componentTag = alias.default ? aliasName : `${aliasName}-${alias.local.toLowerCase()}`;
  // todo delete
  const pureComponentTag = componentTag.replace('_ali_', '');
  replaceComponentTagName(path, t.jsxIdentifier(pureComponentTag));
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

      tagId = `{{${tagIdValue}}}-` + tagId;
    } else {
      tagId = createBinding(tagIdValue);
    }

    node.attributes.push(
      t.jsxAttribute(t.jsxIdentifier(tagIdKey), t.stringLiteral(tagId)),
    );

    if (componentTag === 'slot') return;

    // handle with icon in adapter.singleFileComponent
    if (pureComponentTag.indexOf('rax-icon') > -1) {
      const fontAttr = {};
      node.attributes.forEach((attr) => {
        if (attr.name.name === 'fontFamily') {
          fontAttr.fontFamily = attr.value.value;
        }
        if (attr.name.name === 'source') {
          attr.value.expression.properties.forEach(property => {
            if (property.key.name === 'uri') {
              fontAttr.url = property.value.value;
            }
          });
        }
      });
      const index = iconFontIndex++;
      if (!fontAttr.fontFamily) {
        fontAttr.fontFamily = `iconfont${index}`;
      }
      fontAttr.iconClass = `icon-font-${index}`;
      node.attributes.push(t.jsxAttribute(t.jsxIdentifier('class-name'), t.stringLiteral(fontAttr.iconClass)));
      if (!parsed.iconfontMap.some(iconFont => iconFont.url === fontAttr.url)) {
        parsed.iconfontMap.push(fontAttr);
      }
    }

    /**
     * Handle with special attrs &&
     * Judge whether the component is from component library
     */
    if (!RELATIVE_COMPONENTS_REG.test(alias.from)) {
      const packageName = getNpmName(alias.from);
      if (packageName === alias.from) {
        const pkg = getComponentConfig(alias.default ? alias.from : alias.name, options.resourcePath);
        if (pkg && pkg[componentConfig]) {
          if (Array.isArray(pkg[componentConfig].renderSlotProps)) {
            path.traverse({
              JSXAttribute(attrPath) {
                const { node } = attrPath;
                if (
                  pkg[componentConfig].renderSlotProps.indexOf(node.name.name) > -1
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

          if (pkg[componentConfig].subPackages) {
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
  const { ast, templateAST, imported } = parsed;
  const { adapter } = options;
  const dynamicValue = {};
  const contextList = [];
  const componentsAlias = {};
  const componentConfig = 'quickappConfig';
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
              const isSingleComponent = pkg[componentConfig] && pkg[componentConfig].subComponents && pkg[componentConfig].subComponents[property.name];
              const isComponentLibrary = pkg[componentConfig] && pkg[componentConfig].subPackages && pkg[componentConfig].subPackages[alias.local] && pkg[componentConfig].subPackages[alias.local].subComponents && pkg[componentConfig].subPackages[alias.local].subComponents[property.name];

              if (isSingleComponent) {
                let subComponent = pkg[componentConfig].subComponents[property.name];
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
                let subComponent = pkg[componentConfig].subPackages[alias.local].subComponents[property.name];
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
  return {
    contextList,
    dynamicValue,
    componentsAlias
  };
}
function transformDataset(parsed, options) {
  const { ast, templateAST, imported } = parsed;
  traverse(templateAST, {
    JSXElement: {
      exit(path) {
        const { node } = path;
        const openEle = node.openingElement;
        const openTagName = openEle.name;
        if (t.isJSXIdentifier(openTagName)
        && (typeof openEle.isCustomEl !== 'undefined' && !openEle.isCustomEl)
        && !getCompiledComponents(options.adapter.platform)[openTagName.name]
        && !node.__transformDataset
        && openEle.attributes.some(x => x.name.name.indexOf('data-') > -1)) {
          node.__transformDataset = true;
          let attr = {
            class: t.stringLiteral('__rax-view')
          };
          node.openingElement.attributes.forEach(v => {
            if (v.name.name.indexOf('data-') > -1) {
              attr[ v.name.name ] = v.value;
            }
            if (v.name.name.indexOf('onClick') > -1) {
              attr[ v.name.name ] = v.value;
            }
          });
          if (attr.onClick) {
            node.openingElement.attributes = node.openingElement.attributes.filter(x => x.name.name !== 'onClick');
          }
          path.replaceWith(createJSX('div', attr, [path.node]));
        }
      }
    }
  });
}
/**
 * Rax components.
 */
module.exports = {
  parse(parsed, code, options) {
    const { adapter } = options;
    if (!parsed.componentDependentProps) {
      parsed.componentDependentProps = {};
    }
    if (!parsed.iconfontMap) {
      parsed.iconfontMap = [];
    }
    const { contextList, dynamicValue, componentsAlias, iconfontMap } = transformComponents(parsed, options);
    transformDataset(parsed, options);
    // Collect used components
    Object.keys(componentsAlias).forEach(componentTag => {
      if (!parsed.usingComponents) {
        parsed.usingComponents = {};
      }
      // todo delete
      const key = componentTag.replace('_ali_', '');
      parsed.usingComponents[key] = getComponentPath(componentsAlias[componentTag], options);
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
    ret.iconfontMap = parsed.iconfontMap;
  },
  // For test case.
  _transformComponents: transformComponents,
  _transformDataset: transformDataset
};

function getComponentAlias(tagName, imported) {
  if (imported) {
    for (let [key, value] of Object.entries(imported)) {
      for (let i = 0, l = value.length; i < l; i++) {
        if (value[i].local === tagName)
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
  const { adapter } = options;
  if (RELATIVE_COMPONENTS_REG.test(alias.from)) {
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
      return normalizeFileName(addRelativePathPrefix(normalizeOutputFilePath(join(npmRelativePath, alias.from.replace(pkgName, realPkgName)))));
    }
    // Use miniappConfig in package.json to import native miniapp component
    const pkg = getComponentConfig(alias.from, options.resourcePath);
    let mainName = 'main';
    // if (options.platform.type !== 'ali' && !adapter.singleFileComponent) {
    //   mainName += `:${options.platform.type}`;
    // }
    // todo remove quickappConfig
    const componentConfig = 'quickappConfig';

    const isSingleComponent = pkg[componentConfig] && pkg[componentConfig][mainName];
    const isComponentLibrary = pkg[componentConfig] && pkg[componentConfig].subPackages;
    if (!isSingleComponent && !isComponentLibrary) {
      console.warn(
        'Can not found compatible rax miniapp component "' + pkg.name + '".',
      );
      return;
    } else {
      const miniappComponentPath = isSingleComponent ?
        pkg[componentConfig][mainName] :
        alias.isSubComponent ?
          pkg[componentConfig].subPackages[alias.local].subComponents[alias.subComponentName][mainName] :
          pkg[componentConfig].subPackages[alias.local][mainName];
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
