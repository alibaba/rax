import { propsMap } from '../builtInComponents';
import Node from '../node/node';

export default function simplify(node) {
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

  if (node.childNodes && node.childNodes.length > 0) {
    domInfo.children = node.childNodes.map(simplify);
  } else {
    domInfo.children = [];
  }

  return domInfo;
}
