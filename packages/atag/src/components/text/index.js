import { PolymerElement } from '@polymer/polymer';

const style = document.createElement('style');
style.innerText = `
  a-text {
    -webkit-user-select: none;
    user-select: none;
    white-space: pre-wrap; /* default to break wrap */
  }

  a-text[selectable=''],
  a-text[selectable='true'] {
    -webkit-user-select: all;
    user-select: all;
  }
`;
document.head.appendChild(style);

export default class TextElement extends PolymerElement {
  static get is() {
    return 'a-text';
  }
}

customElements.define(TextElement.is, TextElement);
