import path from 'path';
import camelcase from 'camelcase';

const STYLE_SHEET_NAME = '_styleSheet';
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

  function getArrayExpression(str = str.trim()) {
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
      JSXOpeningElement({ container }, { file }) {
        const cssFileCount = file.get('cssFileCount') || 0;
        if (cssFileCount < 1) {
          return;
        }

        // Check if has "style"
        let hasStyleAttribute = false;
        let styleAttribute;
        let hasClassName = false;
        let classNameAttribute;

        const attributes = container.openingElement.attributes;
        for (let i = 0; i < attributes.length; i++) {
          const name = attributes[i].name;
          if (name) {
            if (!hasStyleAttribute) {
              hasStyleAttribute = name.name === 'style';
              styleAttribute = hasStyleAttribute && attributes[i];
            }

            if (!hasClassName) {
              hasClassName = name.name === 'className';
              classNameAttribute = hasClassName && attributes[i];
            }
          }
        }


        if (hasClassName) {

          // Remove origin className
          attributes.splice(attributes.indexOf(classNameAttribute), 1);

          const arrayExpression = getArrayExpression(classNameAttribute.value.value);

          if (arrayExpression.length === 0) {
            return;
          }

          if (hasStyleAttribute) {
            let expression = styleAttribute.value.expression;
            let expressionType = expression.type;
            if (expressionType === 'ArrayExpression') {
              expression.elements = arrayExpression.concat(expression.elements);
            } else if (expressionType === 'MemberExpression') {
              styleAttribute.value.expression = t.arrayExpression(arrayExpression.concat(expression));
            }
          } else {
            let expression = arrayExpression.length === 1 ? arrayExpression[0] : t.arrayExpression(arrayExpression);
            attributes.push(t.jSXAttribute('style', t.jSXExpressionContainer(expression)));
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
