import { setStyle } from './styles';
import { sharedNodeMap } from './NodeMap';
import { addEvent } from './events';
import { isValidW3CTag, isValidCustomTags } from './tags';
import { setAttribute } from './attrs';

const CUSTOM_TAG_PREFIX = 'a-';

/**
 * Only node name that in whitelist can be created.
 */
function getTagName(nodeName) {
  const tagName = String(nodeName).toLowerCase();
  if (isValidW3CTag(tagName)) {
    return tagName;
  } else if (isValidCustomTags(tagName)) {
    return CUSTOM_TAG_PREFIX + tagName;
  } else {
    return 'a-unknown';
  }
}

export function createNode(vnode) {
  let node, tagName;
  if (vnode.nodeType === 3) {
    node = document.createTextNode(vnode.data);
  } else if (vnode.nodeType === 1 && (tagName = getTagName(vnode.nodeName))) {
    node = document.createElement(tagName);

    if (vnode.className) {
      node.className = vnode.className;
    }

    if (vnode.style) {
      setStyle(node, vnode.style);
    }

    if (vnode.attributes) {
      for (let i = 0; i < vnode.attributes.length; i++) {
        let { name, value } = vnode.attributes[i];
        setAttribute(node, name, value);
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
