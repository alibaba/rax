function simplify(node) {
  return node._renderInfo;
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
    if (curNode.childNodes && curNode.childNodes.length) {
      curNode.childNodes.forEach(n => n.__parent = result);
      queue = queue.concat(curNode.childNodes);
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
