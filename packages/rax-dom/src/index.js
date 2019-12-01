import { render } from 'rax';
import * as DriverDOM from 'driver-dom';
import hydrate from 'rax-hydrate';
import unmountComponentAtNode from 'rax-unmount-component-at-node';
import findDOMNode from 'rax-find-dom-node';
import createPortal from 'rax-create-portal';

function normalizeEventName(node, eventName, props) {
  const tagName = node.tagName.toLowerCase();

  if (
    eventName === 'change' &&
    (tagName === 'textarea' ||
      tagName === 'input' && (!props.type || props.type === 'text' || props.type === 'password'))
  ) {
    eventName = 'input';
  } else if (eventName === 'doubleclick') {
    eventName = 'dblclick';
  }
  return eventName;
}

const driver = Object.assign({}, DriverDOM, {
  addEventListener(node, eventName, eventHandler, props) {
    eventName = normalizeEventName(node, eventName, props);
    return DriverDOM.addEventListener(node, eventName, eventHandler, props);
  },
  removeEventListener(node, eventName, eventHandler, props) {
    eventName = normalizeEventName(node, eventName, props);
    return DriverDOM.removeEventListener(node, eventName, eventHandler, props);
  },
});

const domRender = (element, container, callback) => render(
  element,
  container,
  {
    driver,
  },
  callback,
);

export {
  domRender as render,
  hydrate,
  unmountComponentAtNode,
  findDOMNode,
  createPortal,
};

export default {
  render: domRender,
  hydrate,
  unmountComponentAtNode,
  findDOMNode,
  createPortal,
};
