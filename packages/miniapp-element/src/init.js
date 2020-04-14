import { componentNameMap } from './component';
import { NOT_SUPPORT } from './constants';
import checkComponentAttr from './vdom/checkComponentAttr';

export default function(instance, data) {
  const domNode = instance.domNode;
  const tagName = domNode.tagName;

  if (tagName === 'BUILTIN-COMPONENT') {
    // BuildIn component
    data.builtinComponentName = domNode.behavior;
    const builtinComponentName = componentNameMap[data.builtinComponentName];
    if (builtinComponentName) checkComponentAttr(instance, builtinComponentName, data);
    else console.warn(`value "${data.builtinComponentName}" is not supported for builtin-component's behavior`);
  } else if (tagName === 'CUSTOM-COMPONENT') {
    // Custom component
    data.customComponentName = domNode.behavior;
    data.nodeId = instance.nodeId;
    data.pageId = instance.pageId;
  } else if (NOT_SUPPORT.indexOf(tagName) >= 0) {
    // Not supported component
    data.builtinComponentName = 'not-support';
    data.content = domNode.textContent;
  } else {
    // Could be replaced html tag
    const builtinComponentName = componentNameMap[tagName.toLowerCase()];
    if (builtinComponentName) checkComponentAttr(instance, builtinComponentName, data);
  }
}
