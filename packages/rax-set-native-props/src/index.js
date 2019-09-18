import { isWeex, isWeb } from 'universal-env';
import { convertUnit } from 'style-unit';
import { shared } from 'rax';
import flexbox from './flexbox';

const ADD_EVENT = 'addEvent';
const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const CLASS_NAME = 'className';
const CLASS = 'class';
const STYLE = 'style';
const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;

const objectPrototypeHasOwnProperty = Object.prototype.hasOwnProperty;

function hasOwnProperty(obj, key) {
  return objectPrototypeHasOwnProperty.call(obj, key);
}

function setStyles(node, styles) {
  if (isWeb) {
    let tranformedStyles = {};
    for (let prop in styles) {
      let val = styles[prop];
      if (flexbox.isFlexProp(prop)) {
        flexbox[prop](val, tranformedStyles);
      } else {
        tranformedStyles[prop] = convertUnit(val, prop);
      }
    }
    for (let prop in tranformedStyles) {
      const transformValue = tranformedStyles[prop];
      // hack handle compatibility issue
      if (Array.isArray(transformValue)) {
        for (let i = 0; i < transformValue.length; i++) {
          node.style[prop] = transformValue[i];
        }
      } else {
        node.style[prop] = transformValue;
      }
    }
  } else if (isWeex) {
    shared.Host.driver.setStyle(node, styles);
  }
}

function addEventListener(node, eventName, eventHandler, props) {
  if (isWeb) {
    if (this.eventRegistry[eventName]) {
      return this.eventRegistry[eventName](ADD_EVENT, node, eventName, eventHandler, props);
    } else {
      return node.addEventListener(eventName, eventHandler);
    }
  } else if (isWeex) {
    shared.Host.driver.addEventListener(node, eventName, eventHandler, props);
  }
}

function setAttribute(node, propKey, propValue) {
  if (isWeb) {
    if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      return node.innerHTML = propValue.__html;
    }
    if (propKey === CLASS_NAME) {
      propKey = CLASS;
    }
    if (propKey in node) {
      try {
        node[propKey] = propValue;
      } catch (e) {
        node.setAttribute(propKey, propValue);
      }
    } else {
      node.setAttribute(propKey, propValue);
    }
  } else if (isWeex) {
    shared.Host.driver.setAttribute(node, propKey, propValue);
  }
}

/**
 * Set props directly to native node.
 * @param {Node} node Reference to node intance.
 * @param {Obejct} props k-v structure to props.
 */
export default function setNativeProps(node, props = {}) {
  for (let prop in props) {
    if (!hasOwnProperty(props, prop)) continue;

    const value = props[prop];

    // Skip children.
    if (prop === CHILDREN) continue;

    // Skip nullable value.
    if (value === null || value === undefined) continue;

    if (prop === STYLE) {
      setStyles(node, value);
    } else if (EVENT_PREFIX_REGEXP.test(prop)) {
      const eventName = prop.slice(2).toLowerCase();
      addEventListener(node, eventName, value, props);
    } else {
      setAttribute(node, prop, value);
    }
  }
}