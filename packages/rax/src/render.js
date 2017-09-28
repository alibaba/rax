import inject from './inject';
import instance from './vdom/instance';
import Host from './vdom/host';

function render(element, container, options, callback) {
  // Compatible with `render(element, container, callback)`
  if (typeof options === 'function') {
    callback = options;
    options = null;
  }

  options = options || {};
  // Init inject
  inject(options);

  let rootComponent = instance.mount(element, container, options.parent);
  let componentInstance = rootComponent.getPublicInstance();

  if (callback) {
    callback.call(componentInstance);
  }

  return componentInstance;
}

export default render;
