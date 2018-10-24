import setStyle from './setStyle';
import { nodeMap } from './NodeMap';
import { createNode } from './nodes';
import { addEvent, removeEvent } from './events';

const TEXT_CONTENT = 'textContent';
const TEXT_CONTENT_ATTR = TEXT_CONTENT in document ? TEXT_CONTENT : 'nodeValue';

/**
 * Returns "attributes" if it was an attribute mutation.
 * "characterData" if it was a mutation to a CharacterData node.
 * And "childList" if it was a mutation to the tree of nodes.
 */
export default class MutationHandler {
  apply(data, { worker }) {
    let mutations = data.mutations;
    for (let i = 0; i < mutations.length; i++) {
      // apply mutation
      let mutation = mutations[i];
      this[mutation.type](mutation, worker);
    }
  }

  childList({ target, removedNodes, addedNodes, nextSibling }) {
    let vnode = target;

    if (vnode && vnode.nodeName === 'BODY') {
      document.body.$$id = vnode.$$id;
    }

    let parent = nodeMap.get(vnode);
    if (removedNodes) {
      for (let i = removedNodes.length; i--;) {
        let node = nodeMap.get(removedNodes[i]);
        nodeMap.delete(node);
        if (parent && node) {
          parent.removeChild(node);
        }
      }
    }

    if (addedNodes) {
      for (let i = 0; i < addedNodes.length; i++) {
        let newNode = nodeMap.get(addedNodes[i]);
        if (!newNode) {
          newNode = createNode(addedNodes[i]);
        }

        if (parent) {
          parent.insertBefore(newNode, nextSibling && nodeMap.get(nextSibling) || null);
        }
      }
    }
  }

  attributes({ target, attributeName, newValue, style }) {
    let node = nodeMap.get(target);
    // Node maybe null when node is removed and there is a setInterval change the node that will cause error
    if (!node) return;

    // TODO: some with `createNode`, should processed by one method
    if (style) {
      setStyle(node, style);
    } else if (newValue == null) {
      node.removeAttribute(attributeName);
    } else if (typeof newValue === 'object' || typeof newValue === 'boolean') {
      node[attributeName] = newValue;
    } else {
      node.setAttribute(attributeName, newValue);
    }
  }

  characterData({ target, newValue }) {
    let node = nodeMap.get(target);
    node[TEXT_CONTENT_ATTR] = newValue;
  }

  addEvent({ target, eventName }, worker) {
    let node = nodeMap.get(target);
    if (!node) return;

    addEvent(node, eventName, worker);
  }

  removeEvent({ target, eventName }, worker) {
    let node = nodeMap.get(target);
    if (!node) return;

    removeEvent(node, eventName, worker);
  }

  canvasRenderingContext2D({ target, method, args, properties }) {
    let canvas = nodeMap.get(target);
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
}
