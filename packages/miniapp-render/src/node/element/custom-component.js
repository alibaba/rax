import Element from '../element';
import cache from '../../utils/cache';
import tool from '../../utils/tool';

class CustomComponent extends Element {
  // Create instance
  static _create(options, tree) {
    return new CustomComponent(options, tree);
  }

  _init(options, tree) {
    this.__behavior = options.componentName;
    this.__nativeType = options.tagName === 'custom-component' ? 'customComponent' : 'miniappPlugin';
    super._init(options, tree);
  }

  _destroy() {
    super._destroy();

    this.__behavior = null;
  }

  _recycle() {
    this._destroy();
  }

  get _behavior() {
    return this.__behavior;
  }

  get _domInfo() {
    const domInfo = {
      nodeId: this._nodeId,
      pageId: this.__pageId,
      nodeType: this.__type,
      tagName: this.__tagName,
      id: this.id,
      className: this.className,
      style: this.__style ? this.style.cssText : '',
      animation: this.__attrs ? this.__attrs.get('animation') : {}
    };

    const config = cache.getConfig();
    let nativeInfo = null;
    if (this.__nativeType === 'customComponent') {
      domInfo.customComponentName = this.__behavior;
      nativeInfo = config.usingComponents[this.__behavior];
    } else if (this.__nativeType === 'miniappPlugin') {
      domInfo.miniappPluginName = this.__behavior;
      nativeInfo = config.usingPlugins[this.__behavior];
    }
    if (nativeInfo) {
      // Inject props scanned by babel plugin into domInfo
      nativeInfo.props.forEach(prop => {
        domInfo[prop] = domInfo[prop] || this._attrs && this.__attrs.get(prop);
      });
      // Bind methods to every element which is used recursively to generate dom tree
      nativeInfo.events.forEach(event => {
        const eventName = `${this.__behavior}_${event}_${tool.getId()}`;
        domInfo[event] = eventName;
        cache.setElementMethods(eventName, (...args) => {
          this._trigger(event, { args });
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
    } else {
      this._attrs.set(name, value, immediate);
    }
  }
}

export default CustomComponent;
