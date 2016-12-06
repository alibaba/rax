import Host from './vdom/host';
import findDOMNode from './findDOMNode';

const STYLE = 'style';
const CHILDREN = 'children';

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
      } else if (prop.substring(0, 2) === 'on') {
        let eventName = prop.slice(2).toLowerCase();
        Host.driver.addEventListener(node, eventName, value);
      } else {
        Host.driver.setAttribute(node, prop, value);
      }
    }
  }
}
