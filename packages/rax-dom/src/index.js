import { render as originRender, unmountComponentAtNode, findDOMNode, version } from 'rax';

const DOM_OPTIONS = {
  deviceWidth: 750
};

export function render(element, container, callback) {
  return originRender(element, container, DOM_OPTIONS, callback);
}

export function unstable_renderSubtreeIntoContainer(parentComponent, element, container, callback) {
  // TODO
  return originRender(element, container, callback);
}

export { unmountComponentAtNode, findDOMNode, version };
