import NodeMap from './NodeMap';
import EventHandler from './EventHandler';
import { createNode, getTagName } from './nodes';
import { setAttribute } from './attrs';
import { setStyle } from './styles';

const STYLE_ELEMENT = 'STYLE';
const TEXT_CONTENT = 'textContent';
const TEXT_CONTENT_ATTR = TEXT_CONTENT in document ? TEXT_CONTENT : 'nodeValue';

/**
 * Returns "attributes" if it was an attribute mutation.
 * "characterData" if it was a mutation to a CharacterData node.
 * And "childList" if it was a mutation to the tree of nodes.
 */
export default class MutationHandler {
  constructor(sender, mountNode) {
    this.eventHandler = new EventHandler(sender, {
      mountNode
    });
    this.mountNode = mountNode || document.body;

    this.sharedNodeMap = new NodeMap();
    this.sharedNodeMap._setMountNode(this.mountNode);
  }

  apply(data) {
    let mutations = data.mutations;
    for (let i = 0; i < mutations.length; i++) {
      // apply mutation
      let mutation = mutations[i];
      this[mutation.type](mutation);
    }
  }

  childList({ target, removedNodes, addedNodes, nextSibling }) {
    let sharedNodeMap = this.sharedNodeMap;
    let vnode = target;

    if (vnode && vnode.nodeName === 'BODY' && vnode.$$id) {
      this.mountNode.$$id = vnode.$$id;
    }

    let parent = sharedNodeMap.get(vnode);
    if (removedNodes) {
      for (let i = removedNodes.length; i--;) {
        let node = sharedNodeMap.get(removedNodes[i]);
        /**
         * @NOTE For performance:
         *   do not remove style element or textContent of style element.
         */
        if (
          parent
          && parent.nodeName !== STYLE_ELEMENT
          && node
          && node.nodeName !== STYLE_ELEMENT
        ) {
          sharedNodeMap.delete(node);
          parent.removeChild(node);
        }
      }
    }

    if (addedNodes) {
      for (let i = 0; i < addedNodes.length; i++) {
        let newNode = sharedNodeMap.get(addedNodes[i]);
        if (!newNode) {
          newNode = this.createNode(addedNodes[i]);
        }

        if (parent) {
          let siblingElement = nextSibling && sharedNodeMap.get(nextSibling) || null;
          parent.insertBefore(newNode, siblingElement);
        }
      }
    }
  }

  createNode(vnode) {
    let node = createNode(vnode);

    if (vnode.nodeType === 1 && getTagName(vnode.nodeName)) {
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
          node.appendChild(this.createNode(vnode.childNodes[i]));
        }
      }

      if (vnode.events) {
        for (let i = 0; i < vnode.events.length; i++) {
          this.eventHandler.addEvent(node, vnode.events[i]);
        }
      }
    }

    this.sharedNodeMap.set(vnode, node);

    return node;
  }

  attributes({ target, attributeName, newValue, style }) {
    let node = this.sharedNodeMap.get(target);
    // Node maybe null when node is removed and there is a setInterval change the node that will cause error
    if (!node) return;

    if (style) {
      setAttribute(node, 'style', style);
    }
    if (attributeName) {
      setAttribute(node, attributeName, newValue);
    }
  }

  characterData({ target, newValue }) {
    let node = this.sharedNodeMap.get(target);
    node[TEXT_CONTENT_ATTR] = newValue;
  }

  addEvent({ target, eventName }) {
    let node = this.sharedNodeMap.get(target);
    if (!node) return;
    this.eventHandler.addEvent(node, eventName);
  }

  removeEvent({ target, eventName }) {
    let node = this.sharedNodeMap.get(target);
    if (!node) return;

    this.eventHandler.removeEvent(node, eventName);
  }

  canvasRenderingContext2D({ target, method, args, properties }) {
    let canvas = this.sharedNodeMap.get(target);
    if (!canvas) return;

    let context = canvas.getContext('2d');

    if (properties) {
      for (let key in properties) {
        if (properties.hasOwnProperty(key)) {
          context[key] = properties[key];
        }
      }
    }

    if (method) {
      context[method].apply(context, args);
    }
  }

  destroy() {
    this.eventHandler.removeAllEvents();
    this.sharedNodeMap = null;
    this.mountNode.parentElement.removeChild(this.mountNode);
  }
}
