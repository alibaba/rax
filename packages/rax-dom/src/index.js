import { render as originRender, unmountComponentAtNode, findDOMNode as originFindDOMNode, version } from 'rax';

const ADD_EVENT = 'addEvent';
const REMOVE_EVENT = 'removeEvent';
const DOM_OPTIONS = {
  deviceWidth: 750,
  eventRegistry: {
    change: function(eventType, node, eventName, eventHandler, props) {
      let tagName = node.tagName.toLowerCase();

      if (
        tagName === 'textarea' ||
        tagName === 'input' && (!props.type || props.type === 'text' || props.type === 'password')
      ) {
        eventName = 'input';
      }

      if (eventType === ADD_EVENT) {
        return node.addEventListener(eventName, eventHandler);
      } else {
        return node.removeEventListener(eventName, eventHandler);
      }
    },
    doubleclick: function(eventType, node, eventName, eventHandler, props) {
      eventName = 'dblclick';

      if (eventType === ADD_EVENT) {
        return node.addEventListener(eventName, eventHandler);
      } else {
        return node.removeEventListener(eventName, eventHandler);
      }
    }
  }
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
