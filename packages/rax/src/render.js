import inject from './inject';
import instance from './vdom/instance';
import {setRem} from './style/unit';
import Host from './vdom/host';

function render(element, container, options = {}, callback) {
  // Compatible with `render(element, container, callback)`
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  let {measurer, driver} = options;

  // Init inject
  inject({
    driver,
    measurer
  });

  let rootComponent = instance.render(element, container);
  let component = rootComponent.getPublicInstance();

  if (callback) {
    callback.call(component);
  }

  return component;
}

export default render;
