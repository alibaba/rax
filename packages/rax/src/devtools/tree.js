/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
import instance from '../vdom/instance';
import Host from '../vdom/host';

// Inject the runtime into a devtools global hook regardless of browser.
// Allows for debugging when the hook is injected on the page.
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
    ComponentTree: {
      getClosestInstanceFromNode(node) {
        return instance.get(node);
      },
      getNodeFromInstance(inst) {
        // inst is an internal instance (but could be a composite)
        while (inst._renderedComponent) {
          inst = inst._renderedComponent;
        }

        if (inst) {
          return inst._nativeNode;
        } else {
          return null;
        }
      }
    },
    Mount: {
      _instancesByReactRootID: Host.rootComponents,

      // Stub - React DevTools expects to find this method and replace it
      // with a wrapper in order to observe new root components being added
      _renderNewRootComponent(/* instance, ... */) { }
    },
    Reconciler: {
      // Stubs - React DevTools expects to find these methods and replace them
      // with wrappers in order to observe components being mounted, updated and
      // unmounted
      mountComponent(/* instance, ... */) { },
      performUpdateIfNecessary(/* instance, ... */) { },
      receiveComponent(/* instance, ... */) { },
      unmountComponent(/* instance, ... */) { }
    },
  });
}
