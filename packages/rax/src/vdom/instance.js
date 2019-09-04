import Host from './host';
import createElement from '../createElement';
import instantiateComponent from './instantiateComponent';
import Root from './root';
import {INTERNAL, RENDERED_COMPONENT} from '../constant';

/**
 * Instance manager
 */
const KEY = '__r';

export default {
  set(node, instance) {
    if (!node[KEY]) {
      node[KEY] = instance;
      // Record root instance to roots map
      if (instance.rootID) {
        Host.rootInstances[instance.rootID] = instance;
        Host.rootComponents[instance.rootID] = instance[INTERNAL];
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
  mount(element, container, { parent, hydrate }) {
    if (process.env.NODE_ENV !== 'production') {
      Host.measurer && Host.measurer.beforeRender();
    }

    const driver = Host.driver;

    // Real native root node is body
    if (container == null) {
      container = driver.createBody();
    }

    const renderOptions = {
      element,
      container,
      hydrate
    };

    // Before render callback
    driver.beforeRender && driver.beforeRender(renderOptions);

    // Get the context from the conceptual parent component.
    let parentContext;
    if (parent) {
      let parentInternal = parent[INTERNAL];
      parentContext = parentInternal.__processChildContext(parentInternal._context);
    }

    // Update root component
    let prevRootInstance = this.get(container);
    if (prevRootInstance && prevRootInstance.rootID) {
      if (parentContext) {
        // Using __penddingContext to pass new context
        prevRootInstance[INTERNAL].__penddingContext = parentContext;
      }
      prevRootInstance.update(element);
      return prevRootInstance;
    }

    // Init root component with empty children
    let renderedComponent = instantiateComponent(createElement(Root));
    let defaultContext = parentContext || {};
    let rootInstance = renderedComponent.__mountComponent(container, null, defaultContext);
    this.set(container, rootInstance);
    // Mount new element through update queue avoid when there is in rendering phase
    rootInstance.update(element);

    // After render callback
    driver.afterRender && driver.afterRender(renderOptions);

    if (process.env.NODE_ENV !== 'production') {
      // Devtool render new root hook
      Host.reconciler.renderNewRootComponent(rootInstance[INTERNAL][RENDERED_COMPONENT]);

      Host.measurer && Host.measurer.afterRender();
    }

    return rootInstance;
  }
};
