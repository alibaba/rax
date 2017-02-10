const CLASS_NAME_SPACE = 'class_name_styles';

export default function({ types: t }) {
  function getMemberExpression(str = str.trim()) {
    let classNames = str.split(' ');

    if (str === '') {
      return [];
    }
    return classNames.map((className) => {
      className = className.replace(/-/g, '_');
      return t.memberExpression(t.identifier(CLASS_NAME_SPACE), t.identifier(className));
    });
  }
  return {
    visitor: {
      // parse jsx className
      JSXAttribute({ node }) {
        let attributeName = node.name.name;
        if (attributeName === 'className' || attributeName === 'class') {
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
        let cssParamIdentifiers;
        let cssFileCount;

        if (cssIndex > 0) {
          cssFileCount = file.get('cssFileCount') || 1;

          const styleName = `${CLASS_NAME_SPACE + cssFileCount}`;
          const styleIdentifier = t.identifier(styleName);
          node.specifiers = [t.importDefaultSpecifier(styleIdentifier)];

          cssParamIdentifiers = file.get('cssParamIdentifiers') || [];
          cssParamIdentifiers.push(styleIdentifier);
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
            callExpression = t.variableDeclaration('let', [t.variableDeclarator(t.identifier(CLASS_NAME_SPACE), cssParamIdentifiers[0])]);
          } else if (cssParamIdentifiers.length > 1) {
            const objectAssignExpression = t.callExpression(t.memberExpression(t.identifier('Object'), t.identifier('assign')), cssParamIdentifiers);
            callExpression = t.variableDeclaration('let', [t.variableDeclarator(t.identifier(CLASS_NAME_SPACE), objectAssignExpression)]);
          }

          // append class declaration
          parent.body.splice(classIndex + 1, 0, callExpression);
        }
      }
    }
  };
};

