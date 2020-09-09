import * as DriverDOM from 'driver-dom';

function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    return cache[str] || (cache[str] = fn(str));
  };
}

const EVENT_PREFIX_REG = /^on[A-Z]/;
const NON_DIMENSIONAL_REG = /opa|ntw|ne[ch]|ex(?:s|g|n|p|$)|^ord|zoo|grid|orp|ows|mnc|^columns$|bs|erim|onit/i;
const isDimensionalProp = cached(prop => !NON_DIMENSIONAL_REG.test(prop));

const setStyle = (node, style) => {
  for (let prop in style) {
    const value = style[prop];
    let convertedValue;
    if (typeof value === 'number' && isDimensionalProp(prop)) {
      convertedValue = value + 'rpx';
    } else {
      convertedValue = value;
    }
    // Support CSS custom properties (variables) like { --main-color: "black" }
    if (prop[0] === '-' && prop[1] === '-') {
      // reference: https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty.
      // style.setProperty do not support Camel-Case style properties.
      node.style.setProperty(prop, convertedValue);
    } else {
      node.style[prop] = convertedValue;
    }
  }
};

const isEventProp = cached(prop => EVENT_PREFIX_REG.test(prop));

// Convert Unitless To Rpx defaultly
export default Object.assign({}, DriverDOM, {
  createElement(type, props) {
    let style;
    let attrs = {};
    let events = [];

    for (let prop in props) {
      const value = props[prop];
      if (prop === 'children') continue;

      if (value != null) {
        if (prop === 'style') {
          style = value;
        } else if (isEventProp(prop)) {
          events.push({
            name: prop.slice(2).toLowerCase(),
            handler: value
          });
        } else {
          if (prop === 'className') {
            prop = 'class';
          }
          attrs[prop] = value;
        }
      }
    }

    const node = document._createElement({
      tagName: type,
      document,
      attrs
    });

    if (style) {
      setStyle(node, style);
    }

    events.forEach(({name, handler}) => {
      node.addEventListener(name, handler);
    });

    return node;
  },
  setStyle
});
