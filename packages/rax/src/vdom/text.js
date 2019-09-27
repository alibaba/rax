import Host from './host';
import BaseComponent from './base';

/**
 * Text Component
 */
class TextComponent extends BaseComponent {
  __updateComponent(prevElement, nextElement, context) {
    nextElement = '' + nextElement;
    // If text is some value that do not update even there number 1 and string "1"
    if (prevElement !== nextElement) {
      // Replace current element
      this.__currentElement = nextElement;
      Host.driver.updateText(this.__getNativeNode(), nextElement);

      if (process.env.NODE_ENV !== 'production') {
        this._stringText = this.__currentElement;
        Host.reconciler.receiveComponent(this);
      }
    }
  }

  __createNativeNode() {
    if (process.env.NODE_ENV !== 'production') {
      this._stringText = this.__currentElement;
    }
    return Host.driver.createText(this.__currentElement, this);
  }
}

export default TextComponent;
