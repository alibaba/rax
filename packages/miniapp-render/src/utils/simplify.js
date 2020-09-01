export default function simplify(node) {
  if (node.childNodes && node.childNodes.length > 0) {
    node._renderInfo.children = node.childNodes.map(simplify);
  } else {
    node._renderInfo.children = [];
  }

  return node._renderInfo;
}
