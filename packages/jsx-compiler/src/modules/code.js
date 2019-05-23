const t = require('@babel/types');
const isClassComponent = require('../utils/isClassComponent');
const isFunctionComponent = require('../utils/isFunctionComponent');
const traverse = require('../utils/traverseNodePath');

const RAX_PACKAGE = 'rax';
const RAX_COMPONENT = 'Component';
const CREATE_COMPONENT = 'createComponent';
const CREATE_PAGE = 'createPage';
const SAFE_CREATE_COMPONENT = '__create_component__';
const SAFE_CREATE_PAGE = '__create_page__';
const EXPORTED_CLASS_DEF = '__class_def__';
const HELPER_COMPONENT = 'jsx2mp-runtime';

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

    // replace with class def.
    if (isFunctionComponent(defaultExportedPath)) {
      userDefineType = 'function';
    } else if (isClassComponent(defaultExportedPath)) {
      userDefineType = 'class';

      const { id, superClass, body, decorators } = defaultExportedPath.node;
      // @NOTE: Remove superClass due to useless of Component base class.
      defaultExportedPath.parentPath.replaceWith(
        t.variableDeclaration('var', [
          t.variableDeclarator(
            t.identifier(EXPORTED_CLASS_DEF),
            t.classExpression(id, null, body, decorators)
          )
        ])
      );
    }

    addComponentDefine(parsed.ast, options.type, userDefineType);
    removeRaxImports(parsed.ast);
  },
};

function addComponentDefine(ast, type, userDefineType) {
  const safeCreateInstanceId = t.identifier(type === 'page' ? SAFE_CREATE_PAGE : SAFE_CREATE_COMPONENT);

  traverse(ast, {
    Super(path) {
      const { parentPath } = path;
      parentPath.remove();
    },
    Program(path) {
      const importedIdentifier = t.identifier(type === 'page' ? CREATE_PAGE : CREATE_COMPONENT);
      const localIdentifier = safeCreateInstanceId;

      // import { createComponent as __create_component__ } from "/__helpers/component";
      path.node.body.unshift(
        t.importDeclaration(
          [t.importSpecifier(localIdentifier, importedIdentifier)],
          t.stringLiteral(HELPER_COMPONENT)
        )
      );

      // Component(__create_component__(__class_def__));
      path.node.body.push(
        t.expressionStatement(
          t.callExpression(
            t.identifier(getConstructor(type)),
            [
              t.callExpression(
                safeCreateInstanceId,
                [t.identifier(EXPORTED_CLASS_DEF), t.stringLiteral(userDefineType)]
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
