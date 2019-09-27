import Host from './host';
import { isArray } from '../types';
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
    if (parent instanceof Host.__Composite) {
      component = parent;
      continue;
    }

    const keys = Object.keys(parent.__renderedChildren);
    // Find previous sibling native node from current mount index
    for (let i = component.__mountIndex - 1; i >= 0; i--) {
      const nativeNode = parent.__renderedChildren[keys[i]].__getNativeNode();
      // Fragment component always return array
      if (isArray(nativeNode)) {
        if (nativeNode.length > 0) {
          // Get the last one
          return nativeNode[nativeNode.length - 1];
        }
      } else {
        // Others maybe native node or empty node
        return nativeNode;
      }
    }

    // Find parent over parent
    if (parent instanceof Host.__Fragment) {
      component = parent;
    } else {
      return null;
    }
  }
}
