const t = require('@babel/types');
const isClassComponent = require('../utils/isClassComponent');
const isFunctionComponent = require('../utils/isFunctionComponent');
const traverse = require('../utils/traverseNodePath');

const RAX_PACKAGE = 'rax';
const RAX_COMPONENT = 'Component';
const CREATE_COMPONENT = 'createComponent';
const SAFE_CREATE_COMPONENT = '__create_component__';
const EXPORTED_CLASS_DEF = '__class_def__';
const HELPER_COMPONENT = 'jsx2mp-runtime';

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

    // replace with class def.
    if (isFunctionComponent(defaultExportedPath)) {

    } else if (isClassComponent(defaultExportedPath)) {
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

    addComponentDefine(parsed.ast);
    removeRaxImports(parsed.ast);
  },
};

function addComponentDefine(ast) {
  traverse(ast, {
    Program(path) {
      const importedIdentifier = t.identifier(CREATE_COMPONENT);
      const localIdentifier = t.identifier(SAFE_CREATE_COMPONENT);

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
            t.identifier(RAX_COMPONENT),
            [
              t.callExpression(
                t.identifier(SAFE_CREATE_COMPONENT),
                [t.identifier(EXPORTED_CLASS_DEF)]
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
