import { PolymerElement, html } from '@polymer/polymer';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import debounce from '../../shared/debounce';

export default class TextElement extends PolymerElement {
  static get is() {
    return 'a-text';
  }

  constructor() {
    super();
    this._observeChildren = debounce(this._observeChildren);
  }

  connectedCallback() {
    super.connectedCallback()
    this.childrenObserver = new FlattenedNodesObserver(this, this._observeChildren);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.childrenObserver.disconnect();
  }

  _observeChildren({ addedNodes, target }) {
    if (this === target && addedNodes.length > 0) {
      for (let i = 0; i < addedNodes.length; i++) {
        const node = addedNodes[i];
        if (node.nodeType === document.TEXT_NODE) {
          let contents = node.textContent.split('\\n');
          if (contents.length > 1) {
            const fragment = document.createDocumentFragment();
            for (let j = 0; j < contents.length; j++) {
              const textNode = document.createTextNode(contents[j]);
              fragment.appendChild(textNode);
              // Append br at each gap
              if (j !== contents.length - 1) {
                fragment.appendChild(document.createElement('br'));
              }
            }
            node.parentNode.replaceChild(fragment, node);
          }
        }
      }
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          -webkit-user-select: none;
          user-select: none;
        }
  
        :host([selectable='']),
        :host([selectable='true']) {
          -webkit-user-select: all;
          user-select: all;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define(TextElement.is, TextElement);
