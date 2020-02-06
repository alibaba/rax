// Deal the nodes that needn't transfrom to custom component
export default function dealWithLeafAndSimple(childNodes, onChildNodesUpdate) {
  if (childNodes && childNodes.length) {
    childNodes = childNodes.map(originChildNode => {
      const childNode = Object.assign({}, originChildNode);

      if (childNode.isLeaf || childNode.isSimple) {
        childNode.domNode.$$clearEvent('$$childNodesUpdate');
        childNode.domNode.addEventListener('$$childNodesUpdate', onChildNodesUpdate);
      }

      delete childNode.domNode;
      childNode.childNodes = dealWithLeafAndSimple(childNode.childNodes, onChildNodesUpdate);

      return childNode;
    });
  }

  return childNodes;
}
