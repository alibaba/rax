import Host from './host';
import EmptyComponent from './empty';
import NativeComponent from './native';
import TextComponent from './text';
import CompositeComponent from './composite';
import FragmentComponent from './fragment';
import reconciler from '../devtools/reconciler';
import { invokeMinifiedError } from '../error';
import toArray from '../toArray';
import { INTERNAL } from '../constant';

export default function inject({ driver, measurer }) {
  // Inject component class
  Host.Empty = EmptyComponent;
  Host.Native = NativeComponent;
  Host.Text = TextComponent;
  Host.Fragment = FragmentComponent;
  Host.Composite = CompositeComponent;

  function getHostPreviousSibling(component) {
    let parent = component;
    while (parent = component._parentInstance && component._parentInstance[INTERNAL]) {
      if (parent instanceof CompositeComponent) {
        component = parent;
        continue;
      }

      const keys = Object.keys(parent._renderedChildren);
      for (let i = component.__mountIndex - 1; i >= 0; i--) {
        const nativeNode = toArray(parent._renderedChildren[keys[i]].__getNativeNode());
        if (nativeNode.length > 0) return nativeNode[nativeNode.length - 1];
      }
      if (parent instanceof FragmentComponent) {
        component = parent;
      } else {
        return null;
      }
    }
  }

  Host.getHostPreviousSibling = getHostPreviousSibling;

  // Inject render driver
  if (!(Host.driver = driver || Host.driver)) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('Driver not found.');
    } else {
      invokeMinifiedError(5);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // Inject devtool renderer hook
    Host.reconciler = reconciler;

    // Inject performance measurer
    Host.measurer = measurer;
  }
}
