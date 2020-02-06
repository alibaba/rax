import { propsMap } from '../component';

// Check component attribute
export default function checkComponentAttr(name, domNode, destData, oldData) {
  const attrs = propsMap[name];

  destData.builtinComponentName = name;

  if (attrs && attrs.length) {
    for (const {name, get} of attrs) {
      const newValue = get(domNode);
      if (!oldData || oldData[name] !== newValue) destData[name] = newValue;
    }
  }

  // Add id/class/style/hidden
  const newId = domNode.id;
  if (!oldData || oldData.id !== newId) destData.id = newId;
  const newClass = `builtin-component-${name} node-${domNode.$$nodeId} ${domNode.className || ''}`;
  if (!oldData || oldData.class !== newClass) destData.class = newClass;
  const newStyle = domNode.style.cssText;
  if (!oldData || oldData.style !== newStyle) destData.style = newStyle;
  const newHidden = domNode.getAttribute('hidden') || false;
  if (!oldData || oldData.hidden !== newHidden) destData.hidden = newHidden;
}
