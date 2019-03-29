const t = require('@babel/types');
const { resolve, extname, relative } = require('path');
const { existsSync, readFileSync } = require('fs-extra');
const kebabCase = require('kebab-case');
const { default: traverse, NodePath } = require('@babel/traverse');
const isJSXClassDeclaration = require('./isJSXClassDeclaration');
const { parse, parseElement } = require('../parser');
const findReturnElement = require('./findReturnElement');
const { generateElement, generateCodeByExpression } = require('../codegen');
const {
  RAX_COMPONENT,
  SAFE_RAX_COMPONENT,
  CREATE_COMPONENT,
  SAFE_CREATE_COMPONENT,
  EXPORTED_CLASS_DEF,
  HELPER_COMPONENT
} = require('../constant');

/**
 * Seperate JSX code into parts.
 * @param code {String} JSX Code.
 * @param options {Object} Options.
 * @return result {JSXParts}
 */
function transformJSX(code, options = {}) {
  const { filePath, rootContext } = options;
  const ast = parse(code);
  const customComponents = getCustomComponents(ast, { filePath, rootContext });
  const style = getStyle(ast, { filePath });
  const template = getTemplate(ast);
  const jsCode = getComponentJSCode(ast);
  return {
    template,
    jsCode,
    customComponents,
    style,
  };
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
      filePath = resolve(filePath, '..', source.value);
      if (extname(filePath) === '.css' || existsSync(filePath = filePath + '.css')) {
        ret += readFileSync(filePath, 'utf-8');
        // Remove import declaration, for 小程序开发工具 not support import a css file.
        path.remove();
      }
    },
  });
  return ret;
}

function getCustomComponents(ast, { filePath, rootContext }) {
  /**
   * The mapping of custom components.
   * {
   *   "CustomBottom": "/component/CustomBottom.jsx"
   * }
   */
  const ret = {};

  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      const { source, specifiers } = node;
      if (specifiers.length > 0) {
        const name = specifiers[0].local.name;
        let jsxFilePath = resolve(filePath, '..', source.value);
        if (extname(jsxFilePath) === '.jsx' || existsSync(jsxFilePath = jsxFilePath + '.jsx')) {
          let absModulePath = relative(rootContext, jsxFilePath);
          absModulePath = absModulePath.slice(0, -extname(absModulePath).length);
          // Rebase import module path.
          source.value = '/' + absModulePath;

          ret[name] = {
            filePath: jsxFilePath,
            tagName: normalizeComponentName(name),
            name,
          };
        }
      }
    },
  });

  return ret;
}

/**
 * Get axml template from babel AST.
 * @param ast {ASTElement} Babel AST structure.
 * @return {String} Template in axml format.
 */
function getTemplate(ast) {
  let template = '';
  traverse(ast, {
    ClassDeclaration(classDeclarationPath) {
      if (isJSXClassDeclaration(classDeclarationPath)) {
        // Todo: parse render function content
        const renderPath = getRenderMethod(classDeclarationPath);
        if (renderPath) {
          // Rule restrict: allow one return statement.
          const [, error] = renderPath.node.body.body.filter(s => t.isReturnStatement(s));
          if (error) {
            // TODO: 报错需要带文件和行列信息
            throw Error( 'Only one return is allow in render method.');
          }

          const renderBody = renderPath.get('body');
          const returnElement = findReturnElement(renderBody).node;
          // Not only support JSXElement, but also support Number|String|Array
          if (isSupportTransfrom(returnElement)) {
            const node = parseElement(returnElement);
            template = generateElement(node);
          } else {
            throw new Error('Render method only return JSXElement.');
          }

          // Remove render method path at last.
          renderPath.remove();
        }
      }
    },
  });

  return template;
}

/**
 * Get the render function.
 * @param path {NodePath} A nodePath that contains a render function.
 * @return {NodePath} Path to render function.
 */
function getRenderMethod(path) {
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
      // TODO: support border cases.
    },
  });

  return renderMethod;
}

/**
 * Get miniapp component js code from babel AST.
 * @param ast {ASTElement} Babel AST structure.
 * @return {String} Miniapp component js code.
 */
function getComponentJSCode(ast) {
  traverse(ast, {
    /**
     * 1. Add import declaration of helper lib.
     * 2. Rename scope's Component to other id.
     * 3. Add Component call expression.
     */
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

      // Rename Component ref.
      if (path.scope.hasBinding(RAX_COMPONENT)) {
        // Add __ as safe prefix to avoid scope binding duplicate.
        path.scope.rename(RAX_COMPONENT, SAFE_RAX_COMPONENT);
      }

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

    ExportDefaultDeclaration(path) {
      const declarationPath = path.get('declaration');
      if (isJSXClassDeclaration(declarationPath)) {
        const { id, superClass, body, decorators } = declarationPath.node;
        path.replaceWith(
          t.variableDeclaration('var', [
            t.variableDeclarator(
              t.identifier(EXPORTED_CLASS_DEF),
              t.classExpression(id, superClass, body, decorators)
            )
          ])
        );
      }
    }
  });

  return generateCodeByExpression(ast);
}

function normalizeComponentName(tagName) {
  return kebabCase(tagName).replace(/^-/, '');
}

function isSupportTransfrom(el) {
  const typeCheckMethods = [
    'isJSXElement',
    'isStringLiteral',
    'isNumericLiteral',
    'isArrayExpression'
  ];
  return typeCheckMethods.some(method => t[method](el));
}

exports.transformJSX = transformJSX;
