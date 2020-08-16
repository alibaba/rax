import { shared } from 'rax';
import { BOOLEAN, BOOLEANISH_STRING, OVERLOADED_BOOLEAN, shouldRemoveAttribute, getPropertyInfo } from './attribute';
import { UNITLESS_NUMBER_PROPS } from './CSSProperty';

const EMPTY_OBJECT = {};

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

const TEXT_SPLIT_COMMENT = '<!--|-->';

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

    if (val == null) {
      continue;
    }

    const type = typeof val;

    // Handle unit for all numerical property, such as fontWeight: 600 / fontWeight: '600'
    if (type === 'number' || type === 'string' && NUMBER_REGEXP.test(val)) {
      if (!UNITLESS_NUMBER_PROPS[prop]) {
        unit = options.defaultUnit;
      }
    }

    if (type === 'string' && val.indexOf('rpx') > -1 || unit === 'rpx') {
      val = rpx2vw(val, options);
      unit = val === 0 ? '' : 'vw';
    }

    prop = CSSPropCache[prop] ? CSSPropCache[prop] : CSSPropCache[prop] = prop.replace(UPPERCASE_REGEXP, '-$&').toLowerCase();
    css = css + `${prop}:${val}${unit};`;
  }

  return css;
}

function createMarkupForProperty(prop, value, options) {
  if (prop === 'children') {
    // Ignore children prop
    return '';
  }

  if (prop === 'style') {
    return ` style="${styleToCSS(value, options)}"`;
  }

  if (prop === 'className') {
    return typeof value === 'string' ? ` class="${escapeText(value)}"` : '';
  }

  if (prop === 'dangerouslySetInnerHTML') {
    // Ignore innerHTML
    return '';
  }

  if (shouldRemoveAttribute(prop, value)) {
    return '';
  }

  const propInfo = getPropertyInfo(prop);
  const propType = propInfo ? propInfo.type : null;
  const valueType = typeof value;

  if (propType === BOOLEAN || propType === OVERLOADED_BOOLEAN && value === true) {
    return ` ${prop}`;
  }

  if (valueType === 'string') {
    return ` ${prop}="${escapeText(value)}"`;
  }

  if (valueType === 'number') {
    return ` ${prop}="${String(value)}"`;
  }

  if (valueType === 'boolean') {
    if (propType === BOOLEANISH_STRING || prop.indexOf('data-') === 0 || prop.indexOf('aria-') === 0) {
      return ` ${prop}="${value ? 'true' : 'false'}"`;
    }
  }

  return '';
};

function propsToString(props, options) {
  let html = '';
  for (var prop in props) {
    var value = props[prop];

    if (prop === 'defaultValue') {
      if (props.value == null) {
        prop = 'value';
      } else {
        continue;
      }
    }

    if (prop === 'defaultChecked') {
      if (!props.checked) {
        prop = 'checked';
      } else {
        continue;
      }
    }

    html = html + createMarkupForProperty(prop, value, options);
  }

  return html;
}

function rpx2vw(val, opts) {
  const pixels = parseFloat(val);
  const vw = pixels / opts.viewportWidth * 100;
  const parsedVal = parseFloat(vw.toFixed(opts.unitPrecision));

  return parsedVal;
}

function checkContext(element) {
  // Filter context by `contextTypes` or prevent pass context to child without `contextTypes`,
  // need to distinguish context for passing to child and render, which will cause `Consumer` can not work correctly.
  // The best way to get context is from the nearest parent provider, but it will increase the complexity of SSR.
  if (element.contextTypes || element.childContextTypes) {
    console.error(
      'Warning: ' +
      'The legacy "contextTypes" and "childContextTypes" API not working properly in server renderer, ' +
      'use the new context API. ' +
      `(Current: ${shared.Host.owner.__getName()})`
    );
  }
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
class ServerReactiveComponent {
  constructor(pureRender, ref) {
    // A pure function
    this._render = pureRender;
    this._hookID = 0;
    this._hooks = {};
    // Handles store
    this.didMount = [];
    this.didUpdate = [];
    this.willUnmount = [];

    if (pureRender._forwardRef) {
      this._forwardRef = ref;
    }
  }

  getHooks() {
    return this._hooks;
  }

  getHookID() {
    return ++this._hookID;
  }

  useContext(context) {
    const contextID = context._contextID;

    if (this.context[contextID]) {
      return this.context[contextID].getValue();
    } else {
      return context._defaultValue;
    }
  }

  render() {
    this._hookID = 0;
    let children = this._render(this.props, this._forwardRef ? this._forwardRef : this.context);
    return children;
  }
}

function createInstance(element, context) {
  const { type } = element;
  const props = element.props || EMPTY_OBJECT;

  let instance;

  // class component
  if (type.prototype && type.prototype.render) {
    instance = new type(props, context); // eslint-disable-line new-cap
    instance.props = props;
    instance.context = context;
    // Inject the updater into instance
    instance.updater = updater;

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
  } else {
    const ref = element.ref;
    instance = new ServerReactiveComponent(type, ref);
    instance.props = props;
    instance.context = context;
  }

  return instance;
}

class ServerRenderer {
  constructor(options) {
    this.options = options;
    this.previousWasTextNode = false;
  }

  renderElementToString(element, context) {
    if (typeof element === 'string') {
      if (this.previousWasTextNode) {
        return TEXT_SPLIT_COMMENT + escapeText(element);
      }
      this.previousWasTextNode = true;
      return escapeText(element);
    }

    if (element == null || element === false || element === true) {
      this.previousWasTextNode = false;
      return '<!-- _ -->';
    }

    if (typeof element === 'number') {
      if (this.previousWasTextNode) {
        return TEXT_SPLIT_COMMENT + String(element);
      }
      this.previousWasTextNode = true;
      return String(element);
    }

    if (Array.isArray(element)) {
      let html = '';
      for (var index = 0, length = element.length; index < length; index++) {
        var child = element[index];
        html = html + this.renderElementToString(child, context);
      }
      return html;
    }

    // pre compiled html
    if (element.__html != null) { // __html may be empty string
      let html = element.__html;

      if (element.__isStartWithTextNode && this.previousWasTextNode) {
        html = TEXT_SPLIT_COMMENT + html;
      }

      this.previousWasTextNode = element.__isEndWithTextNode ? true : false;
      return html;
    }

    // pre compiled attrs
    if (element.__attrs) {
      return propsToString(element.__attrs, this.options);
    }

    const type = element.type;

    if (type) {
      // class component || function component
      if (type.prototype && type.prototype.render || typeof type === 'function') {
        const instance = createInstance(element, context);

        const currentComponent = {
          // For hooks to get current instance
          _instance: instance
        };

        if (process.env.NODE_ENV !== 'production') {
          const componetName = type.displayName || type.name || element;
          // Give the component name in render error info (only for development)
          currentComponent.__getName = () => componetName;
        }

        // Rax will use owner during rendering, eg: hooks, render error info.
        shared.Host.owner = currentComponent;

        if (process.env.NODE_ENV !== 'production') {
          checkContext(type);
        }

        let currentContext = instance.context;
        let childContext;

        if (instance.getChildContext) {
          childContext = instance.getChildContext();
        } else if (instance._getChildContext) {
          // Only defined in Provider
          childContext = instance._getChildContext();
        }

        if (childContext) {
          // Why not use Object.assign? for better performance
          currentContext = merge({}, context, childContext);
        }

        const renderedElement = instance.render();

        // Reset owner after render, or it will casue memory leak.
        shared.Host.owner = null;

        return this.renderElementToString(renderedElement, currentContext);
      } else if (typeof type === 'string') {
        // shoud set the identifier to false before render child
        this.previousWasTextNode = false;

        const props = element.props || EMPTY_OBJECT;
        const isVoidElement = VOID_ELEMENTS[type];
        let html = `<${type}${propsToString(props, this.options)}`;
        let innerHTML;

        if (props.dangerouslySetInnerHTML) {
          innerHTML = props.dangerouslySetInnerHTML.__html;
        }

        if (isVoidElement) {
          html = html + '>';
        } else {
          html = html + '>';
          // When child is null or undefined, it should be render as <!-- _ -->
          if (props.hasOwnProperty('children')) {
            const children = props.children;
            if (Array.isArray(children)) {
              for (var i = 0, l = children.length; i < l; i++) {
                var child = children[i];
                html = html + this.renderElementToString(child, context);
              }
            } else {
              html = html + this.renderElementToString(children, context);
            }
          } else if (innerHTML != null) { // When dangerouslySetInnerHTML is 0, it should be render as 0
            html = html + innerHTML;
          }

          html = html + `</${type}>`;
        }

        this.previousWasTextNode = false;
        return html;
      } else {
        throwInValidElementError(element);
      }
    } else {
      throwInValidElementError(element);
    }
  }
}

function throwInValidElementError(element) {
  let typeInfo = element === undefined ? '' :
    '(found: ' + (isPlainObject(element) ? `object with keys {${Object.keys(element)}}` : element) + ')';

  console.error(`Invalid element type, expected types: Element instance, string, boolean, array, null, undefined. ${typeInfo}`);
}

function isPlainObject(obj) {
  return EMPTY_OBJECT.toString.call(obj) === '[object Object]';
}

export function renderToString(element, options) {
  const serverRenderer = new ServerRenderer(Object.assign({}, DEFAULT_STYLE_OPTIONS, options));
  return serverRenderer.renderElementToString(element, {});
}

export default {
  renderToString
};
