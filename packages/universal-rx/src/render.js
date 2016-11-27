import {createElement} from './element';
import instantiateComponent from './vdom/instantiateComponent';
import shouldUpdateComponent from './vdom/shouldUpdateComponent';
import injectComponent from './vdom/injectComponent';
import unmountComponentAtNode from './unmountComponentAtNode';
import Root from './vdom/root';
import instance from './vdom/instance';
import {setRem} from './style/unit';
import {injectDriver, getDriver} from './driver';

const FULL_WIDTH_REM = 750;

function initRem(driver) {
  if (!driver || !driver.getWindowWidth) return;
  setRem(driver.getWindowWidth() / FULL_WIDTH_REM);
}

function render(element, container, callback) {
  // Inject component
  injectComponent();
  // Inject driver
  injectDriver();

  let driver = getDriver();

  // Before render callback
  driver.beforeRender && driver.beforeRender(element, container);

  // Init rem unit
  initRem(driver);

  // Real native root node is body
  if (container == null) {
    container = driver.createBody();
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
  driver.afterRender && driver.afterRender(component);

  return component;
}

export default render;
