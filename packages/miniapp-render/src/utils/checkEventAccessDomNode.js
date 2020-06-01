export default function(evt, domNode, dest) {
  const targetNode = dest || domNode.ownerDocument.body;
  let target = evt.target;

  if (domNode === targetNode) return true;

  while (target && target !== dest) {
    if (target === domNode) return true;
    target = target.parentNode;
  }

  return false;
}
