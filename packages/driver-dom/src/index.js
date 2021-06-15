/**
 * Driver for Web DOM
 **/
import { convertUnit, setViewportWidth, setUnitPrecision, cached } from 'style-unit';
import {
  warnForReplacedHydratebleElement,
  warnForDeletedHydratableElement,
  warnForInsertedHydratedElement
} from './warning';

// opacity -> opa
// fontWeight -> ntw
// lineHeight|lineClamp -> ne[ch]
// flex|flexGrow|flexPositive|flexShrink|flexNegative|boxFlex|boxFlexGroup|zIndex -> ex(?:s|g|n|p|$)
// order -> ^ord
// zoom -> zoo
// gridArea|gridRow|gridRowEnd|gridRowSpan|gridRowStart|gridColumn|gridColumnEnd|gridColumnSpan|gridColumnStart -> grid
// columnCount -> mnc
// tabSize -> bs
// orphans -> orp
// windows -> ows
// animationIterationCount -> onit
// borderImageOutset|borderImageSlice|borderImageWidth -> erim
const NON_DIMENSIONAL_REG = /opa|ntw|ne[ch]|ex(?:s|g|n|p|$)|^ord|zoo|grid|orp|ows|mnc|^columns$|bs|erim|onit/i;
const EVENT_PREFIX_REG = /^on[A-Z]/;
const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const HTML = '__html';
const INNER_HTML = 'innerHTML';
const CLASS_NAME = 'className';
const CLASS = 'class';
const STYLE = 'style';
const CHILDREN = 'children';
const TEXT_CONTENT_ATTR = 'textContent';
const CREATE_ELEMENT = 'createElement';
const CREATE_COMMENT = 'createComment';
const CREATE_TEXT_NODE = 'createTextNode';
const SET_ATTRIBUTE = 'setAttribute';
const REMOVE_ATTRIBUTE = 'removeAttribute';
const SVG_NS = 'http://www.w3.org/2000/svg';
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const TEXT_SPLIT_COMMENT = '|';
const EMPTY = '';
const HYDRATION_INDEX = '__i';
const HYDRATION_APPEND = '__a';
const WITH_INNERHTML = '__h';
const __DEV__ = process.env.NODE_ENV !== 'production';

let tagNamePrefix = EMPTY;
// Flag indicating if the diff is currently within an SVG
let isSVGMode = false;
let isHydrating = false;

/**
 * Camelize CSS property.
 * Vendor prefixes should begin with a capital letter.
 * For example:
 * background-color -> backgroundColor
 * -webkit-transition -> webkitTransition
 */
const camelizeStyleName = cached(name => {
  return name
    .replace(/-([a-z])/gi, function(s, g) {
      return g.toUpperCase();
    });
});

const isDimensionalProp = cached(prop => !NON_DIMENSIONAL_REG.test(prop));
const isEventProp = cached(prop => EVENT_PREFIX_REG.test(prop));

export function setTagNamePrefix(prefix) {
  tagNamePrefix = prefix;
}

export function createBody() {
  return document.body;
}

export function createEmpty(component) {
  const parent = component._parent;
  let node;

  if (isHydrating) {
    const hydrationChild = findHydrationChild(parent);

    if (hydrationChild) {
      if (hydrationChild.nodeType === COMMENT_NODE) {
        return hydrationChild;
      } else {
        node = document[CREATE_COMMENT](EMPTY);
        replaceChild(node, hydrationChild, parent);
      }
    } else {
      node = document[CREATE_COMMENT](EMPTY);
      node[HYDRATION_APPEND] = true;
    }
  } else {
    node = document[CREATE_COMMENT](EMPTY);
  }

  return node;
}

export function createText(text, component) {
  const parent = component._parent;
  let node;

  if (isHydrating) {
    const hydrationChild = findHydrationChild(parent);

    if (hydrationChild) {
      if (hydrationChild.nodeType === TEXT_NODE) {
        if (text !== hydrationChild[TEXT_CONTENT_ATTR]) {
          hydrationChild[TEXT_CONTENT_ATTR] = text;
        }
        return hydrationChild;
      } else {
        node = document[CREATE_TEXT_NODE](text);
        replaceChild(node, hydrationChild, parent);
      }
    } else {
      node = document[CREATE_TEXT_NODE](text);
      node[HYDRATION_APPEND] = true;
    }
  } else {
    node = document[CREATE_TEXT_NODE](text);
  }

  return node;
}

export function updateText(node, text) {
  node[TEXT_CONTENT_ATTR] = text;
}

function findHydrationChild(parent) {
  const childNodes = parent.childNodes;

  if (parent[HYDRATION_INDEX] == null) {
    parent[HYDRATION_INDEX] = 0;
  }

  const child = childNodes[parent[HYDRATION_INDEX]++];

  // If child is an comment node for spliting text node, use the next node.
  if (child && child.nodeType === COMMENT_NODE && child.data === TEXT_SPLIT_COMMENT) {
    return childNodes[parent[HYDRATION_INDEX]++];
  } else {
    return child;
  }
}

/**
 * @param {string} type node type
 * @param {object} props elemement properties
 * @param {object} component component instance
 * @param {boolean} __shouldConvertUnitlessToRpx should add unit when missing
 */
export function createElement(type, props, component, __shouldConvertUnitlessToRpx) {
  const parent = component._parent;
  isSVGMode = type === 'svg' || parent && parent.namespaceURI === SVG_NS;
  let node;
  let hydrationChild = null;

  function createNode() {
    if (isSVGMode) {
      node = document.createElementNS(SVG_NS, type);
    } else if (tagNamePrefix) {
      let tagNamePrefix = typeof tagNamePrefix === 'function' ? tagNamePrefix(type) : tagNamePrefix;
      node = document[CREATE_ELEMENT](tagNamePrefix + type);
    } else {
      node = document[CREATE_ELEMENT](type);
    }
  }

  if (isHydrating) {
    hydrationChild = findHydrationChild(parent);

    if (hydrationChild) {
      if (type === hydrationChild.nodeName.toLowerCase()) {
        for (let attributes = hydrationChild.attributes, i = attributes.length; i--;) {
          const attribute = attributes[i];
          const attributeName = attribute.name;
          const propValue = props[attributeName];

          if (
            // The class or className prop all not in props
            attributeName === CLASS && props[CLASS_NAME] == null && propValue == null ||
            // The style prop is empty object or not in props
            attributeName === STYLE && (propValue == null || Object.keys(propValue).length === 0) ||
            // Remove rendered node attribute that not existed
            attributeName !== CLASS && attributeName !== STYLE && propValue == null
          ) {
            hydrationChild[REMOVE_ATTRIBUTE](attributeName);
            continue;
          }

          if (attributeName === STYLE) {
            // Remove invalid style prop, and direct reset style to child avoid diff style
            // Set style to empty will change the index of style, so here need to traverse style backwards
            for (let l = hydrationChild.style.length; 0 < l; l--) {
              // Prop name get from node style is hyphenated, eg: background-color
              const stylePropName = hydrationChild.style[l - 1];
              // Style with webkit prefix, will cause stylePropName be undefined in iOS 10.1 and 10.2.
              // Eg. when set transition-timing-function to be empty, it will also delete -webkit-transition-timing-function.
              if (stylePropName) {
                const camelizedStyleName = camelizeStyleName(stylePropName);
                if (propValue[camelizedStyleName] == null) {
                  hydrationChild.style[camelizedStyleName] = EMPTY;
                }
              }
            }
          }
        }

        node = hydrationChild;
      } else {
        createNode();
        replaceChild(node, hydrationChild, parent);
        if (__DEV__) {
          warnForReplacedHydratebleElement(parent, node, hydrationChild);
        }
      }
    } else {
      createNode();
      node[HYDRATION_APPEND] = true;
      if (__DEV__) {
        warnForInsertedHydratedElement(parent, node);
      }
    }
  } else {
    createNode();
  }

  for (let prop in props) {
    const value = props[prop];
    if (prop === CHILDREN) continue;

    if (value != null) {
      if (prop === STYLE) {
        setStyle(node, value, __shouldConvertUnitlessToRpx);
      } else if (isEventProp(prop)) {
        addEventListener(node, prop.slice(2).toLowerCase(), value, component);
      } else {
        setAttribute(node, prop, value, isSVGMode);
      }
    }
  }

  return node;
}

export function appendChild(node, parent) {
  if (!isHydrating || node[HYDRATION_APPEND]) {
    return parent.appendChild(node);
  }
}

export function removeChild(node, parent) {
  parent = parent || node.parentNode;
  // Maybe has been removed when remove child
  if (parent) {
    parent.removeChild(node);
  }
}

export function replaceChild(newChild, oldChild, parent) {
  parent = parent || oldChild.parentNode;
  parent.replaceChild(newChild, oldChild);
}

export function insertAfter(node, after, parent) {
  parent = parent || after.parentNode;
  const nextSibling = after.nextSibling;
  if (nextSibling) {
    // Performance improve when node has been existed before nextSibling
    if (nextSibling !== node) {
      insertBefore(node, nextSibling, parent);
    }
  } else {
    appendChild(node, parent);
  }
}

export function insertBefore(node, before, parent) {
  parent = parent || before.parentNode;
  parent.insertBefore(node, before);
}

export function addEventListener(node, eventName, eventHandler) {
  return node.addEventListener(eventName, eventHandler);
}

export function removeEventListener(node, eventName, eventHandler) {
  return node.removeEventListener(eventName, eventHandler);
}

export function removeAttribute(node, propKey) {
  if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    return node[INNER_HTML] = null;
  }

  if (propKey === CLASS_NAME) propKey = CLASS;

  if (propKey in node) {
    try {
      // Some node property is readonly when in strict mode
      node[propKey] = null;
    } catch (e) { }
  }

  node[REMOVE_ATTRIBUTE](propKey);
}

export function setAttribute(node, propKey, propValue, isSvg) {
  if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    // For reduce innerHTML operation to improve performance.
    if (node[INNER_HTML] !== propValue[HTML]) {
      node[INNER_HTML] = propValue[HTML];
    }

    node[WITH_INNERHTML] = true;
    return;
  }

  if (propKey === CLASS_NAME) propKey = CLASS;

  // Prop for svg can only be set by attribute
  if (!isSvg && propKey in node) {
    try {
      // Some node property is readonly when in strict mode
      node[propKey] = propValue;
    } catch (e) {
      node[SET_ATTRIBUTE](propKey, propValue);
    }
  } else {
    node[SET_ATTRIBUTE](propKey, propValue);
  }
}

/**
 * @param {object} node target node
 * @param {object} style target node style value
 * @param {boolean} __shouldConvertUnitlessToRpx
 */
export function setStyle(node, style, __shouldConvertUnitlessToRpx) {
  for (let prop in style) {
    const value = style[prop];
    let convertedValue;

    if (typeof value === 'number' && isDimensionalProp(prop)) {
      if (__shouldConvertUnitlessToRpx) {
        convertedValue = value + 'rpx';
        // Transfrom rpx to vw
        convertedValue = convertUnit(convertedValue);
      } else {
        convertedValue = value + 'px';
      }
    } else {
      convertedValue = convertUnit(value);
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
}

export function beforeRender({ hydrate }) {
  // Nested render may reset `isHydrating`, `recolectHydrationChild` will not work correctly after render.
  if (isHydrating && !hydrate) {
    if (__DEV__) {
      throw new Error(
        'Nested render is not allowed when hydrating. ' +
        'If necessary, trigger render in useEffect.'
      );
    } else {
      throw new Error('Nested render found.');
    }
  }

  isHydrating = hydrate;
}

function recolectHydrationChild(hydrationParent) {
  // Should not to compare node with dangerouslySetInnerHTML because vdomLength is alway 0
  if (hydrationParent[WITH_INNERHTML]) {
    return;
  }

  const nativeLength = hydrationParent.childNodes.length;
  const vdomLength = hydrationParent[HYDRATION_INDEX] || 0;
  if (nativeLength - vdomLength > 0) {
    for (let i = nativeLength - 1; i >= vdomLength; i--) {
      if (__DEV__) {
        warnForDeletedHydratableElement(hydrationParent, hydrationParent.childNodes[i]);
      }
      hydrationParent.removeChild(hydrationParent.childNodes[i]);
    }
  }

  for (let j = hydrationParent.childNodes.length - 1; j >= 0; j--) {
    recolectHydrationChild(hydrationParent.childNodes[j]);
  }
}

export function afterRender({ container }) {
  if (isHydrating) {
    // Remove native node when more then vdom node
    recolectHydrationChild(container);
    isHydrating = false;
  }
}

/**
 * Remove all children from node.
 * @NOTE: Optimization at web.
 */
export function removeChildren(node) {
  node.textContent = EMPTY;
}

export {
  /**
   * Set viewport width.
   * @param viewport {Number} Viewport width, default to 750.
  */
  setViewportWidth,
  /**
   * Set unit precision.
   * @param n {Number} Unit precision, default to 4.
   */
  setUnitPrecision
};
