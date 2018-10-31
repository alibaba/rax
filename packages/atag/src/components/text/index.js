import { PolymerElement, html } from '@polymer/polymer';

export default class TextElement extends PolymerElement {
  static get is() {
    return 'a-text';
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();

    for (var i = 0; i < this.childNodes.length; i++) {
      var node = this.childNodes[i];
      if (node.nodeType === document.TEXT_NODE) {
        var contents = node.textContent.split('\n');
        if (contents.length > 1) {
          const fragment = document.createDocumentFragment();
          for (var j = 0; j < contents.length; j++) {
            fragment.appendChild(document.createTextNode(contents[j]));
            if ( j !== contents.length - 1) {
              fragment.appendChild(document.createElement('br'));
            }
          }
          node.parentNode.replaceChild(fragment, node);
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
