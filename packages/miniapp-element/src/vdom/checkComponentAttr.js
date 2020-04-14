import { propsMap } from '../component';

// Check component attribute
export default function checkComponentAttr(instance, name, newData) {
  const oldData = instance.data;
  const { domNode } = instance;
  const attrs = propsMap[name];

  newData.builtinComponentName = name;

  if (attrs && attrs.length) {
    for (const {name, get} of attrs) {
      const newValue = get(domNode);
      if (!oldData || oldData[name] !== newValue) newData[name] = newValue;
    }
  }

  // Add id/class/style/hidden/animation
  const newId = domNode.id;
  if (!oldData || oldData.id !== newId) newData.id = newId;
  const newClass = `builtin-component-${name} node-${domNode.$$nodeId} ${domNode.className || ''}`;
  if (!oldData || oldData.class !== newClass) newData.class = newClass;
  const newStyle = domNode.style.cssText;
  if (!oldData || oldData.style !== newStyle) newData.style = newStyle;
  const newHidden = domNode.getAttribute('hidden') || false;
  if (!oldData || oldData.hidden !== newHidden) newData.hidden = newHidden;
  const newAnimation = domNode.getAttribute('animation');
  if (!oldData || oldData.animation !== newAnimation) newData.animation = newAnimation;
}
