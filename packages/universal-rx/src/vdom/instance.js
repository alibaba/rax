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
        Host.roots[instance.rootID] = instance;
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
        delete Host.roots[instance.rootID];
      }
    }
  },
  render(element, container) {
    let prevRootComponent = this.get(container);
    let hasPrevRootComponent = prevRootComponent && prevRootComponent.isRootComponent;

    if (hasPrevRootComponent) {
      let prevRenderedComponent = prevRootComponent.getRenderedComponent();
      let prevElement = prevRenderedComponent._currentElement;
      if (shouldUpdateComponent(prevElement, element)) {
        let prevUnmaskedContext = prevRenderedComponent._context;
        prevRenderedComponent.updateComponent(
          prevElement,
          element,
          prevUnmaskedContext,
          prevUnmaskedContext
        );

        return prevRootComponent;
      } else {
        unmountComponentAtNode(container);
      }
    }

    let wrappedElement = createElement(Root, null, element);
    let renderedComponent = instantiateComponent(wrappedElement);
    let defaultContext = {};
    let rootComponent = renderedComponent.mountComponent(container, defaultContext);
    this.set(container, rootComponent);

    return rootComponent;
  }
};
