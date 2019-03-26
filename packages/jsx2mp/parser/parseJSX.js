const t = require('@babel/types');
const kebabCase = require('kebab-case');
const Node = require('./Node');
const findReturnElement = require('../transformer/findReturnElement');
const { generateCodeByExpression } = require('../codegen');
const { builtInTags } = require('../constant');

const parserAdapter = {
  if: 'a:if',
  else: 'a:else',
  elseif: 'a:elif',
  for: 'a:for',
  forItem: 'a:for-item',
  forIndex: 'a:for-index',
  key: 'a:key',
};

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
 * parseJSXElement
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
    const componentName = normalizeComponentName(tagName);
    return new Node(
      componentName,
      parseAttrs(attributes),
      children.map(parseJSX)
    );
  } else {
    return new Node(
      tagName,
      parseAttrs(attributes),
      children.map(parseJSX)
    );
  }
}

/**
 * parseJSXText
 * @param el {JSXText}
 * @return {String}
 */
function parseJSXText(el) {
  return el.value;
}

/**
 * parseJSXExpressionContainer
 * @param el
 * @return {String}
 * Example:
 *   {this.state.foo} -> '{{foo}}'
 */
function parseJSXExpressionContainer(el) {
  const { expression } = el;

  switch (expression.type) {
    case 'Identifier': {
      /**
       * Alia children to slot.
       */
      if (expression.name === 'children') {
        return new Node('slot');
      }
    } // else fall through.
    case 'MemberExpression':
    {
      // Simple redirect props/state to miniapp's data scope.
      const code = normalizeBindingIdentifier(generateCodeByExpression(expression));
      return '{{' + code + '}}';
    }

    case 'ConditionalExpression': {
      const { test, consequent, alternate } = expression;
      const ret = [];
      const consequentNode = parseJSX(consequent);
      consequentNode.attrs[parserAdapter.if] = generateCodeByExpression(test);
      ret.push(consequentNode);

      const alternateNode = parseJSX(alternate);
      alternateNode.attrs[parserAdapter.else] = true;
      ret.push(alternateNode);

      return ret;
    }

    case 'CallExpression': {
      const { callee, arguments: args } = expression;

      if (t.isMemberExpression(callee)) {
        if (t.isIdentifier(callee.property, { name: 'map' })) {
          // { foo.map(fn) }
          let childNode = null;
          if (t.isFunction(args[0])) {
            // { foo.map(() => {}) }
            const returnEl = t.isBlockStatement(args[0].body)
              // () => { return xxx }
              ? findReturnElement(args[0].body).node
              // () => (<jsx></jsx)
              : args[0].body;
            childNode = parseJSX(returnEl);
          } else if (t.isIdentifier(args[0]) || t.isMemberExpression(args[0])) {
            // { foo.map(this.xxx) }
          }
          return new Node(
            'block',
            { [parserAdapter.for]: generateCodeByExpression(callee.object) },
            [childNode]
          );
        } else {
          // { foo.method(args)

        }
      } else if (t.isIdentifier(callee)) {
        // { foo(args) }
      } else if (t.isFunction(callee)) {

      }
      break;
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
      ret[normalizeProp(name.name)] = value.value;
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
          const id = normalizeBindingIdentifier(expression.name);
          ret[normalizeProp(name.name)] = '{{' + id + '}}'; break;
        }
        case 'ObjectExpression': {
          ret[name.name] = '{' + generateCodeByExpression(expression, {
            retainLines: true,
          }).trim() + '}';
          break;
        }
        case 'MemberExpression': {
          let code = generateCodeByExpression(expression);
          let key = name.name;
          if (/^on/.test(name.name)) {
            // Simple handle with onTap={this.xxx} -> onTap="xxx"
            code = code
              .replace(/this\./g, '');
            key = normalizeEventName(key);
          } else {
            code = code
              .replace(/this\.(props|state)\./g, '');
            code = '{{' + code + '}}';
          }

          ret[key] = code;
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

/**
 * Get component name from imported identifier name.
 * @param tagName {String}
 */
function normalizeComponentName(tagName) {
  return kebabCase(tagName).replace(/^-/, '');
}

const propMapping = {
  className: 'class',
  key: 'a:key',
};
/**
 * Normalize prop, eg: className -> class
 * @param prop {String}
 */
function normalizeProp(prop) {
  if (propMapping.hasOwnProperty(prop)) {
    prop = propMapping[prop];
  }
  return prop;
}

/**
 * Normalize identifier binding, eg: this.state.foo -> foo
 * @param code {String}
 */
function normalizeBindingIdentifier(code) {
  return code.replace(/this.(state|props)\./, '');
}

const eventNameMapping = {
  onClick: 'onTap',
  onDblclick: 'onDoubleTap',
};
/**
 * Normalize event key.
 * @param eventName {String}
 */
function normalizeEventName(eventName) {
  if (eventNameMapping.hasOwnProperty(eventName)) {
    eventName = eventNameMapping[eventName];
  }
  return eventName;
}

module.exports = parseJSX;
