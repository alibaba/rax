import { Event } from 'miniapp-render';
import { componentNameMap } from '../component';
import { NOT_SUPPORT } from './constants';
import checkComponentAttr from '../vdom/checkComponentAttr';

export default {
  init(data) {
    const domNode = this.domNode;
    const tagName = domNode.tagName;

    if (tagName === 'BUILTIN-COMPONENT') {
      // BuildIn component
      data.builtinComponentName = domNode.behavior;
      const builtinComponentName = componentNameMap[data.builtinComponentName];
      if (builtinComponentName) checkComponentAttr(builtinComponentName, domNode, data);
      else console.warn(`value "${data.builtinComponentName}" is not supported for builtin-component's behavior`);
    } else if (tagName === 'CUSTOM-COMPONENT') {
      // Custom component
      data.customComponentName = domNode.behavior;
      data.nodeId = this.nodeId;
      data.pageId = this.pageId;
    } else if (NOT_SUPPORT.indexOf(tagName) >= 0) {
      // Not supported component
      data.builtinComponentName = 'not-support';
      data.content = domNode.textContent;
    } else {
      // Could be replaced html tag
      const builtinComponentName = componentNameMap[tagName];
      if (builtinComponentName) checkComponentAttr(builtinComponentName, domNode, data);
    }
  },

  // Call simple node event
  callSimpleEvent(eventName, evt, domNode) {
    domNode = domNode || this.domNode;
    if (!domNode) return;

    domNode.$$trigger(eventName, {
      event: new Event({
        name: eventName,
        target: domNode,
        eventPhase: Event.AT_TARGET,
        detail: evt && evt.detail,
        $$extra: evt && evt.extra,
      }),
      currentTarget: domNode,
    });
  },
};
