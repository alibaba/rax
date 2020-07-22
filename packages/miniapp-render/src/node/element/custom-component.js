// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';
import Element from '../element';
import cache from '../../utils/cache';
import tool from '../../utils/tool';

class CustomComponent extends Element {
  // Create instance
  static $$create(options, tree) {
    return new CustomComponent(options, tree);
  }

  $$init(options, tree) {
    this.$_behavior = options.componentName;
    this.__nativeType = options.tagName === 'custom-component' ? 'customComponent' : 'miniappPlugin';
    super.$$init(options, tree);
  }

  $$destroy() {
    super.$$destroy();

    this.$_behavior = null;
  }

  $$recycle() {
    this.$$destroy();
  }

  get behavior() {
    return this.$_behavior;
  }

  get $$domInfo() {
    const domInfo = {
      nodeId: this.$$nodeId,
      pageId: this.__pageId,
      nodeType: this.$_type,
      tagName: this.$_tagName,
      id: this.id,
      className: this.className,
      style: this.$__style ? this.style.cssText : '',
      animation: this.$__attrs ? this.$__attrs.get('animation') : {}
    };

    const config = cache.getConfig();
    let nativeInfo = null;
    if (this.__nativeType === 'customComponent') {
      domInfo.customComponentName = this.$_behavior;
      nativeInfo = config.usingComponents[this.$_behavior];
    } else if (this.__nativeType === 'miniappPlugin') {
      domInfo.miniappPluginName = this.$_behavior;
      nativeInfo = config.usingPlugins[this.$_behavior];
    }
    if (nativeInfo) {
      nativeInfo.props.forEach(prop => {
        domInfo[prop] = domInfo[prop] || this.$__attrs.get(prop);
      });
      nativeInfo.events.forEach(event => {
        const eventName = `${this.$_behavior}_${event}_${tool.getId()}`;
        domInfo[event] = eventName;
        cache.setElementMethods(eventName, (...args) => {
          if (isMiniApp) {
            this.$$trigger(event, { args });
          } else {
            const pageInstance = cache.getDocument(this.__pageId)._internal;
            const domNode = pageInstance.getDomNodeFromEvt(eventName, args[0], this.__pageId);
            if (domNode) {
              domNode.$$trigger(event, { args });
            }
          }
        });
      });
    }
    return domInfo;
  }
}

export default CustomComponent;
