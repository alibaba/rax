const t = require('@babel/types');
const isClassComponent = require('../utils/isClassComponent');
const isFunctionComponent = require('../utils/isFunctionComponent');
const traverse = require('../utils/traverseNodePath');

const RAX_PACKAGE = 'rax';
const SUPER_COMPONENT = 'Component';

const CREATE_APP = 'createApp';
const CREATE_COMPONENT = 'createComponent';
const CREATE_PAGE = 'createPage';

const SAFE_SUPER_COMPONENT = '__component__';
const SAFE_CREATE_APP = '__create_app__';
const SAFE_CREATE_COMPONENT = '__create_component__';
const SAFE_CREATE_PAGE = '__create_page__';

const EXPORTED_DEF = '__def__';
const RUNTIME = 'jsx2mp-runtime';

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
    const { defaultExportedPath } = parsed;
    let userDefineType;

    if (options.type === 'app') {
      userDefineType = 'class';
      const { id, superClass, body, decorators } = defaultExportedPath.node;
      defaultExportedPath.parentPath.replaceWith(
        t.variableDeclaration('var', [
          t.variableDeclarator(
            t.identifier(EXPORTED_DEF),
            t.classExpression(id, superClass, body, decorators)
          )
        ])
      );
    } else if (isFunctionComponent(defaultExportedPath)) { // replace with class def.
      userDefineType = 'function';
      const { id, generator, async, params, body } = defaultExportedPath.node;
      defaultExportedPath.parentPath.replaceWith(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier(EXPORTED_DEF),
            t.functionExpression(id, params, body, generator, async)
          )
        ])
      );
    } else if (isClassComponent(defaultExportedPath)) {
      userDefineType = 'class';

      const { id, superClass, body, decorators } = defaultExportedPath.node;
      // @NOTE: Remove superClass due to useless of Component base class.
      defaultExportedPath.parentPath.replaceWith(
        t.variableDeclaration('const', [
          t.variableDeclarator(
            t.identifier(EXPORTED_DEF),
            t.classExpression(id, t.identifier(SAFE_SUPER_COMPONENT), body, decorators)
          )
        ])
      );
    }

    addDefine(parsed.ast, options.type, userDefineType);
    removeRaxImports(parsed.ast);
  },
};

function addDefine(ast, type, userDefineType) {
  let safeCreateInstanceId;
  let importedIdentifier;
  switch (type) {
    case 'app':
      safeCreateInstanceId = SAFE_CREATE_APP;
      importedIdentifier = CREATE_APP;
      break;
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
    Super(path) {
      const { parentPath } = path;
      parentPath.remove();
    },
    Program(path) {
      const localIdentifier = t.identifier(safeCreateInstanceId);

      // import { createComponent as __create_component__ } from "/__helpers/component";
      const specifiers = [t.importSpecifier(localIdentifier, t.identifier(importedIdentifier))];
      if ((type === 'page' || type === 'component') && userDefineType === 'class') {
        specifiers.push(t.importSpecifier(
          t.identifier(SAFE_SUPER_COMPONENT),
          t.identifier(SUPER_COMPONENT)
        ));
      }
      path.node.body.unshift(
        t.importDeclaration(
          specifiers,
          t.stringLiteral(RUNTIME)
        )
      );

      // Component(__create_component__(__class_def__));
      path.node.body.push(
        t.expressionStatement(
          t.callExpression(
            t.identifier(getConstructor(type)),
            [
              t.callExpression(
                t.identifier(safeCreateInstanceId),
                [t.identifier(EXPORTED_DEF)]
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
