import { propsMap } from '../component';
import shallowEqual from './shallowEqual';

// Check component attribute
export default function checkComponentAttr(
  instance,
  name,
  newData,
  extraClass = ''
) {
  const oldData = instance.data;
  const { domNode } = instance;
  const attrs = propsMap[name];

  newData.builtinComponentName = name;

  if (attrs && attrs.length) {
    for (const { name, get, canBeUserChanged = false } of attrs) {
      const newValue = get(domNode);
      if (canBeUserChanged) {
        const oldValues = domNode.__oldValues;
        if (
          !oldData ||
          !shallowEqual(newValue, oldData[name]) ||
          oldValues && !shallowEqual(newValue, oldValues[name])
        ) {
          newData[name] = newValue;
          newData.forceUpdate = true;
        }
      } else if (!oldData || !shallowEqual(newValue, oldData[name])) {
        newData[name] = newValue;
      }
    }
  }

  // Add id/class/style/hidden/animation
  const newId = domNode.id;
  if (!oldData || oldData.id !== newId) newData.id = newId;
  const newClass = `${extraClass} builtin-component-${name} node-${
    domNode.$$nodeId
  } ${domNode.className || ''}`;
  if (!oldData || oldData.className !== newClass) newData.className = newClass;
  const newStyle = domNode.style.cssText;
  if (!oldData || oldData.style !== newStyle) newData.style = newStyle;
  const newHidden = domNode.getAttribute('hidden') || false;
  if (!oldData || oldData.hidden !== newHidden) newData.hidden = newHidden;
  const newAnimation = domNode.getAttribute('animation');
  if (!oldData || oldData.animation !== newAnimation)
    newData.animation = newAnimation;
}
