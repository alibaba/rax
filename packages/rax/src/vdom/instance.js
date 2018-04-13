import Host from './host';
import {createElement} from '../element';
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

    let prevRootInstance = this.get(container);
    let hasPrevRootInstance = prevRootInstance && prevRootInstance.isRootComponent;

    if (hasPrevRootInstance) {
      let prevRenderedComponent = prevRootInstance.getRenderedComponent();
      let prevElement = prevRenderedComponent._currentElement;
      if (shouldUpdateComponent(prevElement, element)) {
        let prevUnmaskedContext = prevRenderedComponent._context;
        prevRenderedComponent.updateComponent(
          prevElement,
          element,
          prevUnmaskedContext,
          parentContext || prevUnmaskedContext
        );

        return prevRootInstance;
      } else {
        Host.hook.Reconciler.unmountComponent(prevRootInstance);
        unmountComponentAtNode(container);
      }
    }

    let wrappedElement = createElement(Root, null, element);
    let renderedComponent = instantiateComponent(wrappedElement);
    let defaultContext = parentContext || {};
    let rootInstance = renderedComponent.mountComponent(container, null, defaultContext);
    this.set(container, rootInstance);

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
