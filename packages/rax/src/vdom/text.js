import Host from './host';
import BaseComponent from './base';
import { CURRENT_ELEMENT } from '../constant';

/**
 * Text Component
 */
class TextComponent extends BaseComponent {
  $_updateComponent(prevElement, nextElement, context) {
    nextElement = String(nextElement);
    // If text is some value that do not update even there number 1 and string "1"
    if (prevElement !== nextElement) {
      // Replace current element
      this[CURRENT_ELEMENT] = nextElement;
      Host.driver.updateText(this.$_getNativeNode(), this[CURRENT_ELEMENT]);

      if (process.env.NODE_ENV !== 'production') {
        this._stringText = this[CURRENT_ELEMENT];
        Host.reconciler.receiveComponent(this);
      }
    }
  }

  $_createNativeNode() {
    if (process.env.NODE_ENV !== 'production') {
      this._stringText = this[CURRENT_ELEMENT];
    }
    return Host.driver.createText(this[CURRENT_ELEMENT], this);
  }
}

export default TextComponent;
