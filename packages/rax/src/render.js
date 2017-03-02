import inject from './inject';
import instance from './vdom/instance';
import {setRem} from './style/unit';

function render(element, container, driver, callback) {
  // Compatible with `render(element, container, callback)`
  if (typeof driver === 'function') {
    callback = driver;
    driver = null;
  }

  // Init inject
  inject({
    driver
  });

  let rootComponent = instance.render(element, container);
  let component = rootComponent.getPublicInstance();

  if (callback) {
    callback.call(component);
  }

  return component;
}

export default render;
