/**
 * Driver for Web DOM
 **/
const DANGEROUSLY_SET_INNER_HTML = 'dangerouslySetInnerHTML';
const CLASS_NAME = 'className';
const CLASS = 'class';
const STYLE = 'style';
const CHILDREN = 'children';
const TEXT_CONTENT_ATTR = 'textContent';
const EVENT_PREFIX_REGEXP = /^on[A-Z]/;
const SVG_NS = 'http://www.w3.org/2000/svg';
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
const TRUE = true;
const EMPTY = '';
const HYDRATION_INDEX = '__i';
const HYDRATION_APPEND = '__a';
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

let tagNamePrefix = EMPTY;
// Flag indicating if the diff is currently within an SVG
let isSVGMode = false;
let isHydrating = false;

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
        node = document.createComment(EMPTY);
        replaceChild(node, hydrationChild, parent);
      }
    } else {
      node = document.createComment(EMPTY);
      node[HYDRATION_APPEND] = true;
    }
  } else {
    node = document.createComment(EMPTY);
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
        node = document.createTextNode(text);
        replaceChild(node, hydrationChild, parent);
      }
    } else {
      node = document.createTextNode(text);
      node[HYDRATION_APPEND] = true;
    }
  } else {
    node = document.createTextNode(text);
  }

  return node;
}

export function updateText(node, text) {
  node[TEXT_CONTENT_ATTR] = text;
}

function findHydrationChild(parent) {
  if (parent[HYDRATION_INDEX] == null) {
    parent[HYDRATION_INDEX] = 0;
  }

  return parent.childNodes[parent[HYDRATION_INDEX]++];
}

export function createElement(type, props, component) {
  const parent = component._parent;
  isSVGMode = type === 'svg' || parent && parent.namespaceURI === SVG_NS;

  let node;
  let hydrationChild = null;

  function createNode() {
    if (isSVGMode) {
      node = document.createElementNS(SVG_NS, type);
    } else if (tagNamePrefix) {
      let tagNamePrefix = typeof tagNamePrefix === 'function' ? tagNamePrefix(type) : tagNamePrefix;
      node = document.createElement(tagNamePrefix + type);
    } else {
      node = document.createElement(type);
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
            hydrationChild.removeAttribute(attributeName);
            continue;
          }

          if (attributeName === STYLE) {
            // Remove invalid style prop, and direct reset style to child avoid diff style
            for (let i = 0; i < hydrationChild.style.length; i++) {
              let stylePropName = hydrationChild.style[i];
              if (!propValue[stylePropName]) {
                hydrationChild.style[stylePropName] = EMPTY;
              }
            }
          }
        }

        node = hydrationChild;
      } else {
        createNode();
        replaceChild(node, hydrationChild, parent);
      }
    } else {
      createNode();
      node[HYDRATION_APPEND] = true;
    }
  } else {
    createNode();
  }

  for (let prop in props) {
    let value = props[prop];
    if (prop === CHILDREN) {
      continue;
    }

    if (value != null) {
      if (prop === STYLE) {
        setStyle(node, value);
      } else if (EVENT_PREFIX_REGEXP.test(prop)) {
        addEventListener(node, prop.slice(2).toLowerCase(), value, component);
      } else {
        setAttribute(node, prop, value);
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
    return node.innerHTML = null;
  }

  if (propKey === CLASS_NAME) {
    propKey = CLASS;
  }

  if (propKey in node) {
    try {
      // Some node property is readonly when in strict mode
      node[propKey] = null;
    } catch (e) { }
  }

  node.removeAttribute(propKey);
}

export function setAttribute(node, propKey, propValue) {
  if (propKey === DANGEROUSLY_SET_INNER_HTML) {
    const html = propValue.__html;
    if (node.innerHTML !== html) {
      return node.innerHTML = html;
    }
  }

  if (propKey === CLASS_NAME) {
    propKey = CLASS;
  }

  if (propKey in node) {
    try {
      // Some node property is readonly when in strict mode
      node[propKey] = propValue;
    } catch (e) {
      node.setAttribute(propKey, propValue);
    }
  } else {
    node.setAttribute(propKey, propValue);
  }
}

export function setStyle(node, style) {
  let nodeStyle = node.style;
  for (let prop in style) {
    let propValue = style[prop];
    nodeStyle[prop] = typeof propValue === 'number' && !UNITLESS_NUMBER_PROPS[prop] ? propValue + 'px' : propValue;
  }
}

export function beforeRender({ hydrate }) {
  isHydrating = hydrate;
}

function recolectHydrationChild(hydrationParent) {
  const nativeLength = hydrationParent.childNodes.length;
  const vdomLength = hydrationParent[HYDRATION_INDEX] || 0;
  if (nativeLength - vdomLength > 0) {
    for (let i = nativeLength - 1; i >= vdomLength; i-- ) {
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
