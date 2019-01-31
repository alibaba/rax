// Register icons.
import './icons';

/**
 * Instead of shadow DOM, svg only accept light DOM reference.
 */
export default class IconElement extends HTMLElement {
  static get is() {
    return 'a-icon';
  }

  static observedAttributes = ['size', 'type', 'color'];

  _createElement({ color, type, size }) {
    const pixelSize = parseFloat(size) + 'px';
    const style = [
      `width: ${pixelSize}`,
      `height: ${pixelSize}`,
      'vertical-align: -0.15em',
      `fill: ${color}`,
      'overflow: hidden'
    ].join(';');
    const iconType = typeof type === 'string' && type.slice(0, 5) !== 'icon-'
      ? 'icon-' + type : null;

    return `<svg style="${style}"><use xlink:href="#${iconType}"></use></svg>`;
  }

  /**
   * Diff prop changes and update HTML.
   * @private
   */
  _updateHTML() {
    const { color, type, size } = this;
    /**
     * Performance update.
     */
    if (this._prevColor !== color || this._prevType !== type || this._prevSize !== size) {
      this._prevColor = color;
      this._prevType = type;
      this._prevSize = size;
      this.innerHTML = this._createElement({ color, type, size });
    }
  }

  // DOM Tree changed.
  connectedCallback() {
    this._updateHTML();
  }

  // Property changes from attributes.
  attributeChangedCallback(name, oldValue, newValue) {
    this._updateHTML();
  }

  // Property changes
  get type() {
    return this.getAttribute('type') || '';
  }

  set type(val) {
    this.setAttribute('type', val);
  }

  get color() {
    return this.getAttribute('color') || 'currentColor';
  }

  set color(val) {
    this.setAttribute('color', val);
  }

  get size() {
    if (this.hasAttribute('size')) {
      return Number(this.getAttribute('size'));
    } else {
      return 23; // Default size.
    }
  }

  set size(val) {
    this.setAttribute('size', val);
  }
}

customElements.define(IconElement.is, IconElement);
