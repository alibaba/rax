import { PolymerElement } from '@polymer/polymer';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import debounce from '../../shared/debounce';

const style = document.createElement('style');
style.innerHTML = `
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
const spaces = {
  ensp: ' ',
  emsp: ' ',
  nbsp: ' ',
};
const continuousSpaceReg = /[\u0020\u2002\u2023\f\r\t\v]+/g;
const spaceReg = /[\u0020\u2002\u2023\f\r\t\v]/g;

export default class TextElement extends PolymerElement {
  static get is() {
    return 'a-text';
  }

  static get properties() {
    return {
      selectable: {
        type: Boolean,
        /**
         * Reflect to attribute to apply CSS style.
         */
        reflectToAttribute: true,
        value: false,
      },
      /**
       * Allow continuous spaces
       *  @enum space: false, ensp, emsp, nbsp
       */
      space: {
        type: String,
        value: 'false',
      },
    };
  }

  constructor() {
    super();
    this._observeChildren = debounce(this._observeChildren);
  }

  connectedCallback() {
    super.connectedCallback();
    this.childrenObserver = new FlattenedNodesObserver(this, this._observeChildren);

    if (this.childNodes.length > 0) {
      for (let i = 0, l = this.childNodes.length; i < l; i++) {
        if (this.childNodes[i].nodeType === document.TEXT_NODE) {
          this.childNodes[i].textContent = this._processText(this.childNodes[i].textContent);
        }
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.childrenObserver.disconnect();
  }

  _processText(text) {
    if (this.space === 'false') {
      // by default space equal false
      return text.replace(continuousSpaceReg, ' ');
    } else {
      const space = spaces[this.space];
      if (space === undefined) return text; // illegal space perperty
      return text.replace(spaceReg, space);
    }
  }

  _observeChildren({ addedNodes, target }) {
    if (this === target && addedNodes.length > 0) {
      for (let i = 0; i < addedNodes.length; i++) {
        const node = addedNodes[i];
        if (node.nodeType === document.TEXT_NODE) {
          node.textContent = this._processText(node.textContent);
        }
      }
    }
  }
}

customElements.define(TextElement.is, TextElement);
