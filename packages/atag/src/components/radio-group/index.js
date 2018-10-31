import { PolymerElement, html } from '@polymer/polymer';
import afterNextRender from '../../shared/afterNextRender';

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

  ready() {
    super.ready();
    this.addEventListener('_radioChange', this.changeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('_radioChange', this.changeHandler);
  }

  changeHandler = (e) => {
    e.stopPropagation();
    const checkboxList = this.querySelectorAll('a-radio');
    for (let i = 0; i < checkboxList.length; i++) {
      const node = checkboxList[i];
      if (node !== e.target) {
        node.checked = false;
      }
    }
    const event = new CustomEvent('change', {
      detail: {
        value: e.target.value
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

customElements.define(RadioGroupElement.is, RadioGroupElement);
