import setStyle from './setStyle';
import { sharedNodeMap } from './NodeMap';
import { addEvent } from './events';
import { isW3CTag } from '../shared/W3CTags';
import { isCustomTags } from '../shared/CustomTags';

const CUSTOM_TAG_PREFIX = 'a-';

/**
 * Only nodeName that in whitelist can be created.
 */
function getValidTagName(nodeName) {
  const lowerCased = String(nodeName).toLowerCase();
  if (isW3CTag(lowerCased)) {
    return lowerCased;
  } else if (isCustomTags(lowerCased)) {
    return CUSTOM_TAG_PREFIX + nodeName;
  } else {
    return null;
  }
}

export function createNode(vnode) {
  let node, tagName;
  if (vnode.nodeType === 3) {
    node = document.createTextNode(vnode.data);
  } else if (vnode.nodeType === 1 && (tagName = getValidTagName(vnode.nodeName))) {
    node = document.createElement(tagName);

    if (vnode.className) {
      node.className = vnode.className;
    }

    if (vnode.style) {
      setStyle(node, vnode.style);
    }

    if (vnode.attributes) {
      for (let i = 0; i < vnode.attributes.length; i++) {
        let a = vnode.attributes[i];

        if (typeof a.value === 'object' || typeof a.value === 'boolean') {
          node[a.name] = a.value;
        } else {
          node.setAttribute(a.name, a.value);
        }
      }
    }

    if (vnode.childNodes) {
      for (let i = 0; i < vnode.childNodes.length; i++) {
        node.appendChild(createNode(vnode.childNodes[i]));
      }
    }

    if (vnode.events) {
      for (let i = 0; i < vnode.events.length; i++) {
        addEvent(node, vnode.events[i]);
      }
    }
  } else if (vnode.nodeType === 8) {
    node = document.createComment(vnode.data);
  }

  sharedNodeMap.set(vnode, node);
  return node;
}
