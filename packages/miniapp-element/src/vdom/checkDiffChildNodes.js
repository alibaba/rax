import { ELEMENT_DIFF_KEYS, TEXT_NODE_DIFF_KEYS } from '../constants';
import shallowEqual from './shallowEqual';

export default function checkDiffChildNodes(newChildNodes, oldChildNodes) {
  if (newChildNodes.length !== oldChildNodes.length) return true;

  for (let i = 0, len = newChildNodes.length; i < len; i++) {
    const newChild = newChildNodes[i];
    const oldChild = oldChildNodes[i];

    if (newChild.type !== oldChild.type) return true;

    const keys = newChild.type === 'element' ? ELEMENT_DIFF_KEYS : TEXT_NODE_DIFF_KEYS;

    for (const key of keys) {
      const newValue = newChild[key];
      const oldValue = oldChild[key];
      if (typeof newValue === 'object' && !Array.isArray(newValue)) {
        if (typeof oldValue !== 'object') return true;

        if (key === 'extra' && newValue.forceUpdate) {
          newValue.forceUpdate = false;
          return true;
        }

        const objectKeys = Object.keys(newValue);
        for (const objectKey of objectKeys) {
          if (!shallowEqual(newValue[objectKey], oldValue[objectKey])) return true;
        }
      } else if (!shallowEqual(newValue, oldValue)) {
        return true;
      }
    }

    // Diff children
    const newGrandChildNodes = newChild.childNodes || [];
    const oldGrandChildNodes = oldChild.childNodes || [];
    if (newGrandChildNodes.length || oldGrandChildNodes.length) {
      const checkRes = checkDiffChildNodes(newGrandChildNodes, oldGrandChildNodes);
      if (checkRes) return true;
    }
  }

  return false;
}
