import Host from './host';
import BaseComponent from './base';

/**
 * Text Component
 */
class TextComponent extends BaseComponent {
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
