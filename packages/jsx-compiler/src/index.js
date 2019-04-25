const { resolve, extname, relative } = require('path');
const { existsSync, readFileSync } = require('fs-extra');
const { default: traverse, NodePath } = require('@babel/traverse');
const t = require('@babel/types');
const isClassComponent = require('./utils/isClassComponent');
const isFunctionComponent = require('./utils/isFunctionComponent');
const { generateElement, generateCodeByExpression } = require('./codegen');
const { parse } = require('./parser');
const kebabCase = require('kebab-case');
const parseRender = require('./parser/parseRender');
const {
  RAX_COMPONENT,
  CREATE_COMPONENT,
  SAFE_CREATE_COMPONENT,
  EXPORTED_CLASS_DEF,
  HELPER_RUNTIME,
  RAX_PACKAGE
} = require('./constant');

/**
 * JSX Compiler
 * transform JSX DSL to Parts.
 */
function transform(code, options = {}) {
  const { filePath, rootContext } = options;
  const ast = parse(code);
  // const customComponents = getCustomComponents(ast, { filePath, rootContext });
  const style = getStyle(ast, { filePath });
  const { template, node } = getTemplate(ast);
  const jsCode = getComponentJSCode(ast);

  return {
    template,
    templateNode: node,
    jsCode,
    // customComponents,
    dependencies: {
      'View': {}
    },
    style,
  };
}

/**
 * Get axml template from babel AST.
 * @param ast {ASTElement} Babel AST structure.
 */
function getTemplate(ast) {
  let template = '';
  let node = null;
  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const declarationPath = path.get('declaration');
      if (isClassComponent(declarationPath)) {
        const renderFnPath = getRenderMethod(declarationPath);
        if (renderFnPath) {
          // Rule restrict: allow one return statement.
          const [, error] = renderFnPath.node.body.body.filter(s => t.isReturnStatement(s));
          if (error) {
            // TODO: 报错需要带文件和行列信息
            throw Error( 'Only one return is allow in render method.');
          }

          const returnNode = node = parseRender(renderFnPath);
          template = generateElement(returnNode);

          // Remove render method at last.
          renderFnPath.remove();
        }
      } else if (isFunctionComponent(declarationPath)) {
        const returnStatementPath = node = getReturnStatement(declarationPath);
        template = generateElement(returnStatementPath.node);

        // Remove render method at last.
        returnStatementPath.remove();
      } else {
        // throw Error('Can not find default export in file.');
      }
    },
  });

  return { template, node };
}

/**
 * Get the render function in class component.
 * @param path {NodePath} A nodePath that contains a render function.
 * @return {NodePath} Path to render function.
 */
function getRenderMethod(path) {
  const { node, scope } = path;
  if (t.isIdentifier(node)) {
    const binding = scope.getBinding(node.name);
    if (t.isVariableDeclarator(binding.path.node)) {
      return getRenderMethod(binding.path.get('init'));
    } else {
      return getRenderMethod(binding.path);
    }
  } else {
    let renderMethod = null;
    path.traverse({
      /**
       * Example:
       *   class {
       *     render() {}
       *   }
       */
      ClassMethod(classMethodPath) {
        const { node } = classMethodPath;

        if (t.isIdentifier(node.key, { name: 'render' })) {
          renderMethod = classMethodPath;
        }
      },
      /**
       * Example:
       *   class {
       *     render = function() {}
       *     render = () => {}
       *   }
       */
      ClassProperty(path) {
        // TODO: Unsupported.
      },
    });

    return renderMethod;
  }
}

/**
 * Get the render return statement in function component..
 * @param path {NodePath} A nodePath that contains a render return.
 * @return {NodePath} Path to return statement.
 */
function getReturnStatement(path) {
  if (t.isIdentifier(node)) {
    const binding = scope.getBinding(node.name);
    if (t.isVariableDeclarator(binding.path.node)) {
      return getReturnStatement(binding.path.get('init'));
    } else {
      return getReturnStatement(binding.path);
    }
  } else {
    let returnStatementPath = null;
    path.traverse({
      ReturnStatement: {
        exit(path) {
          returnStatementPath = path;
        }
      }
    });
    return returnStatementPath;
  }
}

/**
 * Get miniapp component js code from babel AST.
 * @param ast {ASTElement} Babel AST structure.
 * @return {String} Miniapp component js code.
 */
function getComponentJSCode(ast) {
  let delayToRemovePath;
  traverse(ast, {
    /**
     * 1. Add import declaration of helper lib.
     * 2. Rename scope's Component to other id.
     * 3. Add Component call expression.
     * 4. Transform 'rax' to 'rax/dist/rax.min.js' in case of 小程序开发者工具 not support `process`.
     */
    Program(path) {
      const importedIdentifier = t.identifier(CREATE_COMPONENT);
      const localIdentifier = t.identifier(SAFE_CREATE_COMPONENT);

      // import { createComponent as __create_component__ } from "jsx2mp-runtime";
      path.node.body.unshift(
        t.importDeclaration(
          [t.importSpecifier(localIdentifier, importedIdentifier)],
          t.stringLiteral(HELPER_RUNTIME)
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

    ImportDeclaration(path) {
      if (t.isStringLiteral(path.node.source, { value: RAX_PACKAGE })) {
        delayToRemovePath = path;
      }
    },

    ExportDefaultDeclaration(path) {
      const declarationPath = path.get('declaration');
      if (isClassComponent(declarationPath)) {
        const { id, body, decorators } = declarationPath.node;
        path.replaceWith(
          t.variableDeclaration('var', [
            t.variableDeclarator(
              t.identifier(EXPORTED_CLASS_DEF),
              t.classExpression(id, null, body, decorators)
            )
          ])
        );
      }
    },
  });

  if (delayToRemovePath) delayToRemovePath.remove();

  return generateCodeByExpression(ast);
}

/**
 * Get style content from import declaration.
 * @param ast
 * @param filePath
 * @return {string}
 */
function getStyle(ast, { filePath }) {
  let ret = '';
  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      const { source } = node;
      let currentFilePath = filePath;
      currentFilePath = resolve(currentFilePath, '..', source.value);
      if (extname(currentFilePath) === '.css'
        || existsSync(currentFilePath = currentFilePath + '.css')) {
        ret += readFileSync(currentFilePath, 'utf-8');
        // Remove import declaration, for 小程序开发工具 not support import a css file.
        path.remove();
      }
    },
  });
  return ret;
}

module.exports = transform;
