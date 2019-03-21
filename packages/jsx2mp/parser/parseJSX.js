const t = require('@babel/types');
const Node = require('./Node');
const { generateCodeByExpression } = require('../codegen');
const { builtInTags } = require('../constant');

/**
 * Parse JSXElements to Node.
 * @param el {JSXElement|JSXText} Root el.
 * @return result {Node|String}
 */
function parseJSX(el) {
  if (t.isJSXElement(el)) {
    return parseJSXElement(el);
  } else if (t.isJSXText(el)) {
    return parseJSXText(el);
  } else if (t.isJSXExpressionContainer(el)) {
    // Expression interpolation in JSX.
    return parseJSXExpressionContainer(el);
  } else {
    console.warn('Can not parse', el);
    return null;
  }
}

/**
 * @param el {JSXElement}
 * @return {Node}
 */
function parseJSXElement(el) {
  const { children = [] } = el;
  const { attributes, name } = el.openingElement;
  if (t.isJSXMemberExpression(name)) {
    // TODO: 错误提示增强
    throw Error('JSXMemberExpression is not supported.');
  }

  const tagName = name.name;
  if (isCustomComponent(tagName)) {
    // Todo: handle with custom components.
  } else {
    return new Node(
      tagName,
      parseAttrs(attributes),
      children.map(parseJSX)
    );
  }
}

/**
 * @param el {JSXText}
 * @return {String}
 */
function parseJSXText(el) {
  return el.value;
}

/**
 * @param el
 * @return {String}
 * Example:
 *   {this.state.foo} -> '{{foo}}'
 */
function parseJSXExpressionContainer(el) {
  const { expression } = el;

  switch (expression.type) {
    case 'Identifier':
    case 'MemberExpression':
    {
      let code = generateCodeByExpression(expression);
      // Simple redirect props/state to miniapp's data scope.
      code = code.replace(/this\.(state|props)\./g, '');
      return '{{' + code + '}}';
    }

    case 'ConditionalExpression': {
      const { test, consequent, alternate } = expression;
      const ret = [];
      const consequentNode = parseJSX(consequent);
      consequentNode.attrs['a:if'] = generateCodeByExpression(test);
      ret.push(consequentNode);

      const alternateNode = parseJSX(alternate);
      alternateNode.attrs['a:else'] = true;
      ret.push(alternateNode);

      return ret;
    }
  }
}

/**
 * Convert JSXAttribute[] to k-v object.
 * @param attributes {Array<JSXAttribute>}
 *
 * Examples:
 *   1. <tag foo="bar" /> String Literial
 *   2. <tag foo={bar} /> Reference, consider function and props
 *   3. <tag foo={true} />  Literial with Boolean/Null/undefined
 *   4. <tag foo={{ a: 1 }} /> Object Literial
 *   5. <tag foo={() => {}} /> Function: NOT SUPPORT NOW
 *   6. <tag foo={foo ? '0' : '1'} /> Expressions
 *   7. <tag foo={(function(){ return 'foo' })()} /> Complex Expressions: NOT SUPPORT NOW
 *   ...more
 */
function parseAttrs(attributes) {
  const ret = {};
  if (!Array.isArray(attributes)) return ret;

  for (let i = 0, l = attributes.length; i < l; i ++) {
    const { name, value } = attributes[i];
    if (!t.isJSXIdentifier(name)) continue;

    // Normal attr.
    if (t.isStringLiteral(value)) {
      ret[name.name] = value.value;
    } else if (t.isJSXExpressionContainer(value)) {
      const { expression } = value;
      switch (expression.type) {
        case 'BooleanLiteral': {
          ret[name.name] = '{{' + expression.value + '}}'; break;
        }
        case 'NullLiteral': {
          ret[name.name] = '{{null}}'; break;
        }
        case 'Identifier': {
          // undefined is included.
          const id = expression.name.replace(/this.(state|props)\./, '');
          ret[name.name] = '{{' + id + '}}'; break;
        }
        case 'ObjectExpression': {
          ret[name.name] = '{' + generateCodeByExpression(expression, {
            retainLines: true,
          }).trim() + '}';
          break;
        }
        case 'MemberExpression': {
          let code = generateCodeByExpression(expression);
          if (/^on/.test(name.name)) {
            // Simple handle with onTap={this.xxx} -> onTap="xxx"
            code = code
              .replace(/this\./g, '');
          } else {
            code = code
              .replace(/this\.(props|state)\./g, '');
            code = '{{' + code + '}}';
          }

          ret[name.name] = code;
          break;
        }

        case 'BinaryExpression':
        case 'ConditionalExpression': {
          ret[name.name] = '{{' + generateCodeByExpression(expression, { retainLines: true }).trim() + '}}';
          break;
        }

        case 'CallExpression': {
          console.error('Calling function in JSX attribute is NOT supported yet.');
          break;
        }

        default: {
          console.warn('Not handled attr:', expression);
        }
      }
    }
  }

  return ret;
}

/**
 * Whether a tag name is built-in.
 * @param tagName {String}
 * @return {Boolean}
 */
function isCustomComponent(tagName) {
  return !builtInTags.has(tagName.toLowerCase());
}


module.exports = parseJSX;
