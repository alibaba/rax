const EMPTY_OBJECT = {};
const UNITLESS_NUMBER_PROPS = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridColumn: true,
  fontWeight: true,
  lineClamp: true,
  // We make lineHeight default is px that is diff with w3c spec
  // lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  // Weex only
  lines: true,
};

const VOID_ELEMENTS = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
};

const ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;',
};

const ESCAPE_REGEXP = /[&><"']/g;
const ESCAPE_TEST_REGEXP = /[&><"']/;
function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

function escapeText(text) {
  if (!ESCAPE_TEST_REGEXP.test(text)) {
    return text;
  }

  return String(text).replace(ESCAPE_REGEXP, escaper);
}

function merge(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

const UPPERCASE_REGEXP = /[A-Z]/g;
const NUMBER_REGEXP = /^[0-9]*$/;
const CSSPropCache = {};

function styleToCSS(style) {
  let css = '';
  // Use var avoid v8 warns "Unsupported phi use of const or let variable"
  for (var prop in style) {
    let val = style[prop];
    let unit = '';

    if (UNITLESS_NUMBER_PROPS[prop]) {
      // Noop
    } else if (typeof val === 'number' || typeof val === 'string' && NUMBER_REGEXP.test(val)) {
      unit = 'rem';
    }

    prop = CSSPropCache[prop] ? CSSPropCache[prop] : CSSPropCache[prop] = prop.replace(UPPERCASE_REGEXP, '-$&').toLowerCase();
    css = css + `${prop}:${val}${unit};`;
  }
  return css;
}

const updater = {
  setState(component, partialState, callback) {
    if (partialState) {
      if (!component._pendingState) {
        component._pendingState = partialState;
      } else {
        merge(component._pendingState, partialState);
      }
    }
  },
  forceState(component, callback) {
    // Noop
  }
};

function renderElementToString(element, context) {
  if (typeof element === 'string') {
    return escapeText(element);
  } else if (element == null || element === false || element === true) {
    return '<!-- empty -->';
  } else if (typeof element === 'number') {
    return String(element);
  } else if (Array.isArray(element)) {
    let html = '';
    for (var index = 0, length = element.length; index < length; index++) {
      var child = element[index];
      html = html + renderElementToString(child, context);
    }
    return html;
  }

  const type = element.type;

  if (type) {
    const props = element.props || EMPTY_OBJECT;

    if (type.prototype && type.prototype.render) {
      const instance = new type(props, context, updater); // eslint-disable-line new-cap

      let childContext;
      if (instance.getChildContext) {
        childContext = instance.getChildContext();
      }

      if (childContext) {
        // Why not use Object.assign? for better performance
        context = merge({}, context, childContext);
      }
      instance.context = context;

      if (instance.componentWillMount) {
        instance.componentWillMount();

        if (instance._pendingState) {
          const state = instance.state;
          const pending = instance._pendingState;

          if (state == null) {
            instance.state = pending;
          } else {
            for (var key in pending) {
              state[key] = pending[key];
            }
          }
          instance._pendingState = null;
        }
      }

      var renderedElement = instance.render();
      return renderElementToString(renderedElement, context);
    } else if (typeof type === 'function') {
      var renderedElement = type(props, context);
      return renderElementToString(renderedElement, context);
    } else if (typeof type === 'string') {
      const isVoidElement = VOID_ELEMENTS[type];
      let html = `<${type}`;
      let innerHTML;

      for (var prop in props) {
        var value = props[prop];

        if (prop === 'children') {
          // Ignore children prop
        } else if (prop === 'style') {
          html = html + ` style="${styleToCSS(value)}"`;
        } else if (prop === 'className') {
          html = html + ` class="${escapeText(value)}"`;
        } else if (prop === 'defaultValue') {
          if (!props.value) {
            html = html + ` value="${typeof value === 'string' ? escapeText(value) : value}"`;
          }
        } else if (prop === 'defaultChecked') {
          if (!props.checked) {
            html = html + ` checked="${value}"`;
          }
        } else if (prop === 'dangerouslySetInnerHTML') {
          innerHTML = value.__html;
        } else {
          if (typeof value === 'string') {
            html = html + ` ${prop}="${escapeText(value)}"`;
          } else if (typeof value === 'number') {
            html = html + ` ${prop}="${String(value)}"`;
          } else if (typeof value === 'boolean') {
            html = html + ` ${prop}`;
          }
        }
      }

      if (isVoidElement) {
        html = html + '>';
      } else {
        html = html + '>';
        var children = props.children;
        if (children) {
          if (Array.isArray(children)) {
            for (var i = 0, l = children.length; i < l; i++) {
              var child = children[i];
              html = html + renderElementToString(child, context);
            }
          } else {
            html = html + renderElementToString(children, context);
          }
        } else if (innerHTML) {
          html = html + innerHTML;
        }

        html = html + `</${type}>`;
      }

      return html;
    }
  } else {
    console.error(`renderToString: received an element that is not valid. (keys: ${Object.keys(element)})`);
  }
}

exports.renderToString = function renderToString(element) {
  return renderElementToString(element, EMPTY_OBJECT);
};
