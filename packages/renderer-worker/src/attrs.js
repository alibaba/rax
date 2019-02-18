import { setStyle } from './styles';
import camelCase from './camelCase';
import kebabCase from './kebabCase';

const STYLE = 'style';
const INVALID_ATTRS_MAP = {
  /**
   * In web components, slot attribute has side effects to
   * deliver child nodes.
   */
  slot: true,
};

export function isInvalidAttr(attr) {
  return INVALID_ATTRS_MAP.hasOwnProperty(attr);
}

export function setAttribute(node, attrName, value) {
  if (isInvalidAttr(attrName)) return;

  if (attrName === STYLE) {
    setStyle(node, value);
    return;
  }

  if (typeof value === 'object' || typeof value === 'boolean') {
    /**
     * Transform kebab cased attribute name to camel cased property name.
     * <a-view foo-bar="true" />
     * ->
     * el.fooBar = true;
     */
    node[camelCase(attrName)] = value;
  } else {
    attrName = kebabCase(attrName);
    if (value == null) {
      node.removeAttribute(attrName);
    } else {
      node.setAttribute(attrName, value);
    }
  }
}
