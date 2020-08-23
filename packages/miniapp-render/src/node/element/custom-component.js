import Element from '../element';
import cache from '../../utils/cache';
import tool from '../../utils/tool';

class CustomComponent extends Element {
  // Create instance
  static $$create(options, tree) {
    return new CustomComponent(options, tree);
  }

  $$init(options, tree) {
    const config = cache.getConfig();
    this.__behavior = options.componentName;
    this.__domInfo = {};
    this.__events = [];
    if (options.tagName === 'custom-component') {
      this.__nativeType = 'customComponent';
      this.__domInfo.customComponentName = this.__behavior;
      this.__nativeInfo = config.usingComponents[this.__behavior];
    } else if (options.tagName === 'miniapp-plugin') {
      this.__nativeType = 'miniappPlugin';
      this.__domInfo.miniappPluginName = this.__behavior;
      this.__nativeInfo = config.usingPlugins[this.__behavior];
    }
    super.$$init(options, tree);
  }

  $$destroy() {
    super.$$destroy();

    this.__behavior = null;
  }

  $$recycle() {
    this.$$destroy();
  }

  get _behavior() {
    return this.__behavior;
  }

  get $$domInfo() {
    const domInfo = Object.assign({}, {
      nodeId: this.$$nodeId,
      pageId: this.__pageId,
      nodeType: this.$_type,
      tagName: this.$_tagName,
      id: this.id,
      className: this.className,
      style: this.$__style ? this.style.cssText : '',
      animation: this.$__attrs ? this.$__attrs.get('animation') : {}
    }, this.__domInfo);

    if (this.__nativeInfo) {
      // Inject props scanned by babel plugin into domInfo
      this.__nativeInfo.props.forEach(({ name }) => {
        domInfo[name] = domInfo[name] || this.$_attrs && this.$__attrs.get(name);
      });
      // Bind methods to every element which is used recursively to generate dom tree
      this.__events.forEach(({ eventName, name }) => {
        domInfo[name] = eventName;
        cache.setElementMethods(eventName, (...args) => {
          this.$$trigger(eventName, { args });
        });
      });
    }
    return domInfo;
  }

  setAttribute(name, value, immediate = true) {
    if (typeof name !== 'string') return;

    if (name === 'id') {
      // id to be handled here in advance
      this.id = value;
    } else if (
      typeof value === 'function'
      && this.__nativeInfo
      && this.__nativeInfo.events.some(({ name: originalName }) => originalName === name)
    ) {
      const eventName = `${this.__behavior}_${name}_${tool.getId()}`;
      this.addEventListener(eventName, value);
      this.__events.push({
        eventName,
        name
      });
    } else {
      this.$_attrs.set(name, value, immediate);
    }
  }
}

export default CustomComponent;
