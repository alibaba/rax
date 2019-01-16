import Host from './host';
import createElement from '../createElement';
import unmountComponentAtNode from '../unmountComponentAtNode';
import instantiateComponent from './instantiateComponent';
import shouldUpdateComponent from './shouldUpdateComponent';
import Root from './root';

/**
 * Instance manager
 */
const KEY = '$$instance';

export default {
  set(node, instance) {
    if (!node[KEY]) {
      node[KEY] = instance;
      // Record root instance to roots map
      if (instance.rootID) {
        Host.rootInstances[instance.rootID] = instance;
        Host.rootComponents[instance.rootID] = instance._internal;
      }
    }
  },
  get(node) {
    return node[KEY];
  },
  remove(node) {
    let instance = this.get(node);
    if (instance) {
      node[KEY] = null;
      if (instance.rootID) {
        delete Host.rootComponents[instance.rootID];
        delete Host.rootInstances[instance.rootID];
      }
    }
  },
  mount(element, container, parentInstance) {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }

    // Before render callback
    Host.driver.beforeRender && Host.driver.beforeRender();

    // Real native root node is body
    if (container == null) {
      container = Host.driver.createBody();
    }

    // Get the context from the conceptual parent component.
    let parentContext;
    if (parentInstance) {
      let parentInternal = parentInstance._internal;
      parentContext = parentInternal._processChildContext(parentInternal._context);
    }

    // Update root component
    let prevRootInstance = this.get(container);
    if (prevRootInstance && prevRootInstance.rootID) {
      if (parentContext) {
        // Using _penddingContext to pass new context
        prevRootInstance._internal._penddingContext = parentContext;
      }
      prevRootInstance.update(element);
      return prevRootInstance;
    }

    // Init root component with empty children
    let renderedComponent = instantiateComponent(createElement(Root));
    let defaultContext = parentContext || {};
    let rootInstance = renderedComponent.mountComponent(container, null, defaultContext);
    this.set(container, rootInstance);
    // Mount new element through update queue avoid when there is in rendering phase
    rootInstance.update(element);

    // After render callback
    Host.driver.afterRender && Host.driver.afterRender(rootInstance);

    // Devtool render new root hook
    Host.hook.Mount._renderNewRootComponent(rootInstance._internal);

    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.afterRender();
    }

    return rootInstance;
  }
};
