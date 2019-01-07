import { render as originRender } from 'rax';
import DomDriver from 'driver-dom';

const ADD_EVENT = 'addEvent';

DomDriver.eventRegistry = {
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
};

export function render(element, container, callback) {
  return originRender(element, container, {
    driver: DomDriver
  }, callback);
}
