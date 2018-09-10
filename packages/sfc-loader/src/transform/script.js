const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const t = require('babel-types');
const babel = require('babel-core');

module.exports = (
  scriptContent,
  declarationName,
  sourceFilename,
  rawContent
) => {
  let ast;

  let decleared = false;

  try {
    ast = babylon.parse(scriptContent, {
      sourceType: 'module',
      sourceFilename
    });
  } catch (err) {
    console.log(scriptContent);
    throw new Error('Babylon parse error at transform script: ' + err.message);
  }

  let scopeIdentifiers = [];

  const definitions = {};
  const visitor = {
    Program(path) {
      if (path && path.scope && path.scope.bindings) {
        scopeIdentifiers = Object.keys(path.scope.bindings);
      }
    },
    ObjectMethod(path) {
      const { node } = path;
      if (path.parent.__topMark) {
        definitions[node.key.name] = true;
      }
    },
    ObjectProperty(path) {
      const { node } = path;
      if (path.parent.__topMark) {
        definitions[node.key.name] = true;
      }
    },
    ExportDefaultDeclaration(path) {
      const { node } = path;
      if (t.isObjectExpression(node.declaration)) {
        node.declaration.__topMark = true;
      }
      path.replaceWith(
        t.variableDeclaration('var', [
          // todo: feat 支持 module.exports 写法?
          t.variableDeclarator(t.identifier(declarationName), node.declaration)
        ])
      );
      decleared = true;
    }
  };

  traverse(ast, visitor);

  const defaultDeclarationCode = `const ${declarationName} = {};\n`;

  const { code, map } = generate(ast, { sourceMaps: true }, scriptContent);

  // 补充 source content
  for (let i = 0; i < map.sourcesContent.length; i++) {
    map.sourcesContent[i] = scriptContent; // readFileSync(resolve(map.sources[i]), 'utf-8');
  }

  // offset source
  const scriptIndex = rawContent.indexOf(scriptContent) || 0;
  const scriptBaseLine = rawContent.slice(0, scriptIndex).split(/\r?\n/g)
    .length;

  function visitExitState() {
    return {
      visitor: {
        Program(path, state) {
          const { scope } = path;
          if (!decleared) {
            path.pushContainer(
              'body',
              t.variableDeclaration('var', [
                t.variableDeclarator(
                  t.identifier(declarationName),
                  t.objectExpression([])
                )
              ])
            );
          }

          // 初始化 _global
          path.pushContainer(
            'body',
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.identifier(declarationName),
                  t.identifier('_global')
                ),
                t.objectExpression([])
              )
            )
          );

          Object.keys(scope.getAllBindings()).forEach(key => {
            path.pushContainer(
              'body',
              t.expressionStatement(
                t.assignmentExpression(
                  '=',
                  t.memberExpression(
                    t.memberExpression(
                      t.identifier(declarationName),
                      t.identifier('_global')
                    ),
                    t.stringLiteral(key),
                    true
                  ),
                  t.identifier(key)
                )
              )
            );
          });
        }
      }
    };
  }

  const { code: $code, map: $map } = babel.transformFromAst(ast, code, {
    // presets order from last to first
    presets: [require('babel-preset-env'), require('babel-preset-stage-0')],
    plugins: [visitExitState],
    inputSourceMap: map,
    sourceMaps: true
  });

  const declarationCode = $code || defaultDeclarationCode;

  $map.sources[0] += '.js';
  return {
    scopeIdentifiers,
    definitions,
    declarationCode,
    sourceMap: $map
  };
};
