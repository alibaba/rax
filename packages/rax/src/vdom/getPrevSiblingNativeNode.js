import Host from './host';
import toArray from '../toArray';
import { INTERNAL } from '../constant';

/**
 * This function is usually been used to find the closet previous sibling native node of FragmentComponent.
 * FragmentComponent does not have a native node in the DOM tree, so when it is replaced, the new node has no corresponding location to insert.
 * So we need to look forward from the current mount position of the FragmentComponent to the nearest component which have the native node.
 * @param component
 * @return nativeNode
 */
export default function getPrevSiblingNativeNode(component) {
  let parent = component;
  while (parent = component.__parentInstance &&
    component.__parentInstance[INTERNAL]) {
    if (parent instanceof Host.Composite) {
      component = parent;
      continue;
    }

    const keys = Object.keys(parent._renderedChildren);
    for (let i = component.__mountIndex - 1; i >= 0; i--) {
      const nativeNode = toArray(parent._renderedChildren[keys[i]].__getNativeNode());
      if (nativeNode.length > 0) {
        return nativeNode[nativeNode.length - 1];
      }
    }
    if (parent instanceof Host.Fragment) {
      component = parent;
    } else {
      return null;
    }
  }
}
