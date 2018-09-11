import { injectStyle } from '../../shared/utils';
import textStyle from './text.less';

@injectStyle(textStyle)
class TextElement extends HTMLElement {
  static get is() {
    return 'a-text';
  }

  constructor() {
    super();
    const root = document.createElement('slot');
    const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(root);
  }
}

export default TextElement;

customElements.define(TextElement.is, TextElement);
