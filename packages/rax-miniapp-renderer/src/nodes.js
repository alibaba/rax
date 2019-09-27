const CUSTOM_TAG_PREFIX = 'a-';

/**
 * Whitelist that declear w3c standard tag names.
 */
const w3cTags = {
  style: true,
};

function isValidW3CTag(tagName) {
  return w3cTags.hasOwnProperty(tagName);
}

/**
 * Format tag name.
 */
export function getTagName(nodeName) {
  const tagName = String(nodeName).toLowerCase();
  if (isValidW3CTag(tagName)) {
    return tagName;
  } else {
    return CUSTOM_TAG_PREFIX + tagName;
  }
}

export function createNode(vnode) {
  let node, tagName;
  if (vnode.nodeType === 3) {
    node = document.createTextNode(vnode.data);
  } else if (vnode.nodeType === 1 && (tagName = getTagName(vnode.nodeName))) {
    node = document.createElement(tagName);
  } else if (vnode.nodeType === 8) {
    node = document.createComment(vnode.data);
  }

  return node;
}
