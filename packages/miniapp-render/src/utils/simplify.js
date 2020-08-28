import { propsMap } from '../builtInComponents';
import Node from '../node/node';

export default function simplify(node) {
  const domInfo = node.$$domInfo;
  if (node.nodeType === Node.TEXT_NODE) {
    node.__simpleNode = domInfo;
    return domInfo;
  }

  let componentType;
  if (node._behavior) {
    componentType = node._behavior;
  } else {
    componentType = node.tagName;
  }

  // Get specific props
  const specificProps = propsMap[componentType] || [];
  specificProps.forEach(prop => {
    domInfo[prop.name] = prop.get(node);
  });

  if (node.childNodes && node.childNodes.length > 0) {
    domInfo.children = node.childNodes.map(simplify);
  } else {
    domInfo.children = [];
  }

  return domInfo;
}
