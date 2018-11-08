import { PolymerElement, html } from '@polymer/polymer';

export default class UnknownElement extends PolymerElement {
  static get is() {
    return 'a-unknown';
  }
  static get template() {
    // Must have an empty text node for fragment
    return html(' ');
  }
}

customElements.define(UnknownElement.is, UnknownElement);
