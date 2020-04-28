const t = require('@babel/types');
// Collect import specifiers
const specified = [];
const platformEnvValues = ['isMiniApp', 'isWeChatMiniProgram', 'isQuickApp', 'isByteDanceMicroApp'];
const platformMap = {
  ali: 'isMiniApp',
  wechat: 'isWeChatMiniProgram',
  quickapp: 'isQuickApp',
  bytedance: 'isByteDanceMicroApp'
};

function variableDeclarationMethod(name, value) {
  return t.variableDeclaration('const', [
    t.variableDeclarator(t.identifier(name), t.booleanLiteral(value))
  ]);
}

/**
 * Generate object expression
 *
 * @param  {string} platformName Set corresponding specified platform value to true
 * @return {objectExpression}
 * @example
 *   objectExpressionMethod('isMiniApp')
 *
 *   {
 *     isMiniApp: true,
 *     isWechatMiniProgram: false
 *   }
 */
function objectExpressionMethod(platformName) {
  const properties = [];

  Object.keys(platformMap).forEach(p => {
    properties.push(
      t.objectProperty(
        t.identifier(platformMap[p]),
        t.booleanLiteral(p === platformName)
      )
    );
  });

  return t.objectExpression(properties);
}

module.exports = function({ types: t }, { platform = 'ali' }) {
  return {
    name: 'platform-plugin',
    visitor: {
      Identifier: {
        exit(path) {
          const { node } = path;
          const parentPath = path.parentPath;
          if (parentPath.isImportSpecifier() || parentPath.isVariableDeclarator()) {
            return;
          }
          if (platformEnvValues.includes(node.name)) {
            if (node.name === platformMap[platform]) {
              path.replaceWith(t.identifier('true'));
            } else {
              path.replaceWith(t.identifier('false'));
            }
          }
        }
      },
      ImportDeclaration: {
        enter(path, { filename: name }) {
          const { node } = path;
          if (node.source.value === 'universal-env') {
            node.specifiers.forEach(spec => {
              if (spec.type === 'ImportNamespaceSpecifier') {
                specified.push({
                  local: spec.local.name,
                  imported: '*'
                });
              } else {
                specified.push({
                  local: spec.local.name,
                  imported: spec.imported.name
                });
              }
            });

            if (specified.length > 0) {
              specified.forEach(specObj => {
                if (specObj.imported === '*') {
                  path.insertAfter(
                    t.variableDeclaration('const', [
                      t.variableDeclarator(
                        t.identifier(specObj.local),
                        objectExpressionMethod(platform)
                      )
                    ])
                  );
                } else {
                  const newNodeInit =
                    specObj.imported === platformMap[platform];
                  let newNode = variableDeclarationMethod(
                    specObj.imported,
                    newNodeInit
                  );

                  path.insertAfter(newNode);

                  // Support custom alias import:
                  // import { isMiniApp as iw } from 'universal-env';
                  // const isMiniApp = true;
                  // const iw = true;
                  if (specObj.imported !== specObj.local) {
                    newNode = variableDeclarationMethod(
                      specObj.local,
                      newNodeInit
                    );
                    path.insertAfter(newNode);
                  }
                }
              });
            }
            path.remove();
          }
        }
      }
    }
  };
};
