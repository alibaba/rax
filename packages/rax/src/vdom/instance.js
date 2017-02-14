import Host from './host';
import {createElement} from '../element';
import unmountComponentAtNode from '../unmountComponentAtNode';
import instantiateComponent from './instantiateComponent';
import shouldUpdateComponent from './shouldUpdateComponent';
import Root from './root';
import Hook from '../debug/hook';
import {isWeb} from 'universal-env';

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
  render(element, container) {
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
          prevUnmaskedContext
        );

        return prevRootInstance;
      } else {
        Hook.Reconciler.unmountComponent(prevRootInstance);
        unmountComponentAtNode(container);
      }
    }

    // handle rendered ELement
    if (isWeb && container.childNodes) {
      // clone childNodes, Because removeChild will causing change in childNodes length
      const childNodes = [...container.childNodes];

      for (let i = 0; i < childNodes.length; i ++) {
        const rootChildNode = childNodes[i];
        if (rootChildNode.hasAttribute && rootChildNode.hasAttribute('data-rendered')) {
          Host.driver.removeChild(rootChildNode, container);
        }
      }
    }

    let wrappedElement = createElement(Root, null, element);
    let renderedComponent = instantiateComponent(wrappedElement);
    let defaultContext = {};
    let rootInstance = renderedComponent.mountComponent(container, defaultContext);
    this.set(container, rootInstance);
    Hook.Mount._renderNewRootComponent(rootInstance._internal);

    return rootInstance;
  }
};
