import { render } from 'rax';
import * as DriverDOM from 'driver-dom';
import hydrate from 'rax-hydrate';
import unmountComponentAtNode from 'rax-unmount-component-at-node';
import findDOMNode from 'rax-find-dom-node';
import createPortal from 'rax-create-portal';

const raxDomRender = (element, container, callback) => render(
  element,
  container,
  {
    driver: DriverDOM,
  },
  callback,
);

export {
  raxDomRender as render,
  hydrate,
  unmountComponentAtNode,
  findDOMNode,
  createPortal,
};

export default {
  render: raxDomRender,
  hydrate,
  unmountComponentAtNode,
  findDOMNode,
  createPortal,
};
