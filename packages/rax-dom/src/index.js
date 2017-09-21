import { render as originRender, unmountComponentAtNode, findDOMNode as orignFindDOMNode, version } from 'rax';

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

export function findDOMNode(componentOrNode) {
  if (typeof componentOrNode !== 'object') {
    throw new Error('findDOMNode: find by neither component nor DOM node.');
  }

  return orignFindDOMNode(componentOrNode);
}

export { unmountComponentAtNode, version };
