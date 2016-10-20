import {createElement} from './element';
import instantiateComponent from './vdom/instantiateComponent';
import shouldUpdateComponent from './vdom/shouldUpdateComponent';
import injectComponent from './vdom/injectComponent';
import unmountComponentAtNode from './unmountComponentAtNode';
import Host from './vdom/host';
import Root from './vdom/root';
import instance from './vdom/instance';
import WeexDriver from './drivers/weex';
import BrowserDriver from './drivers/browser';
import {setRem} from './style/unit';
import {isWeb, isWeex} from 'universal-env';

const FULL_WIDTH_REM = 750;

function getDriver() {
  let driver;
  if (isWeex) {
    driver = WeexDriver;
  } else if (isWeb) {
    driver = BrowserDriver;
  } else {
    throw Error('Encountered unknown container');
  }
  return driver;
}

function initRem(driver) {
  if (!driver || !driver.getWindowWidth) return;
  setRem(driver.getWindowWidth() / FULL_WIDTH_REM);
}

function render(element, container, callback) {

  // Inject component
  injectComponent();

  // Inject driver
  if (!Host.driver) {
    let driver = getDriver();
    Host.driver = driver;
  }

  // Before render callback
  Host.driver.beforeRender && Host.driver.beforeRender(element, container);

  // Init rem unit
  initRem(Host.driver);

  // Real native root node is body
  if (container == null || container === Host.document) {
    container = Host.driver.createBody();
  }

  let prevRootComponent = instance.get(container);
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

      if (callback) {
        callback.call(component);
      }

      return prevRootComponent.getPublicInstance();
    } else {
      unmountComponentAtNode(container);
    }
  }

  let wrappedElement = createElement(Root, null, element);
  let renderedComponent = instantiateComponent(wrappedElement);
  let defaultContext = {};
  let rootComponent = renderedComponent.mountComponent(container, defaultContext);
  let component = rootComponent.getPublicInstance();

  instance.set(container, rootComponent);

  if (callback) {
    callback.call(component);
  }

  // After render callback
  Host.driver.afterRender && Host.driver.afterRender(component);

  return component;
}

export default render;
