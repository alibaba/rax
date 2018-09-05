import { HTMLElement } from 'Element';
import '../../../vendors/icons'; // reg icons

export default class IconElement extends HTMLElement {
  static get is() {
    return 'a-icon';
  }

  constructor(...args) {
    super(...args);
  }

  _createElement() {
    const { color, type, size } = this;
    const style = `
      width: ${size};
      height: ${size};
      vertical-align: -0.15em;
      fill: ${color};
      overflow: hidden;
    `;

    return `<svg style="${style}"><use xlink:href="#${type}"></use></svg>`;
  }

  updateHTML() {
    this.innerHTML = this._createElement();
  }

  connectedCallback() {
    this.updateHTML();
  }

  static observedAttributes = ['size', 'type', 'color'];

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateHTML();
  }

  get type() {
    const rawType = this.getAttribute('type');
    if (typeof rawType === 'string' && rawType.slice(0, 5) !== 'icon-') {
      return 'icon-' + rawType;
    } else {
      return null;
    }
  }

  get color() {
    return this.getAttribute('color') || 'currentColor';
  }

  get size() {
    const sizeNumber = this.getAttribute('size') || '23';
    return parseFloat(sizeNumber) / 7.5 + 'vw';
  }
}

customElements.define(IconElement.is, IconElement);
