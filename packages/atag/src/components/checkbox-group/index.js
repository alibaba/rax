import { PolymerElement, html } from '@polymer/polymer';
import debounce from '../../shared/debounce';

export default class CheckboxGroupElement extends PolymerElement {
  static get is() {
    return 'a-checkbox-group';
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
    // Prevent frequent change event.
    this.changeHandler = debounce(this.changeHandler);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('_checkboxChange', this.changeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('_checkboxChange', this.changeHandler);
  }

  changeHandler = e => {
    const value = [];
    const checkboxList = this.querySelectorAll('a-checkbox');
    for (let i = 0; i < checkboxList.length; i++) {
      const node = checkboxList[i];
      node.checked && value.push(node.value);
    }
    const event = new CustomEvent('change', {
      detail: {
        value
      }
    });
    this.dispatchEvent(event);
    e.stopPropagation();
  };

  static get template() {
    return html`
    <style>
      /* shadow DOM styles go here */
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

customElements.define(CheckboxGroupElement.is, CheckboxGroupElement);
