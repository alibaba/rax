export default class UnknownElement extends HTMLElement {
  static get is() {
    return 'a-unknown';
  }
}

customElements.define(UnknownElement.is, UnknownElement);
