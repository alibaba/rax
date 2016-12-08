import * as babylon from 'babylon';
import traverse from 'babel-traverse';
import * as types from 'babel-types';
import generate from 'babel-generator';

/* eslint new-cap:false */

export default function traverseImport(options, inputSource) {
  let specified; // Collector import specifiers

  function variableDeclarationMethod(name, value) {
    return types.VariableDeclaration(
      'const', [
        types.variableDeclarator(
          types.Identifier(name),
          types.BooleanLiteral(value)
        )
      ]
    );
  }

  const platformMap = {
    weex: 'isWeex',
    web: 'isWeb',
    node: 'isNode',
    reactnative: 'isReactNative'
  }

  let ast = babylon.parse(inputSource, {
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

      if (node.source.value === options.name) {

        node.specifiers.forEach(spec => {
          specified.push({
            local: spec.local.name,
            imported: spec.imported.name
          });
        });

        let hasPlatformSpecified = false;

        specified.forEach(spec => {
          if (typeof platformMap[options.platform] !== 'undefined') {
            hasPlatformSpecified = true;
          }
        });

        if (hasPlatformSpecified) {
          specified.forEach(specObj => {

            let newNodeInit = specObj.imported === platformMap[options.platform] ?
              true : false;
            let newNode = variableDeclarationMethod(
              specObj.imported,
              newNodeInit
            );

            path.insertAfter(newNode);

            // Support custom alise import:
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

          path.remove();
        }
      }
    }
  });

  return generate(ast, null, inputSource);
};
