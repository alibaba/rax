import Host from './host';
import BaseComponent from './base';

/**
 * Text Component
 */
class TextComponent extends BaseComponent {
  $$updateComponent(prevElement, nextElement, context) {
    nextElement = String(nextElement);
    // If text is some value that do not update even there number 1 and string "1"
    if (prevElement !== nextElement) {
      // Replace current element
      this.$$currentElement = nextElement;
      Host.driver.updateText(this.$$getNativeNode(), this.$$currentElement);

      if (process.env.NODE_ENV !== 'production') {
        this._stringText = this.$$currentElement;
        Host.reconciler.receiveComponent(this);
      }
    }
  }

  $$createNativeNode() {
    if (process.env.NODE_ENV !== 'production') {
      this._stringText = this.$$currentElement;
    }
    return Host.driver.createText(this.$$currentElement, this);
  }
}

export default TextComponent;
