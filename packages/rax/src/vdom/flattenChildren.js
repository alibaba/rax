import { isArray } from '../types';

function traverseChildren(children, result) {
  if (isArray(children)) {
    for (let i = 0, l = children.length; i < l; i++) {
      traverseChildren(children[i], result);
    }
  } else {
    result.push(children);
  }
}

export default function flattenChildren(children) {
  if (children == null) {
    return children;
  }
  const result = [];
  traverseChildren(children, result);

  // If length equal 1, return the only one.
  return result.length - 1 ? result : result[0];
}
