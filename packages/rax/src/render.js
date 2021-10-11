import injectRenderOptions from './vdom/injectRenderOptions';
import Instance from './vdom/instance';
import { isFunction, EMPTY_OBJECT } from './types';
import inject from './vdom/inject';

// Inject init options to host, avoid circle deps between class component file and ./vdom/host
inject();

function render(element, container, options, callback) {
  // Compatible with `render(element, container, callback)`
  if (isFunction(options)) {
    callback = options;
    options = null;
  }

  options = options || EMPTY_OBJECT;
  // Init inject
  injectRenderOptions(options);

  let rootComponent = Instance.mount(element, container, options);
  let componentInstance = rootComponent.__getPublicInstance();

  if (callback) {
    callback.call(componentInstance);
  }

  return componentInstance;
}

export default render;
