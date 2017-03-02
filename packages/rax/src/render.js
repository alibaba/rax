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

  let {monitor, driver} = options;

  // Init inject
  inject({
    driver
  });

  Host.hook.monitor = monitor;

  if (process.env.NODE_ENV !== 'production') {
    Host.hook.monitor && Host.hook.monitor.beforeRender();
  }

  let rootComponent = instance.render(element, container);
  let component = rootComponent.getPublicInstance();

  if (callback) {
    callback.call(component);
  }

  if (process.env.NODE_ENV !== 'production') {
    Host.hook.monitor && Host.hook.monitor.afterRender();
  }

  return component;
}

export default render;
