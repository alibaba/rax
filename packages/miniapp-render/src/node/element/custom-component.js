import Element from '../element';
import cache from '../../utils/cache';
import tool from '../../utils/tool';

class CustomComponent extends Element {
  constructor(options) {
    this.__behavior = options.tagName;
    this.__nativeType = options.tagName === 'custom-component' ? 'customComponent' : 'miniappPlugin';
    super.$$init(options);
  }

  $$destroy() {
    super.$$destroy();

    this.__behavior = null;
    this.__nativeType = null;
  }

  get _behavior() {
    return this.__behavior;
  }

  get _renderInfo() {
    const renderInfo = {
      nodeId: this.$$nodeId,
      pageId: this.__pageId,
      nodeType: this.__behavior,
      style: this.style.cssText,
      class: this.className,
      ...this.__attrs.__value
    };

    const config = cache.getConfig();
    let nativeInfo = null;
    if (this.__nativeType === 'customComponent') {
      nativeInfo = config.usingComponents[this.__behavior];
    } else if (this.__nativeType === 'miniappPlugin') {
      nativeInfo = config.usingPlugins[this.__behavior];
    }
    if (nativeInfo) {
      // Bind methods to every element which is used recursively to generate dom tree
      nativeInfo.events.forEach(event => {
        const eventName = `${this.__behavior}_${event}_${tool.getId()}`;
        renderInfo[event] = eventName;
        cache.setElementMethods(eventName, (...args) => {
          this.$$trigger(event, { args });
        });
      });
    }
    return renderInfo;
  }
}

export default CustomComponent;
