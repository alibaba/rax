import mp from 'miniapp-render/dist/ali';
import _ from './tool';
import component from './component';

const {
  Event,
} = mp.$$adapter;
const {
  NOT_SUPPORT,
} = _;
const {
  componentNameMap,
} = component;

export default {
  /**
     * 初始化
     */
  init(data) {
    const domNode = this.domNode;
    const tagName = domNode.tagName;

    if (tagName === 'BUILTIN-COMPONENT') {
      // 内置组件
      data.builtinComponentName = domNode.behavior;
      const builtinComponentName = componentNameMap[data.builtinComponentName];
      if (builtinComponentName) _.checkComponentAttr(builtinComponentName, domNode, data);
      else console.warn(`value "${data.builtinComponentName}" is not supported for builtin-component's behavior`);
    } else if (tagName === 'CUSTOM-COMPONENT') {
      // 自定义组件
      data.customComponentName = domNode.behavior;
      data.nodeId = this.nodeId;
      data.pageId = this.pageId;
    } else if (NOT_SUPPORT.indexOf(tagName) >= 0) {
      // 不支持标签
      data.builtinComponentName = 'not-support';
      data.content = domNode.textContent;
    } else {
      // 可替换 html 标签
      const builtinComponentName = componentNameMap[tagName];
      if (builtinComponentName) _.checkComponentAttr(builtinComponentName, domNode, data);
    }
  },

  /**
     * 触发简单节点事件
     */
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
