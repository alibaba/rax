import Host from './host';
import toArray from '../toArray';
import { INTERNAL } from '../constant';

export default function getHostPreviousSibling(component) {
  let parent = component;
  while (parent = component._parentInstance && component._parentInstance[INTERNAL]) {
    if (parent instanceof Host.Composite) {
      component = parent;
      continue;
    }

    const keys = Object.keys(parent._renderedChildren);
    for (let i = component.__mountIndex - 1; i >= 0; i--) {
      const nativeNode = toArray(parent._renderedChildren[keys[i]].__getNativeNode());
      if (nativeNode.length > 0) return nativeNode[nativeNode.length - 1];
    }
    if (parent instanceof Host.Fragment) {
      component = parent;
    } else {
      return null;
    }
  }
}
