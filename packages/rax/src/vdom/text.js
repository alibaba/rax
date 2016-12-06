import Host from './host';
import Hook from '../debug/hook';

/**
 * Text Component
 */
class TextComponent {
  constructor(element) {
    this._currentElement = element;
    this._stringText = String(element);
  }

  mountComponent(parent, context, childMounter) {
    this._parent = parent;
    this._context = context;
    this._mountID = Host.mountID++;

    // Weex dom operation
    let nativeNode = this.getNativeNode();

    if (childMounter) {
      childMounter(nativeNode, parent);
    } else {
      Host.driver.appendChild(nativeNode, parent);
    }

    let instance = {
      _internal: this
    };

    Hook.Reconciler.mountComponent(this);

    return instance;
  }

  unmountComponent(shouldNotRemoveChild) {
    if (this._nativeNode && !shouldNotRemoveChild) {
      Host.driver.removeChild(this._nativeNode, this._parent);
    }

    Hook.Reconciler.unmountComponent(this);

    this._currentElement = null;
    this._nativeNode = null;
    this._parent = null;
    this._context = null;
    this._stringText = null;
  }

  updateComponent(prevElement, nextElement, context) {
    // If some text do noting
    if (prevElement !== nextElement) {
      // Replace current element
      this._currentElement = nextElement;
      // Devtool read the latest stringText value
      this._stringText = String(nextElement);
      Host.driver.updateText(this.getNativeNode(), nextElement);
      Hook.Reconciler.receiveComponent(this);
    }
  }

  getNativeNode() {
    if (this._nativeNode == null) {
      this._nativeNode = Host.driver.createText(this._stringText);
    }
    return this._nativeNode;
  }
}

export default TextComponent;
