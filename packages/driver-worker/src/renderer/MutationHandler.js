import { sharedNodeMap } from './NodeMap';
import { createNode } from './nodes';
import { addEvent, removeEvent, setPostMessage } from './events';
import { setAttribute } from './attrs';

const TEXT_CONTENT = 'textContent';
const TEXT_CONTENT_ATTR = TEXT_CONTENT in document ? TEXT_CONTENT : 'nodeValue';

/**
 * Returns "attributes" if it was an attribute mutation.
 * "characterData" if it was a mutation to a CharacterData node.
 * And "childList" if it was a mutation to the tree of nodes.
 */
export default class MutationHandler {
  constructor(sender) {
    setPostMessage(sender);
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
    let vnode = target;

    if (vnode && vnode.nodeName === 'BODY') {
      document.body.$$id = vnode.$$id;
    }

    let parent = sharedNodeMap.get(vnode);
    if (removedNodes) {
      for (let i = removedNodes.length; i--;) {
        let node = sharedNodeMap.get(removedNodes[i]);
        sharedNodeMap.delete(node);
        if (parent && node) {
          parent.removeChild(node);
        }
      }
    }

    if (addedNodes) {
      for (let i = 0; i < addedNodes.length; i++) {
        let newNode = sharedNodeMap.get(addedNodes[i]);
        if (!newNode) {
          newNode = createNode(addedNodes[i]);
        }

        if (parent) {
          parent.insertBefore(newNode, nextSibling && sharedNodeMap.get(nextSibling) || null);
        }
      }
    }
  }

  attributes({ target, attributeName, newValue, style }) {
    let node = sharedNodeMap.get(target);
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
    let node = sharedNodeMap.get(target);
    node[TEXT_CONTENT_ATTR] = newValue;
  }

  addEvent({ target, eventName }) {
    let node = sharedNodeMap.get(target);
    if (!node) return;

    addEvent(node, eventName);
  }

  removeEvent({ target, eventName }) {
    let node = sharedNodeMap.get(target);
    if (!node) return;

    removeEvent(node, eventName);
  }

  canvasRenderingContext2D({ target, method, args, properties }) {
    let canvas = sharedNodeMap.get(target);
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

  lottieRenderingContext({ target, method, args }) {
    let lottie = sharedNodeMap.get(target);

    if (method) {
      lottie[method].apply(lottie, args);
    }
  }
}
