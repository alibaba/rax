import Host from './vdom/host';

function findDOMNode(instance) {
  if (instance == null) {
    return null;
  }

  // If a native node, weex may not export ownerDocument property
  if (instance.ownerDocument || instance.nodeType) {
    return instance;
  }

  // Native component
  if (instance._nativeNode) {
    return instance._nativeNode;
  }

  if (typeof instance == 'string') {
    return Host.driver.getElementById(instance);
  }

  if (typeof instance.render !== 'function') {
    throw new Error('Appears to be neither Component nor DOMNode.');
  }

  // Composite component
  let internal = instance._internal;

  if (internal) {
    while (!internal._nativeNode) {
      internal = internal._renderedComponent;
      // If not mounted
      if (internal == null) {
        return null;
      }
    }
    return internal._nativeNode;
  } else {
    throw new Error('findDOMNode was called on an unmounted component.');
  }
}

export default findDOMNode;
