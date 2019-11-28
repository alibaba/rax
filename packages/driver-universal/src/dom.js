/* global VIEWPORT_WIDTH, DEVICE_WIDTH */
import * as DriverDOM from 'driver-dom';

export default function createDOMDriver() {
  const STYLE = 'style';
  const DEFAULT_VIEWPORT = 750;
  const NON_DIMENSIONAL_REG = /opa|ntw|ne[ch]|ex(?:s|g|n|p|$)|^ord|zoo|grid|orp|ows|mnc|^columns$|bs|erim|onit/i;

  function transformStyle(style, ret = {}) {
    // Driver universal only process flex box compatible.
    // Process convert unit in DriverDOM
    for (let prop in style) {
      if (style.hasOwnProperty(prop)) {
        let val = style[prop];
        if (typeof val === 'object') {
          delete style[prop];
          transformStyle(val, ret);
        } else if (typeof val === 'number' && !NON_DIMENSIONAL_REG.test(prop)) {
          // append `rpx` to relevant styles
          ret[prop] = val + 'rpx';
        } else {
          ret[prop] = val;
        }
      }
    }

    return ret;
  }

  function normalizeEventName(node, eventName, props) {
    const tagName = node.tagName.toLowerCase();

    if (
      eventName === 'change' &&
      (tagName === 'textarea' ||
        tagName === 'input' && (!props.type || props.type === 'text' || props.type === 'password'))
    ) {
      eventName = 'input';
    } else if (eventName === 'doubleclick') {
      eventName = 'dblclick';
    }
    return eventName;
  }

  const driver = Object.assign({}, DriverDOM, {
    createElement(type, props, component) {
      if (props.hasOwnProperty(STYLE)) {
        const style = props[STYLE];
        const node = DriverDOM.createElement(type, {
          ...props,
          [STYLE]: null,
        }, component);
        driver.setStyle(node, style);
        return node;
      } else {
        return DriverDOM.createElement(type, props, component);
      }
    },
    addEventListener(node, eventName, eventHandler, props) {
      eventName = normalizeEventName(node, eventName, props);
      return DriverDOM.addEventListener(node, eventName, eventHandler, props);
    },
    removeEventListener(node, eventName, eventHandler, props) {
      eventName = normalizeEventName(node, eventName, props);
      return DriverDOM.removeEventListener(node, eventName, eventHandler, props);
    },

    setStyle(node, style) {
      if (Array.isArray(style)) {
        style = style.reduce((prev, curr) => Object.assign(prev, curr), {});
      }
      const tranformedStyle = transformStyle(style);

      // Fist use DriverDOM set standard style.
      DriverDOM.setStyle(node, tranformedStyle);
      // Second process flex compatible style, like {display: ["-webkit-box", "-webkit-flex", "flex"]}.
      for (let prop in tranformedStyle) {
        if (tranformedStyle.hasOwnProperty(prop)) {
          const transformValue = tranformedStyle[prop];
          // Hack handle compatibility issue
          if (Array.isArray(transformValue)) {
            for (let i = 0; i < transformValue.length; i++) node.style[prop] = transformValue[i];
          }
        }
      }
    }
  });
  return driver;
}
