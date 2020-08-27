import { propsMap } from '../builtInComponents';
import Node from '../node/node';

export default function simplify(node) {
  const domInfo = node.$$domInfo;
  if (node.nodeType === Node.TEXT_NODE) {
    return domInfo;
  }
  const simpleNode = {};
  for (let attr in domInfo) {
    simpleNode[attr] = domInfo[attr];
  }

  let componentType;
  if (node._behavior) {
    componentType = simpleNode.behavior = node._behavior;
  } else {
    componentType = node.tagName;
  }

  // Get specific props
  const specificProps = propsMap[componentType] || [];
  specificProps.forEach(prop => {
    simpleNode[prop.name] = prop.get(node);
  });

  if (node.childNodes && node.childNodes.length > 0) {
    simpleNode.children = node.childNodes.map(simplify);
  } else {
    simpleNode.children = [];
  }

  return simpleNode;
}
