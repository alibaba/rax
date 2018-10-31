import { PolymerElement, html } from '@polymer/polymer';
import afterNextRender from '../../shared/afterNextRender';

export default class RadioElement extends PolymerElement {
  static get is() {
    return 'a-radio';
  }

  static get observedAttributes() {
    return ['value', 'disabled', 'checked', 'color'];
  }

  static get properties() {
    return {
      value: {
        type: String,
        notify: true
      },
      checked: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true
      },
      disabled: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true
      },
      color: {
        type: String,
        notify: true
      },
      circleCheckedStyle: {
        type: String,
        computed: 'getCircleCheckedStyle(checked, color, disabled)'
      },
      dotCheckedStyle: {
        type: String,
        computed: 'getDotCheckedStyle(checked, color, disabled)'
      }
    };
  }

  ready() {
    super.ready();

    // label target
    this.setAttribute('a-label-target', '');
    this.radio = this.$.radio;
    this._initialValue = this.checked;
    this.addEventListener('click', this.clickHandler);
    window.addEventListener('_formReset', this._handlerReset, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('click', this._clickHandler);
    window.removeEventListener('_formReset', this._handlerReset, true);
  }

  _clickHandler = e => {
    this._dispatchChange(this.checked);
    e.stopPropagation();
  };

  _dispatchChange = value => {
    const customEvent = new CustomEvent('_radioChange', {
      bubbles: true,
      cancelable: true,
      detail: {
        value
      }
    });
    this.dispatchEvent(customEvent);
  };

  _handlerReset = (event) => {
    let parentElement = this.parentElement;

    while (parentElement) {
      if (parentElement === event.target) {
        this.radio.checked = this.checked = this._initialValue;
        break;
      }
      parentElement = parentElement.parentElement;
    }
  };

  getCircleCheckedStyle(checked, color, disabled) {
    if (checked && !disabled && color) {
      return `border: 1px solid ${color};`;
    }
    return '';
  }

  getDotCheckedStyle(checked, color, disabled) {
    if (checked && !disabled && color) {
      return `background-color: ${color};`;
    }
    return '';
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

      :host input[type="radio"] {
        display: none;
        font-size: 4.666vw;
      }

      :host .circle {
        display: inline-block;
        position: relative;
        width: 1.25em;
        height: 1.25em;
        margin: -0.625em 0;
        vertical-align: middle;
        border: 1px solid #999;
        border-radius: 100%;
        box-sizing: border-box;
        background-color: white;
        cursor: pointer;
      }
      :host([checked]) .circle {
        border: #ff5500;
        border: 1px solid var(--color-primary-2, #ff5500);
      }

      :host input[type="radio"]:checked+label .dot {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        text-align: center;
        cursor: pointer;
        border: 2px solid #fff;
        box-sizing: border-box;
        background-color: #ff5500;
        background-color: var(--color-primary-2, #ff5500);
      }

      :host input[type="radio"][disabled]+label .circle {
        border: 1px solid #c7c7c7;
        background-color: #E7E7E7;
      }

      :host input[type="radio"][disabled]:checked+label .dot {
        background-color: #bbb;
      }
    </style>
    <input type="radio" id="radio" name="{{value}}" disabled="{{disabled::change}}" checked="{{checked::change}}">
    <label for="radio">
      <div class="circle" style$="{{circleCheckedStyle}}">
        <div class="dot" style$="{{dotCheckedStyle}}"></div>
      </div>
    </label>
    `;
  }

}

customElements.define(RadioElement.is, RadioElement);
