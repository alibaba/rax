import { shared } from 'rax';

const EMPTY_OBJECT = {};
const TRUE = true;
const UNITLESS_NUMBER_PROPS = {
  animationIterationCount: TRUE,
  borderImageOutset: TRUE,
  borderImageSlice: TRUE,
  borderImageWidth: TRUE,
  boxFlex: TRUE,
  boxFlexGroup: TRUE,
  boxOrdinalGroup: TRUE,
  columnCount: TRUE,
  flex: TRUE,
  flexGrow: TRUE,
  flexPositive: TRUE,
  flexShrink: TRUE,
  flexNegative: TRUE,
  flexOrder: TRUE,
  gridRow: TRUE,
  gridColumn: TRUE,
  fontWeight: TRUE,
  lineClamp: TRUE,
  lineHeight: TRUE,
  opacity: TRUE,
  order: TRUE,
  orphans: TRUE,
  tabSize: TRUE,
  widows: TRUE,
  zIndex: TRUE,
  zoom: TRUE
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

const DEFAULT_STYLE_OPTIONS = {
  defaultUnit: 'px',
  viewportWidth: 750,
  unitPrecision: 5
};
const UPPERCASE_REGEXP = /[A-Z]/g;
const NUMBER_REGEXP = /^[0-9]*$/;
const CSSPropCache = {};

function styleToCSS(style, options = {}) {
  let css = '';

  if (Array.isArray(style)) {
    style = style.reduce((prev, curr) => Object.assign(prev, curr), {});
  }

  // Use var avoid v8 warns "Unsupported phi use of const or let variable"
  for (var prop in style) {
    let val = style[prop];
    let unit = '';

    if (typeof val === 'number' && UNITLESS_NUMBER_PROPS[prop]) {
      // Noop
    } else if (typeof val === 'number' || typeof val === 'string' && NUMBER_REGEXP.test(val)) {
      unit = options.defaultUnit;
    }

    if (typeof val === 'string' && val.indexOf('rpx') > -1 || unit === 'rpx') {
      val = rpx2vw(val, options);
      unit = val === 0 ? '' : 'vw';
    }

    prop = CSSPropCache[prop] ? CSSPropCache[prop] : CSSPropCache[prop] = prop.replace(UPPERCASE_REGEXP, '-$&').toLowerCase();
    css = css + `${prop}:${val}${unit};`;
  }
  return css;
}

function rpx2vw(val, opts) {
  const pixels = parseFloat(val);
  const vw = pixels / opts.viewportWidth * 100;
  const parsedVal = parseFloat(vw.toFixed(opts.unitPrecision));

  return parsedVal;
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

/**
 * Functional Reactive Component Class Wrapper
 */
class ReactiveComponent {
  constructor(pureRender) {
    // A pure function
    this._render = pureRender;
    this._hookID = 0;
    this._hooks = {};
    // Handles store
    this.didMount = [];
    this.didUpdate = [];
    this.willUnmount = [];
  }

  getHooks() {
    return this._hooks;
  }

  getHookID() {
    return ++this._hookID;
  }

  readContext(context) {
    const Provider = context.Provider;
    const contextProp = Provider.contextProp;
    return this.context[contextProp] ? this.context[contextProp].value : Provider.defaultValue;
  }

  render() {
    this._hookID = 0;

    let children = this._render(this.props, this.context);

    return children;
  }
}

function renderElementToString(element, context, options) {
  if (typeof element === 'string') {
    return escapeText(element);
  } else if (element == null || element === false || element === true) {
    return '<!-- _ -->';
  } else if (typeof element === 'number') {
    return String(element);
  } else if (Array.isArray(element)) {
    let html = '';
    for (var index = 0, length = element.length; index < length; index++) {
      var child = element[index];
      html = html + renderElementToString(child, context, options);
    }
    return html;
  }

  const type = element.type;

  if (type) {
    const props = element.props || EMPTY_OBJECT;
    if (type.prototype && type.prototype.render) {
      const instance = new type(props, context, updater); // eslint-disable-line new-cap
      let currentContext = instance.context = context;

      let childContext;
      if (instance.getChildContext) {
        childContext = instance.getChildContext();
      }

      if (childContext) {
        // Why not use Object.assign? for better performance
        currentContext = merge({}, context, childContext);
      }

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
      return renderElementToString(renderedElement, currentContext, options);
    } else if (typeof type === 'function') {
      const instance = new ReactiveComponent(type);
      instance.props = props;
      instance.context = context;

      shared.Host.owner = {
        _instance: instance
      };

      const renderedElement = instance.render();
      return renderElementToString(renderedElement, context, options);
    } else if (typeof type === 'string') {
      const isVoidElement = VOID_ELEMENTS[type];
      let html = `<${type}`;
      let innerHTML;

      for (var prop in props) {
        var value = props[prop];

        if (prop === 'children') {
          // Ignore children prop
        } else if (prop === 'style') {
          html = html + ` style="${styleToCSS(value, options)}"`;
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
              html = html + renderElementToString(child, context, options);
            }
          } else {
            html = html + renderElementToString(children, context, options);
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

exports.renderToString = function renderToString(element, options = {}) {
  return renderElementToString(element, EMPTY_OBJECT, Object.assign({}, DEFAULT_STYLE_OPTIONS, options));
};
