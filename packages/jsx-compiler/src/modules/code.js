const t = require('@babel/types');
const { join, relative, dirname } = require('path');
const { parseExpression } = require('../parser');
const isClassComponent = require('../utils/isClassComponent');
const isFunctionComponent = require('../utils/isFunctionComponent');
const traverse = require('../utils/traverseNodePath');

const RAX_PACKAGE = 'rax';
const SUPER_COMPONENT = 'Component';

const CREATE_COMPONENT = 'createComponent';
const CREATE_PAGE = 'createPage';
const CREATE_STYLE = 'createStyle';

const SAFE_SUPER_COMPONENT = '__component__';
const SAFE_CREATE_COMPONENT = '__create_component__';
const SAFE_CREATE_PAGE = '__create_page__';
const SAFE_CREATE_STYLE = '__create_style__';

const USE_EFFECT = 'useEffect';
const USE_STATE = 'useState';

const EXPORTED_DEF = '__def__';
const RUNTIME = '/npm/jsx2mp-runtime';

const isAppRuntime = (mod) => mod === 'rax-app';
const isFileModule = (mod) => /\.(png|jpe?g|gif|bmp|webp)$/.test(mod);

function getConstructor(type) {
  switch (type) {
    case 'app': return 'App';
    case 'page': return 'Page';
    case 'component':
    default: return 'Component';
  }
}
/**
 * Module code transform.
 * 1. Add import declaration of helper lib.
 * 2. Rename scope's Component to other id.
 * 3. Add Component call expression.
 * 4. Transform 'rax' to 'rax/dist/rax.min.js' in case of 小程序开发者工具 not support `process`.
 */
module.exports = {
  parse(parsed, code, options) {
    const { defaultExportedPath, eventHandlers = [] } = parsed;
    if (options.type !== 'app' && (!defaultExportedPath || !defaultExportedPath.node)) {
      // Can not found default export, otherwise app.js is excluded.
      return;
    }
    let userDefineType;

    if (options.type === 'app') {
      userDefineType = 'function';
    } else if (isFunctionComponent(defaultExportedPath)) { // replace with class def.
      userDefineType = 'function';
      const { id, generator, async, body, params } = defaultExportedPath.node;
      const replacer = getReplacer(defaultExportedPath);
      if (replacer) {
        replacer.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(EXPORTED_DEF),
              t.functionExpression(id, params, body, generator, async)
            )
          ])
        );
      }
    } else if (isClassComponent(defaultExportedPath)) {
      userDefineType = 'class';

      const { id, superClass, body, decorators } = defaultExportedPath.node;
      const replacer = getReplacer(defaultExportedPath);
      // @NOTE: Remove superClass due to useless of Component base class.
      if (replacer) {
        replacer.replaceWith(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(EXPORTED_DEF),
              t.classExpression(id, t.identifier(SAFE_SUPER_COMPONENT), body, decorators)
            )
          ])
        );
      }
    }

    const hooks = collectHooks(parsed.renderFunctionPath);

    const targetFileDir = dirname(join(options.outputPath, relative(options.sourcePath, options.resourcePath)));

    removeRaxImports(parsed.ast);
    renameCoreModule(parsed.ast, options.outputPath, targetFileDir);
    renameFileModule(parsed.ast);
    renameAppConfig(parsed.ast, options.sourcePath, options.resourcePath);

    const currentNodeModulePath = join(options.sourcePath, 'npm');
    const npmRelativePath = relative(dirname(options.resourcePath), currentNodeModulePath);
    renameNpmModules(parsed.ast, npmRelativePath, options.resourcePath, options.cwd);

    if (options.type !== 'app') {
      addDefine(parsed.ast, options.type, options.outputPath, targetFileDir, userDefineType, eventHandlers, parsed.useCreateStyle, hooks);
    }

    removeDefaultImports(parsed.ast);

    /**
     * updateChildProps: collect props dependencies.
     */
    if (options.type !== 'app' && parsed.renderFunctionPath) {
      const fnBody = parsed.renderFunctionPath.node.body.body;
      let firstReturnStatementIdx = -1;
      for (let i = 0, l = fnBody.length; i < l; i++) {
        if (t.isReturnStatement(fnBody[i])) firstReturnStatementIdx = i;
      }

      const updateProps = t.memberExpression(t.identifier('this'), t.identifier('_updateChildProps'));
      const componentsDependentProps = parsed.componentDependentProps || {};

      Object.keys(componentsDependentProps).forEach((tagId) => {
        const { props, tagIdExpression, parentNode } = componentsDependentProps[tagId];

        // Setup propMaps.
        const propMaps = [];
        props && Object.keys(props).forEach(key => {
          const value = props[key];
          propMaps.push(t.objectProperty(
            t.stringLiteral(key),
            value
          ));
        });

        let argPIDExp = tagIdExpression
          ? genTagIdExp(tagIdExpression)
          : t.stringLiteral(tagId);

        const updatePropsArgs = [
          argPIDExp,
          t.objectExpression(propMaps)
        ];
        const callUpdateProps = t.expressionStatement(t.callExpression(updateProps, updatePropsArgs));
        if (propMaps.length > 0) {
          const targetNode = parentNode || fnBody;
          if (t.isReturnStatement(targetNode[targetNode.length - 1])) {
            targetNode.splice(targetNode.length - 1, 0, callUpdateProps);
          } else {
            targetNode.push(callUpdateProps);
          }
        } else if ((parentNode || fnBody).length === 0) {
          // Remove empty loop exp.
          parentNode && parentNode.remove && parentNode.remove();
        }
      });
      addUpdateData(parsed.dynamicValue, parsed.renderItemFunctions, parsed.renderFunctionPath);
      addUpdateEvent(parsed.dynamicEvents, parsed.eventHandler, parsed.renderFunctionPath);
    }
  },
};

function genTagIdExp(expressions) {
  let ret = '';
  for (let i = 0, l = expressions.length; i < l; i++) {
    if (expressions[i] && expressions[i].isExpression) {
      ret += expressions[i];
    } else {
      ret += JSON.stringify(expressions[i]);
    }
    if (i !== l - 1) ret += ' + "-" + ';
  }
  return parseExpression(ret);
}

function renameCoreModule(ast, outputPath, targetFileDir) {
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.get('source');
      if (source.isStringLiteral() && isAppRuntime(source.node.value)) {
        let runtimeRelativePath = relative(targetFileDir, join(outputPath, RUNTIME));
        runtimeRelativePath = runtimeRelativePath[0] !== '.' ? './' + runtimeRelativePath : runtimeRelativePath;
        source.replaceWith(t.stringLiteral(runtimeRelativePath));
      }
    }
  });
}

// import img from '../assets/img.png' => const img = '../assets/img.png'
function renameFileModule(ast) {
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.get('source');
      if (source.isStringLiteral() && isFileModule(source.node.value)) {
        source.parentPath.replaceWith(t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier(path.get('specifiers')[0].node.local.name),
            t.stringLiteral(source.node.value)
          )
        ]));
      }
    }
  });
}

/**
 * Rename app.json to app.raw.json, for prev is compiled to adapte miniapp.
 * eg:
 *   import appConfig from './app.json' => import appConfig from './app.raw.json'
 * @param ast Babel AST.
 * @param sourcePath Folder path to source.
 * @param resourcePath Current handling file source path.
 */
function renameAppConfig(ast, sourcePath, resourcePath) {
  traverse(ast, {
    ImportDeclaration(path) {
      const source = path.get('source');
      if (source.isStringLiteral()) {
        const appConfigSourcePath = join(resourcePath, '..', source.node.value);
        if (appConfigSourcePath === join(sourcePath, 'app.json')) {
          const replacement = source.node.value.replace(/app\.json/, 'app.raw.json');
          source.replaceWith(t.stringLiteral(replacement));
        }
      }
    }
  });
}

const WEEX_MODULE_REG = /^@weex(-module)?\//;

function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
}

function isWeexModule(value) {
  return WEEX_MODULE_REG.test(value);
}

function getNpmName(value) {
  const isScopedNpm = /^_?@/.test(value);
  return value.split('/').slice(0, isScopedNpm ? 2 : 1).join('/');
}

function renameNpmModules(ast, npmRelativePath, filename, cwd) {
  const source = (value, prefix, filename, rootContext) => {
    const npmName = getNpmName(value);
    const nodeModulePath = join(rootContext, 'node_modules');
    const searchPaths = [nodeModulePath];
    const target = require.resolve(npmName, { paths: searchPaths });
    // In tnpm, target will be like following (symbol linked path):
    // ***/_universal-toast_1.0.0_universal-toast/lib/index.js
    let packageJSONPath;
    try {
      packageJSONPath = require.resolve(join(npmName, 'package.json'), { paths: searchPaths });
    } catch (err) {
      throw new Error(`You may not have npm installed: "${npmName}"`);
    }

    const moduleBasePath = join(packageJSONPath, '..');
    const realNpmName = relative(nodeModulePath, moduleBasePath);
    const modulePathSuffix = relative(moduleBasePath, target);

    let ret = join(prefix, realNpmName, modulePathSuffix);
    if (ret[0] !== '.') ret = './' + ret;
    // ret => '../npm/_ali/universal-toast/lib/index.js

    return t.stringLiteral(normalizeFileName(ret));
  };

  traverse(ast, {
    ImportDeclaration(path) {
      const { value } = path.node.source;
      if (isWeexModule(value)) {
        path.remove();
      } else if (isNpmModule(value)) {
        path.node.source = source(value, npmRelativePath, filename, cwd);
      }
    }
  });
}

function addDefine(ast, type, outputPath, targetFileDir, userDefineType, eventHandlers, useCreateStyle, hooks) {
  let safeCreateInstanceId;
  let importedIdentifier;
  switch (type) {
    case 'page':
      safeCreateInstanceId = SAFE_CREATE_PAGE;
      importedIdentifier = CREATE_PAGE;
      break;
    case 'component':
      safeCreateInstanceId = SAFE_CREATE_COMPONENT;
      importedIdentifier = CREATE_COMPONENT;
      break;
  }

  traverse(ast, {
    Program(path) {
      const localIdentifier = t.identifier(safeCreateInstanceId);
      // Component(__create_component__(__class_def__));
      const args = [t.identifier(EXPORTED_DEF)];

      // import { createComponent as __create_component__ } from "/__helpers/component";
      const specifiers = [t.importSpecifier(localIdentifier, t.identifier(importedIdentifier))];
      if ((type === 'page' || type === 'component') && userDefineType === 'class') {
        specifiers.push(t.importSpecifier(
          t.identifier(SAFE_SUPER_COMPONENT),
          t.identifier(SUPER_COMPONENT)
        ));
      }

      if (Array.isArray(hooks)) {
        hooks.forEach(id => {
          specifiers.push(t.importSpecifier(t.identifier(id), t.identifier(id)));
        });
      }
      if (useCreateStyle) {
        specifiers.push(t.importSpecifier(
          t.identifier(SAFE_CREATE_STYLE),
          t.identifier(CREATE_STYLE)
        ));
      }

      let runtimeRelativePath = relative(targetFileDir, join(outputPath, RUNTIME));
      runtimeRelativePath = runtimeRelativePath[0] !== '.' ? './' + runtimeRelativePath : runtimeRelativePath;

      path.node.body.unshift(
        t.importDeclaration(
          specifiers,
          t.stringLiteral(runtimeRelativePath)
        )
      );

      // __create_component__(__class_def__, { events: ['_e*']})
      if (eventHandlers.length > 0) {
        args.push(
          t.objectExpression([
            t.objectProperty(t.identifier('events'), t.arrayExpression(eventHandlers.map(e => t.stringLiteral(e))))
          ])
        );
      }

      path.node.body.push(
        t.expressionStatement(
          t.callExpression(
            t.identifier(getConstructor(type)),
            [
              t.callExpression(
                t.identifier(safeCreateInstanceId),
                args
              )
            ],
          )
        )
      );
    },
  });
}

function removeRaxImports(ast) {
  traverse(ast, {
    ImportDeclaration(path) {
      if (t.isStringLiteral(path.node.source, { value: RAX_PACKAGE })) {
        path.remove();
      }
    },
  });
}

function removeDefaultImports(ast) {
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      path.remove();
    },
  });
}

function getReplacer(defaultExportedPath) {
  if (defaultExportedPath.parentPath.isExportDefaultDeclaration()) {
    /**
     * export default class {};
     */
    return defaultExportedPath.parentPath;
  } else if (defaultExportedPath.parentPath.isProgram()) {
    /**
     * class Foo {}
     * export default Foo;
     */
    return defaultExportedPath;
  } else if (defaultExportedPath.parentPath.isVariableDeclarator()) {
    /**
     * var Foo = class {}
     * export default Foo;
     */
    return defaultExportedPath.parentPath.parentPath;
  } else {
    return null;
  }
}

function collectHooks(root) {
  let ret = {};
  traverse(root, {
    CallExpression(path) {
      const { node } = path;
      if (t.isIdentifier(node.callee, { name: USE_STATE })
        || t.isIdentifier(node.callee, { name: USE_EFFECT })) {
        ret[node.callee.name] = true;
      }
    }
  });

  return Object.keys(ret);
}

function addUpdateData(dynamicValue, renderItemFunctions, renderFunctionPath) {
  const dataProperties = [];

  Object.keys(dynamicValue).forEach(name => {
    dataProperties.push(t.objectProperty(t.stringLiteral(name), dynamicValue[name]));
  });

  renderItemFunctions.map(renderItemFn => {
    dataProperties.push(t.objectProperty(t.stringLiteral(renderItemFn.name), renderItemFn.node));
  });

  const updateData = t.memberExpression(
    t.thisExpression(),
    t.identifier('_updateData')
  );

  const fnBody = renderFunctionPath.node.body.body;
  fnBody.push(t.expressionStatement(t.callExpression(updateData, [
    t.objectExpression(dataProperties)
  ])));
}

function addUpdateEvent(dynamicEvent, eventHandlers = [], renderFunctionPath) {
  const methodsProperties = [];
  dynamicEvent.forEach(({ name, value }) => {
    eventHandlers.push(name);
    methodsProperties.push(t.objectProperty(t.stringLiteral(name), value));
  });

  const updateMethods = t.memberExpression(
    t.thisExpression(),
    t.identifier('_updateMethods')
  );
  const fnBody = renderFunctionPath.node.body.body;

  fnBody.push(t.expressionStatement(t.callExpression(updateMethods, [
    t.objectExpression(methodsProperties)
  ])));
}

/**
 * For that alipay build folder can not contain `@`, escape to `_`.
 */
function normalizeFileName(filename) {
  return filename.replace(/@/g, '_');
}
