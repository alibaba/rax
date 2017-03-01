import injectComponent from './vdom/injectComponent';
import instance from './vdom/instance';
import {setRem} from './style/unit';
import {injectDriver, setDriver} from './driver';
import Hook from './debug/hook';

function render(element, container, options, callback) {
  // Compatible with `render(element, container, callback)`
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  let {Monitor, driver} = options;

  Hook.Monitor = Monitor;

  if (process.env.NODE_ENV !== 'production') {
    Hook.Monitor && Hook.Monitor.beforeRender();
  }

  // Inject component
  injectComponent();

  // Init driver
  driver = driver ? setDriver(driver) : injectDriver();

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

  if (process.env.NODE_ENV !== 'production') {
    Hook.Monitor && Hook.Monitor.afterRender();
  }

  return component;
}

export default render;
