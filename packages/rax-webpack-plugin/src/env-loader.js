import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import * as t from 'babel-types';
import generate from "babel-generator";
import loaderUtils from 'loader-utils';

/* eslint new-cap:false */

/**
 * remove universal-env module dependencies
 * convert to constant
 * then use babel-plugin-minify-dead-code-elimination remove the dead code
 *
 * @example
 *
 * ../evn-loader/lib/index?isWeex=true
 *
 * `import { isWeex, isWeb } from 'universal-env'`;
 *
 * after:
 *
 * ```
 * const isWeex = true;
 * const isWeb = false
 * ```
 */
module.exports = function(inputSource, inputSourceMap) {
  this.cacheable();
  var callback = this.async();

  const loaderOptions = loaderUtils.parseQuery(this.query);

  const options = Object.assign({ name: 'universal-env' }, loaderOptions);

  // 用于记录已导入的变量
  let specified; // { isWeex, isNode } 后续经过过滤只保留下对应的值

  function variableDeclarationMethod(name, value) {
    return t.VariableDeclaration(
      'const', [
        t.variableDeclarator(
          t.Identifier(name),
          t.BooleanLiteral(value)
        )
      ]
    );
  }

  var ast = babylon.parse(inputSource, {
    sourceType: 'module',
    plugins: [
      '*',
    ]
  });
  traverse(ast, {
    enter() {
      specified = new Array();
    },
    ImportDeclaration(path) {
      let { node } = path;

      if (options['isBundle'] !== true && node.source.value === options.name) {

        node.specifiers = node.specifiers.filter(spec => {
          specified.push({
            local: spec.local.name,
            imported: spec.imported.name
          });
          return false;
        });

        specified.forEach(specObj => {
          let newNodeInit = typeof options[specObj.imported] !== 'undefined' ?
            options[specObj.imported] : false;
          let newNode = variableDeclarationMethod(
            specObj.imported,
            newNodeInit
          );

          path.insertAfter(newNode);

          // alise case:
          // import { isWeex as iw } from 'universal-env';
          // const isWeex = true;
          // const iw = true;
          if (specObj.imported !== specObj.local) {
            newNode = variableDeclarationMethod(
              specObj.local,
              newNodeInit
            );
            path.insertAfter(newNode);
          }
        });

        if (node.specifiers.length === 0) {
          path.remove();
        }
      }
    }
  });

  const { code, map } = generate(ast, null, inputSource);

  callback(null, code, inputSourceMap);
};
