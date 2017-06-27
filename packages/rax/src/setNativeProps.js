import Host from './vdom/host';
import findDOMNode from './findDOMNode';

export default function setNativeProps(node, props) {
  node = findDOMNode(node);
  Host.driver.setNativeProps(node, props);
}
