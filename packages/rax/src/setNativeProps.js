import Host from './vdom/host';
import findDOMNode from './findDOMNode';

const STYLE = 'style';
const CHILDREN = 'children';
const EVENT_PREFIX_REGEXP = /on[A-Z]/;

export default function setNativeProps(node, props, disableSetStyles) {
  node = findDOMNode(node);

  for (let prop in props) {
    let value = props[prop];
    if (prop === CHILDREN) {
      continue;
    }

    if (value != null) {
      if (prop === STYLE) {
        if (disableSetStyles) {
          continue;
        }
        Host.driver.setStyles(node, value);
      } else if (EVENT_PREFIX_REGEXP.test(prop)) {
        let eventName = prop.slice(2).toLowerCase();
        Host.driver.addEventListener(node, eventName, value);
      } else {
        Host.driver.setAttribute(node, prop, value);
      }
    }
  }
}
