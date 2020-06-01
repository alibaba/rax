// Find the closest parent node
export default function findParentNode(domNode, tagName) {
  const checkParentNode = (parentNode, tagName) => {
    if (!parentNode) return false;
    if (parentNode.tagName === tagName) return true;
    if (parentNode.tagName === 'BUILTIN-COMPONENT' && parentNode.behavior === tagName.toLowerCase()) return true;

    return false;
  };
  let parentNode = domNode.parentNode;

  if (checkParentNode(parentNode, tagName)) return parentNode;
  while (parentNode && parentNode.tagName !== tagName) {
    parentNode = parentNode.parentNode;
    if (checkParentNode(parentNode, tagName)) return parentNode;
  }

  return null;
}
