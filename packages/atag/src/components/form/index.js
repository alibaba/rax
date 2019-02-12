import { PolymerElement, html } from '@polymer/polymer';

export default class Form extends PolymerElement {
  static get is() {
    return 'a-form';
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('_buttonSubmit', this._handleSubmit);
    this.addEventListener('_buttonReset', this._handleReset);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('_buttonSubmit', this._handleSubmit);
    this.removeEventListener('_buttonReset', this._handleReset);
  }

  /**
   * Get the value of all form elements in a child element
   * format e.detail
   * {
   *   value: {
   *      [name]: 'value'
   *   }
   * }
   */
  _handleSubmit() {
    const form = this;
    const formFields = form.querySelectorAll('[name]');
    const value = Object.create(null);
    for (let i = 0, l = formFields.length; i < l; i++) {
      const node = formFields[i];
      const name = node.getAttribute('name');
      switch (node.localName) {
        case 'a-checkbox-group':
          const checkboxes = node.querySelectorAll('a-checkbox');
          const arr = Array.prototype
            .filter.call(checkboxes,checkbox => checkbox.checked);
          value[name] = arr.map(checkbox => checkbox.value);
          break;
        case 'a-switch':
          value[name] = node.checked;
          break;
        case 'a-radio-group':
          const checkedRadio = node.querySelector('[checked]');
          if (checkedRadio) {
            value[name] = node.querySelector('[checked]').value;
          } else {
            value[name] = '';
          }
          break;
        default:
          value[name] = node.value;
      }
    }
    const evt = new CustomEvent('submit', {
      bubbles: true,
      composed: true,
      detail: {
        value,
      },
    });
    form.dispatchEvent(evt);
  }

  /**
   * Reset:
   * The initial values ​​of all form elements are logged when the component is created,
   * but the performance is too low,
   * and it is not as good as saving the initial value for each form element itself.
   */
  _handleReset() {
    const formResetEvt = new CustomEvent('_formReset', {
      bubbles: false,
    });
    this.dispatchEvent(formResetEvt);

    const resetEvt = new CustomEvent('reset', {
      bubbles: true,
      composed: true,
      detail: {},
    });
    this.dispatchEvent(resetEvt);
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          -webkit-user-select: none;
          user-select: none;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define(Form.is, Form);
