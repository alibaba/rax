import injectComponent from './vdom/injectComponent';
import instance from './vdom/instance';
import {setRem} from './style/unit';
import {injectDriver, getDriver} from './driver';

function render(element, container, callback) {
  // Inject component
  injectComponent();
  // Inject driver
  injectDriver();

  let driver = getDriver();

  // Before render callback
  driver.beforeRender && driver.beforeRender(element, container);

  // Real native root node is body
  if (container == null) {
    container = driver.createBody();
  }

  let rootComponent = instance.render(element, container);
  let component = rootComponent.getPublicInstance();

  if (callback) {
    callback.call(component);
  }
  // After render callback
  driver.afterRender && driver.afterRender(component);

  return component;
}

export default render;
