function simplify(node) {
  if (node.childNodes && node.childNodes.length > 0) {
    node._renderInfo.children = node.childNodes.map(simplify);
  } else {
    node._renderInfo.children = [];
  }

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
