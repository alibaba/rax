/**************************************************
 * Created by kaili on 2019/5/16 下午6:08.
 **************************************************/
const t = require('@babel/types');
const babelGenerate = require('@babel/generator').default;
const isFunctionComponent = require('../../utils/isFunctionComponent');
const isClassComponent = require('../../utils/isClassComponent');
const traverse = require('../../utils/traverseNodePath');
const { buildJSXExpressionAst } = require('../../utils/astUtils');
const chalk = require('chalk');
const FULL_RETURN_AST = 'FULL_RETURN_AST';

module.exports = function RenderBuilder({ name, parse, generate }) {
  return {
    parse(parsed, code, options) {
      const { defaultExportedPath } = parsed;
      if (!defaultExportedPath) return;

      let returnPath = getReturnAstPath(defaultExportedPath);
      if (!returnPath) return;

      let renderAst = returnPath.node;
      console.log(chalk.yellow(`Loading Plugin:[${name}]........`));
      console.log(chalk.red(`Source Code:\n`));
      console.log(chalk.blue(babelGenerate(renderAst).code));
      // console.log(chalk.blue(generate(renderAst).code));
      parse(parsed, buildJSXExpressionAst(renderAst), returnPath);
      console.log(chalk.red(`Parsed Code:\n`));
      console.log(chalk.green(babelGenerate(renderAst).code));
    },
    generate(ret, parsed, options) {
      generate(ret, parsed, options);
    },
  };
};

/**
 * Get Function or Class Return JSX Ast
 * @param defaultExportedPath
 * @returns {*}
 */
function getReturnAstPath(defaultExportedPath) {
  if (isFunctionComponent(defaultExportedPath)) {
    return getReturnElementPath(defaultExportedPath);
  } else if (isClassComponent(defaultExportedPath)) {
    const renderFnPath = getRenderMethodPath(defaultExportedPath);
    if (!renderFnPath) return;
    return getReturnElementPath(renderFnPath);
  }
}

/**
 * Get reutrn statement element.
 */
function getReturnElementPath(path) {
  let result = null;

  traverse(path, {
    ReturnStatement: {
      exit(returnStatementPath) {
        result = returnStatementPath.get('argument');
      }
    },
  });

  return result;
}

/**
 * Get the render function path from class component declaration..
 * @param path {NodePath} A nodePath that contains a render function.
 * @return {NodePath} Path to render function.
 */
function getRenderMethodPath(path) {
  let renderMethodPath = null;

  traverse(path, {
    /**
     * Example:
     *   class {
     *     render() {}
     *   }
     */
    ClassMethod(classMethodPath) {
      const { node } = classMethodPath;
      if (t.isIdentifier(node.key, { name: 'render' })) {
        renderMethodPath = classMethodPath;
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
      // TODO: support class property defined render function.
    },
  });

  return renderMethodPath;
}
