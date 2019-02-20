import Host from './host';
import BaseComponent from './base';

/**
 * Text Component
 */
class TextComponent extends BaseComponent {
  mountComponent(parent, parentInstance, context, childMounter) {
    this.initComponent(parent, parentInstance, context);

    // Weex dom operation
    let nativeNode = this.getNativeNode();

    if (childMounter) {
      childMounter(nativeNode, parent);
    } else {
      Host.driver.appendChild(nativeNode, parent);
    }

    if (process.env.NODE_ENV !== 'production') {
      Host.hook.Reconciler.mountComponent(this);
    }

    let instance = {
      _internal: this
    };

    return instance;
  }

  unmountComponent(shouldNotRemoveChild) {
    if (this._nativeNode && !shouldNotRemoveChild) {
      Host.driver.removeChild(this._nativeNode, this._parent);
    }

    this.destoryComponent();
  }

  updateComponent(prevElement, nextElement, context) {
    nextElement = String(nextElement);
    // If text is some value that do not update even there number 1 and string "1"
    if (prevElement !== nextElement) {
      // Replace current element
      this._currentElement = nextElement;
      Host.driver.updateText(this.getNativeNode(), this._currentElement);

      if (process.env.NODE_ENV !== 'production') {
        Host.hook.Reconciler.receiveComponent(this);
      }
    }
  }

  createNativeNode() {
    return Host.driver.createText(this._currentElement);
  }
}

export default TextComponent;
