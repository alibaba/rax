import { PolymerElement, html } from '@polymer/polymer';
import debounce from '../../shared/debounce';

export default class RadioGroupElement extends PolymerElement {
  static get is() {
    return 'a-radio-group';
  }

  static get observedAttributes() {
    return ['name'];
  }

  static get properties() {
    return {
      name: {
        type: String,
        notify: true
      }
    };
  }

  constructor() {
    super();
    this._changeHandler = debounce(this._changeHandler);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('_radioChange', this._changeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('_radioChange', this._changeHandler);
  }

  _changeHandler = (evt) => {
    evt.stopPropagation();
    const checkboxList = this.querySelectorAll('a-radio');
    for (let i = 0; i < checkboxList.length; i++) {
      const node = checkboxList[i];
      if (node !== evt.target) {
        node.checked = false;
      }
    }
    const event = new CustomEvent('change', {
      detail: {
        value: evt.target.value
      }
    });
    this.dispatchEvent(event);
  }

  static get template() {
    return html`
    <style>
      :host {
        position: relative;
        box-sizing: border-box;
        -webkit-user-select: none;
        user-select: none;
        overflow: hidden;
      }
    </style>
    <slot></slot>
    `;
  }
}

