import path from 'path';
import camelcase from 'camelcase';

const STYLE_SHEET_NAME = 'styleSheet';
const NAME_SUFFIX = 'StyleSheet';

export default function({ types: t, template }) {
  const mergeStylesFunctionTemplate = template(`
function _mergeStyles() {
  var newTarget = {};

  for (var index = 0; index < arguments.length; index++) {
    var target = arguments[index];

    for (var key in target) {
      newTarget[key] = Object.assign(newTarget[key] || {}, target[key]);
    }
  }

  return newTarget;
}
  `);
  const mergeStylesFunctionAst = mergeStylesFunctionTemplate();

  function getMemberExpression(str = str.trim()) {
    if (str === '') {
      return [];
    }

    return str.split(/\s+/).map((className) => {
      return template(`${STYLE_SHEET_NAME}["${className}"]`)().expression;
    });
  }

  return {
    visitor: {
      Program: {
        exit({ node }, { file }) {
          const cssFileCount = file.get('cssFileCount');
          if (cssFileCount > 1) {
            node.body.unshift(mergeStylesFunctionAst);
          }
        }
      },
      // parse jsx className
      JSXAttribute({ node }, { file }) {

        const cssFileCount = file.get('cssFileCount') || 0;
        if (cssFileCount < 1) {
          return;
        }

        let attributeName = node.name.name;
        if (attributeName === 'className') {
          const arrayExpression = getMemberExpression(node.value.value);

          if (arrayExpression.length === 0) {
            return;
          }

          node.name.name = 'style';
          node.value.type = 'JSXExpressionContainer';

          if (arrayExpression.length === 1) {
            node.value.expression = arrayExpression[0];
          } else {
            node.value.expression = t.arrayExpression(arrayExpression);
          }
        }
      },
      ImportDeclaration({ node }, { file }) {
        const sourceValue = node.source.value;
        const cssIndex = sourceValue.indexOf('.css');
        // Do not convert `import styles from './foo.css'` kind
        if (node.importKind !== 'value' && cssIndex > 0) {
          let cssFileCount = file.get('cssFileCount') || 0;
          let cssParamIdentifiers = file.get('cssParamIdentifiers') || [];
          const cssFileBaseName = camelcase(path.basename(sourceValue, '.css'));
          const styleSheetIdentifier = t.identifier(`${cssFileBaseName + NAME_SUFFIX}`);

          node.specifiers = [t.importDefaultSpecifier(styleSheetIdentifier)];
          cssParamIdentifiers.push(styleSheetIdentifier);
          cssFileCount++;

          file.set('cssParamIdentifiers', cssParamIdentifiers);
          file.set('cssFileCount', cssFileCount);
        }
      },
      ClassDeclaration({ parent, node }, { file }) {
        const classIndex = parent.body.indexOf(node);
        let cssParamIdentifiers = file.get('cssParamIdentifiers');
        let callExpression;

        if (cssParamIdentifiers) {
          // only one css file
          if (cssParamIdentifiers.length === 1) {
            callExpression = t.variableDeclaration('const', [t.variableDeclarator(t.identifier(STYLE_SHEET_NAME), cssParamIdentifiers[0])]);
          } else if (cssParamIdentifiers.length > 1) {
            const objectAssignExpression = t.callExpression(t.identifier('_mergeStyles'), cssParamIdentifiers);
            callExpression = t.variableDeclaration('const', [t.variableDeclarator(t.identifier(STYLE_SHEET_NAME), objectAssignExpression)]);
          }

          // append class declaration
          parent.body.splice(classIndex + 1, 0, callExpression);
        }
      }
    }
  };
};
