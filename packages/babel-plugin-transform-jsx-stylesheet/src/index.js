import path from 'path';
import camelcase from 'camelcase';

const STYLE_SHEET_NAME = '_styleSheet';
const GET_STYLE_FUNC_NAME = '_getStyle';
const MERGE_STYLES_FUNC_NAME = '_mergeStyles';
const GET_CLS_NAME_FUNC_NAME = '_getClassName';
const NAME_SUFFIX = 'StyleSheet';
const cssSuffixs = ['.css', '.scss', '.sass', '.less', '.styl'];

export default function({ types: t, template }) {
  const mergeStylesFunctionTemplate = template(`
function ${MERGE_STYLES_FUNC_NAME}() {
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
  const getClassNameFunctionTemplate = template(`
function ${GET_CLS_NAME_FUNC_NAME}() {
  var className = [];
  var args = arguments[0];
  var type = Object.prototype.toString.call(args).slice(8, -1).toLowerCase();

  if (type === 'string') {
    args = args.trim();
    args && className.push(args);
  } else if (type === 'array') {
    args.forEach(function (cls) {
      cls = ${GET_CLS_NAME_FUNC_NAME}(cls).trim();
      cls && className.push(cls);
    });
  } else if (type === 'object') {
    for (var k in args) {
      k = k.trim();
      if (k && args.hasOwnProperty(k) && args[k]) {
        className.push(k);
      }
    }
  }

  return className.join(' ').trim();
}
  `);
  const getStyleFunctionTemplete = template(`
function ${GET_STYLE_FUNC_NAME}(classNameExpression) {
  var cache = ${STYLE_SHEET_NAME}.__cache || (${STYLE_SHEET_NAME}.__cache = {});
  var className = ${GET_CLS_NAME_FUNC_NAME}(classNameExpression);
  var classNameArr = className.split(/\\s+/);
  var style = cache[className];

  if (!style) {
    style = {};
    if (classNameArr.length === 1) {
      style = ${STYLE_SHEET_NAME}[classNameArr[0].trim()];
    } else {
      classNameArr.forEach(function(cls) {
        style = Object.assign(style, ${STYLE_SHEET_NAME}[cls.trim()]);
      });
    }
    cache[className] = style;
  }

  return style;
}
  `);

  const getClassNameFunctionAst = getClassNameFunctionTemplate();
  const mergeStylesFunctionAst = mergeStylesFunctionTemplate();
  const getStyleFunctionAst = getStyleFunctionTemplete();

  function getArrayExpression(value) {
    let expression;
    let str;

    if (!value || value.value === '') {
      // className
      // className=""
      return [];
    } else if (value.type === 'JSXExpressionContainer' && value.expression && typeof value.expression.value !== 'string') {
      // className={{ container: true }}
      // className={['container wrapper', { scroll: false }]}
      return [t.callExpression(t.identifier(GET_STYLE_FUNC_NAME), [value.expression])];
    } else {
      // className="container"
      // className={'container'}
      str = (value.expression ? value.expression.value : value.value).trim();
    }

    return str === '' ? [] : str.split(/\s+/).map((className) => {
      return template(`${STYLE_SHEET_NAME}["${className}"]`)().expression;
    });
  }

  function findLastImportIndex(body) {
    const bodyReverse = body.slice(0).reverse();
    let _index = 0;

    bodyReverse.some((node, index) => {
      if (node.type === 'ImportDeclaration') {
        _index = body.length - index - 1;
        return true;
      }
      return false;
    });

    return _index;
  }

  return {
    visitor: {
      Program: {
        exit({ node }, { file }) {
          const cssFileCount = file.get('cssFileCount');
          const injectGetStyle = file.get('injectGetStyle');
          const lastImportIndex = findLastImportIndex(node.body);
          let cssParamIdentifiers = file.get('cssParamIdentifiers');
          let callExpression;

          if (cssParamIdentifiers) {
            // only one css file
            if (cssParamIdentifiers.length === 1) {
              callExpression = t.variableDeclaration('var', [t.variableDeclarator(t.identifier(STYLE_SHEET_NAME), cssParamIdentifiers[0])]);
            } else if (cssParamIdentifiers.length > 1) {
              const objectAssignExpression = t.callExpression(t.identifier(MERGE_STYLES_FUNC_NAME), cssParamIdentifiers);
              callExpression = t.variableDeclaration('var', [t.variableDeclarator(t.identifier(STYLE_SHEET_NAME), objectAssignExpression)]);
            }

            node.body.splice(lastImportIndex + 1, 0, callExpression);

            if (injectGetStyle) {
              node.body.splice(lastImportIndex + 2, 0, getClassNameFunctionAst);
              node.body.splice(lastImportIndex + 3, 0, getStyleFunctionAst);
            }
          }

          if (cssFileCount > 1) {
            node.body.unshift(mergeStylesFunctionAst);
          }
        }
      },
      JSXOpeningElement({ container }, { file, opts }) {
        const { retainClassName = false } = opts;

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
          // Dont remove className
          if (!retainClassName) {
            // development env: change className to __class
            if (process.env.NODE_ENV === 'development' && classNameAttribute.name) {
              classNameAttribute.name.name = '__class';
            } else {
              // Remove origin className
              attributes.splice(attributes.indexOf(classNameAttribute), 1);
            }
          }

          if (
            classNameAttribute.value &&
            classNameAttribute.value.type === 'JSXExpressionContainer' &&
            typeof classNameAttribute.value.expression.value !== 'string' // not like className={'container'}
          ) {
            file.set('injectGetStyle', true);
          }

          const arrayExpression = getArrayExpression(classNameAttribute.value);

          if (arrayExpression.length === 0) {
            return;
          }

          if (hasStyleAttribute && styleAttribute.value) {
            let expression = styleAttribute.value.expression;
            let expressionType = expression.type;

            // style={[styles.a, styles.b]} ArrayExpression
            if (expressionType === 'ArrayExpression') {
              expression.elements = arrayExpression.concat(expression.elements);
            // style={styles.a} MemberExpression
            // style={{ height: 100 }} ObjectExpression
            // style={{ ...custom }} ObjectExpression
            // style={custom} Identifier
            // style={getStyle()} CallExpression
            // style={this.props.useCustom ? custom : null} ConditionalExpression
            // style={custom || other} LogicalExpression
            } else {
              styleAttribute.value.expression = t.arrayExpression(arrayExpression.concat(expression));
            }
          } else {
            let expression = arrayExpression.length === 1 ? arrayExpression[0] : t.arrayExpression(arrayExpression);
            attributes.push(t.jSXAttribute(t.jSXIdentifier('style'), t.jSXExpressionContainer(expression)));
          }
        }
      },
      ImportDeclaration({ node }, { file }) {
        const sourceValue = node.source.value;
        const extname = path.extname(sourceValue);
        const cssIndex = cssSuffixs.indexOf(extname);
        // Do not convert `import styles from './foo.css'` kind
        if (node.importKind !== 'value' && cssIndex > -1) {
          let cssFileCount = file.get('cssFileCount') || 0;
          let cssParamIdentifiers = file.get('cssParamIdentifiers') || [];
          const cssFileBaseName = camelcase(path.basename(sourceValue, extname));
          const styleSheetIdentifier = t.identifier(`${cssFileBaseName + NAME_SUFFIX}`);

          node.specifiers = [t.importDefaultSpecifier(styleSheetIdentifier)];
          cssParamIdentifiers.push(styleSheetIdentifier);
          cssFileCount++;

          file.set('cssParamIdentifiers', cssParamIdentifiers);
          file.set('cssFileCount', cssFileCount);
        }
      }
    }
  };
};
