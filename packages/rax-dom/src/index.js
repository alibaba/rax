import { render } from 'rax';
import DriverDOM from 'driver-dom';
import hydrate from 'rax-hydrate';
import unmountComponentAtNode from 'rax-unmount-component-at-node';
import findDOMNode from 'rax-find-dom-node';
import createPortal from 'rax-create-portal';

export default {
  render: (element, container, callback) => render(
    element,
    container,
    {
      driver: DriverDOM
    },
    callback
  ),
  hydrate,
  unmountComponentAtNode,
  findDOMNode,
  createPortal
};
