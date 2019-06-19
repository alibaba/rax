/* global VIEWPORT_WIDTH, DEVICE_WIDTH */
import * as DriverDOM from 'driver-dom';
import { convertUnit, setRem } from 'style-unit';
import * as Flexbox from './flexbox';

const STYLE = 'style';
const DEFAULT_VIEWPORT = 750;
let deviceWidth = null;
let viewportWidth = null;

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
  beforeRender(options) {
    // Init rem unit
    setRem(getDeviceWidth() / getViewportWidth());
    return DriverDOM.beforeRender(options);
  },
  setStyle(node, style) {
    const tranformedStyle = {};

    if (Array.isArray(style)) {
      style = style.reduce((prev, curr) => Object.assign(prev, curr), {});
    }

    for (let prop in style) {
      if (style.hasOwnProperty(prop)) {
        let val = style[prop];
        if (Flexbox.isFlexProp(prop)) {
          Flexbox[prop](val, tranformedStyle);
        } else {
          tranformedStyle[prop] = convertUnit(val, prop);
        }
      }
    }

    for (let prop in tranformedStyle) {
      if (tranformedStyle.hasOwnProperty(prop)) {
        const transformValue = tranformedStyle[prop];
        // Hack handle compatibility issue
        if (Array.isArray(transformValue)) {
          for (let i = 0; i < transformValue.length; i++) node.style[prop] = transformValue[i];
        } else {
          node.style[prop] = transformValue;
        }
      }
    }
  },
});

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

function getDeviceWidth() {
  return deviceWidth || typeof DEVICE_WIDTH !== 'undefined' && DEVICE_WIDTH || getClientWidth();
}

function getClientWidth() {
  return document.documentElement.clientWidth;
}

export function setDeviceWidth(width) {
  deviceWidth = width;
}

function getViewportWidth() {
  return viewportWidth || typeof VIEWPORT_WIDTH !== 'undefined' && VIEWPORT_WIDTH || DEFAULT_VIEWPORT;
}

export function setViewportWidth(width) {
  viewportWidth = width;
}

export default driver;
