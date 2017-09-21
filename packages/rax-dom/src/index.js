import { render as originRender, unmountComponentAtNode, findDOMNode as originFindDOMNode, version } from 'rax';

const DOM_OPTIONS = {
  deviceWidth: 750
};

export function render(element, container, callback) {
  return originRender(element, container, DOM_OPTIONS, callback);
}

export function unstable_renderSubtreeIntoContainer(parent, element, container, callback) {
  return originRender(
    element,
    container,
    {
      parent
    },
    callback
  );
}

export function findDOMNode(componentOrNode) {
  // Original findDOMNode in Rax accept string param, but in React that will throw error
  if (typeof componentOrNode === 'string') {
    throw new Error('findDOMNode: find by neither component nor DOM node.');
  }

  return originFindDOMNode(componentOrNode);
}

export { unmountComponentAtNode, version };
