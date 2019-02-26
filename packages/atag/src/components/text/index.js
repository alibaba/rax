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
const SPACE = 'space';
const SELECTABLE = 'selectable';

export default class TextElement extends HTMLElement {
  static get is() {
    return 'a-text';
  }

  /**
   * Allow continuous spaces.
   * @type {String}
   * @enum space: false, ensp, emsp, nbsp
   */
  get space() {
    return this.getAttribute(SPACE) || 'false';
  }
  set space(val) {
    this.setAttribute(SPACE, val);
  }

  /**
   * Reflect to attribute to apply CSS style.
   * @type {Boolean}
   */
  get selectable() {
    return this.getAttribute(SELECTABLE) === 'true';
  }
  set selectable(val) {
    if (val) {
      this.setAttribute(SELECTABLE, val);
    } else {
      this.removeAttribute(SELECTABLE);
    }
  }

  constructor() {
    super();
    this._observeChildren = debounce(this._observeChildren);
  }

  connectedCallback() {
    this.childrenObserver = new FlattenedNodesObserver(this, this._observeChildren);

    if (this.childNodes.length > 0) {
      const space = this.space;
      for (let i = 0, l = this.childNodes.length; i < l; i++) {
        if (this.childNodes[i].nodeType === document.TEXT_NODE) {
          this.childNodes[i].textContent = processText(this.childNodes[i].textContent, space);
        }
      }
    }
  }

  disconnectedCallback() {
    this.childrenObserver.disconnect();
  }

  _observeChildren({ addedNodes, target }) {
    if (this === target && addedNodes.length > 0) {
      const space = this.space;
      for (let i = 0, l = addedNodes.length; i < l; i++) {
        const node = addedNodes[i];
        if (node.nodeType === document.TEXT_NODE) {
          node.textContent = processText(node.textContent, space);
        }
      }
    }
  }
}

customElements.define(TextElement.is, TextElement);

/**
 * Handle with text spaces.
 * @param text
 * @param propSpace
 * @return {String}
 */
function processText(text, propSpace) {
  if (propSpace === 'false') {
    // by default space equal false
    return text.replace(continuousSpaceReg, ' ');
  } else {
    const space = spaces[propSpace];
    if (space === undefined) return text; // illegal space perperty
    return text.replace(spaceReg, space);
  }
}
