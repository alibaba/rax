import inject from './vdom/inject';
import Instance from './vdom/instance';
import { isFunction, EMPTY_OBJECT } from './types';

function render(element, container, options, callback) {
  // Compatible with `render(element, container, callback)`
  if (isFunction(options)) {
    callback = options;
    options = null;
  }

  options = options || EMPTY_OBJECT;
  // Init inject
  inject(options);

  let rootComponent = Instance.mount(element, container, options);
  let componentInstance = rootComponent.__getPublicInstance();

  if (callback) {
    callback.call(componentInstance);
  }

  return componentInstance;
}

export default render;
