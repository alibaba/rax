import { propsMap } from '../builtInComponents';
import Node from '../node/node';

function simplify(node) {
  const domInfo = node.$$domInfo;
  if (node.nodeType === Node.TEXT_NODE) {
    node.__simpleNode = domInfo;
    return domInfo;
  }

  // Get specific props
  const specificProps = propsMap[node.tagName] || [];
  specificProps.forEach(prop => {
    domInfo[prop.name] = prop.get(node);
  });

  return domInfo;
}

export function traverse(node, action) {
  if (!node) {
    return;
  }
  let copiedNode;
  let queue = [];
  queue.push(node);
  while (queue.length) {
    let curNode = queue.shift();
    const result = action(curNode);
    if (!copiedNode) {
      copiedNode = result;
      copiedNode.children = [];
    } else {
      curNode.__parent.children = curNode.__parent.children || [];
      curNode.__parent.children.push(result);
    }
    if (curNode.$_children && curNode.$_children.length) {
      curNode.$_children.forEach(n => n.__parent = result);
      queue = queue.concat(curNode.$_children);
    }
    if (!result.children) {
      result.children = [];
    }
  }
  return copiedNode;
}

export function simplifyDomTree(node) {
  return traverse(node, simplify);
}
