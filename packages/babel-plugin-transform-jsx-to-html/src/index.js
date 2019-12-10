const esutils = require('esutils');
const t = require('@babel/types');

const KEY_FOR_HTML = '__html';
const KEY_FOR_ATTRS = '__attrs';
const TEMP_KEY_PREFIX = '__key_';

module.exports = function() {
  let keyIndex = 0;

  return {
    visitor: {
      JSXElement: {
        exit(path, file) {
          const openingPath = path.get('openingElement');
          const tag = openingPath.node.name;
          const tagName = tag.name;

          if (!t.react.isCompatTag(tagName)) {
            // This plugin may transform a normal child to be an array, which cause key validation in createElement failed.
            // So add a key for each child in non production env, to prevent key validation warning.
            if (process.env.NODE_ENV !== 'production') {
              const keyAttr = t.jsxAttribute(t.jsxIdentifier('key'), t.stringLiteral(TEMP_KEY_PREFIX + keyIndex ++));
              openingPath.node.attributes.unshift(keyAttr);
            }

            return;
          }

          let result = [];

          let html = '<' + tagName;

          let attrs = openingPath.node.attributes;
          if (attrs.length) {
            attrs = buildOpeningElementAttributes(attrs, file);
          } else {
            attrs = {};
          }

          const {
            staticAttrs,
            dynamicAttrs,
            innerHTML
          } = attrs;

          if (staticAttrs) {
            html = html + staticAttrs;
          }

          if (dynamicAttrs) {
            result.push(buildObject(KEY_FOR_HTML, t.stringLiteral(html)));
            result.push(buildObject(KEY_FOR_ATTRS, dynamicAttrs));
            html = '';
          }

          html = html + (openingPath.node.selfClosing && !innerHTML ? '/>' : '>');
          result.push(buildObject(KEY_FOR_HTML, t.stringLiteral(html)));
          html = '';

          if (innerHTML) {
            // {__html: 'First &middot; Second'}
            // structure of dangerouslySetInnerHTML is same as {KEY_FOR_HTML: xxx}
            pushResult(innerHTML, result);
          } else {
            const children = t.react.buildChildren(openingPath.parent);
            flattenChildren(children, result);
          }

          if (path.node.closingElement || innerHTML) {
            pushResult(t.stringLiteral('</' + tagName + '>'), result);
          }

          if (result && result.length) {
            path.replaceWith(t.arrayExpression(result));
          }
        }
      }
    }
  };
};

// flatten and push children to result
function flattenChildren(children, result) {
  for (var i = 0, l = children.length; i < l; i++) {
    let child = children[i];
    if (t.isArrayExpression(child)) {
      flattenChildren(child.elements, result);
    } else if (Array.isArray(child)) {
      flattenChildren(child, result);
    } else {
      pushResult(child, result);
    }
  }
}

// push value to result and merge sibling string
function pushResult(value, result) {
  const len = result.length;

  if (len) {
    const lastIdx = len - 1;
    const lastChild = result[lastIdx];

    if (isStringObject(lastChild)) {
      if (isStringObject(value)) {
        updateStringObject(lastChild, value.properties[0].value.value);
      } else if (t.isStringLiteral(value)) {
        updateStringObject(lastChild, value.value);
      } else {
        result.push(value);
      }
    } else if (t.isStringLiteral(value)) {
      result.push(buildObject(KEY_FOR_HTML, value));
    } else {
      result.push(value);
    }
  } else if (t.isStringLiteral(value)) {
    result.push(buildObject(KEY_FOR_HTML, value));
  } else {
    result.push(value);
  }
}

function isStringObject(obj) {
  return t.isObjectExpression(obj)
  && obj.properties[0]
  && obj.properties[0].key.name === '__html'
  && t.isStringLiteral(obj.properties[0].value);
};

function updateStringObject(obj, value) {
  obj.properties[0].value.value = obj.properties[0].value.value + value;
}

function buildObject(name, value) {
  let obj = t.objectProperty(t.identifier(name), value);
  return t.objectExpression([obj]);
}

/**
 * The logic for this is quite terse. It's because we need to
 * support spread elements. We loop over all attributes,
 * breaking on spreads, we then push a new object containing
 * all prior attributes to an array for later processing.
 *
 * based on babel-helper-builder-react-jsx
 */
function buildOpeningElementAttributes(attribs, file) {
  let staticAttrs = '';
  let dynamicAttrs;
  let innerHTML;

  let _props = [];
  const objs = [];

  const useBuiltIns = file.opts.useBuiltIns || false;
  if (typeof useBuiltIns !== 'boolean') {
    throw new Error(
      'transform-react-jsx currently only accepts a boolean option for ' +
        'useBuiltIns (defaults to false)',
    );
  }

  while (attribs.length) {
    const prop = attribs.shift();

    if (prop.name && prop.name.name === 'dangerouslySetInnerHTML') {
      innerHTML = prop.value.expression;
    } else if (t.isJSXSpreadAttribute(prop)) {
      _props = pushProps(_props, objs);
      objs.push(prop.argument);
    } else {
      if (t.isStringLiteral(prop.value)) {
        let name = prop.name.name;
        if (name === 'className') {
          name = 'class';
        }
        const value = prop.value.value.replace(/\n\s+/g, ' ');
        staticAttrs = staticAttrs + ' ' + name + '="' + value + '"';
      } else {
        _props.push(convertAttribute(prop));
      }
    }
  }

  pushProps(_props, objs);

  if (!objs.length) {
    // noop
  } else if (objs.length === 1) {
    // only one object
    dynamicAttrs = objs[0];
  } else {
    // looks like we have multiple objects
    if (!t.isObjectExpression(objs[0])) {
      objs.unshift(t.objectExpression([]));
    }

    const helper = useBuiltIns
      ? t.memberExpression(t.identifier('Object'), t.identifier('assign'))
      : file.addHelper('extends');

    // spread it
    dynamicAttrs = t.callExpression(helper, objs);
  }

  return {
    staticAttrs: staticAttrs,
    dynamicAttrs: dynamicAttrs,
    innerHTML: innerHTML
  };
}

function pushProps(_props, objs) {
  if (!_props.length) return _props;

  objs.push(t.objectExpression(_props));
  return [];
}

function convertAttributeValue(node) {
  if (t.isJSXExpressionContainer(node)) {
    return node.expression;
  } else {
    return node;
  }
}

function convertAttribute(node) {
  const value = convertAttributeValue(node.value || t.booleanLiteral(true));

  if (t.isStringLiteral(value) && !t.isJSXExpressionContainer(node.value)) {
    value.value = value.value.replace(/\n\s+/g, ' ');

    // "raw" JSXText should not be used from a StringLiteral because it needs to be escaped.
    if (value.extra && value.extra.raw) {
      delete value.extra.raw;
    }
  }

  if (t.isJSXNamespacedName(node.name)) {
    node.name = t.stringLiteral(
      node.name.namespace.name + ':' + node.name.name.name,
    );
  } else if (esutils.keyword.isIdentifierNameES6(node.name.name)) {
    node.name.type = 'Identifier';
  } else {
    node.name = t.stringLiteral(node.name.name);
  }

  return t.inherits(t.objectProperty(node.name, value), node);
}
