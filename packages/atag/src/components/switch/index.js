import { PolymerElement, html } from '@polymer/polymer';

export default class SwitchElement extends PolymerElement {
  static get is() {
    return 'a-switch';
  }

  static get properties() {
    return {
      color: {
        type: String,
        reflectToAttribute: true
      },
      checked: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_observerChecked'
      },
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      _switchStyle: {
        type: String,
        computed: '_computedSwitchStyle(checked, color)'
      }
    };
  }

  ready() {
    super.ready();
    // Save the _initialValue for form reset
    this._initialValue = this.checked;
    this._translateSliderBlock();
  }

  connectedCallback() {
    super.connectedCallback();

    this.addEventListener('click', this._handleClick);
    window.addEventListener('_formReset', this._handleReset, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('click', this._handleClick);
    window.removeEventListener('_formReset', this._handleReset, true);
  }

  _handleClick = () => {
    if (!this.disabled) {
      this.checked = !this.checked;
      this.dispatchEvent(
        new CustomEvent('change', {
          detail: {
            checked: this.checked
          }
        })
      );
    }
  }

  _handleReset = (event) => {
    let parentElement = this.parentElement;

    while (parentElement) {
      if (parentElement === event.target) {
        this.checked = this._initialValue;
        break;
      }
      parentElement = parentElement.parentElement;
    }
  };


  _translateSliderBlock() {
    if (this.checked) {
      this.$.slider.classList.add('slider-checked');
    } else {
      this.$.slider.classList.remove('slider-checked');
    }
  }

  _computedSwitchStyle(checked, color) {
    return checked && color ? `background-color: ${color};` : '';
  }

  _observerChecked(newVal, oldVal) {
    this._translateSliderBlock();
  }

  static get template() {
    return html`
    <style>
      .switch {
        position: relative;
        display: inline-block;
        width: 44px;
        height: 20px;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #B4B4B4;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 10px;

      }
      .slider-checked {
        background-color: #ff5500;
        background-color: var(--color-primary, #ff5500);
      }

      .slider:before {
        position: absolute;
        content: "";
        height: 16.8px;
        width: 16.8px;
        left: 1.5px;
        top: 1.5px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
      }

      .slider-checked:before {
        -webkit-transform: translateX(23px);
        transform: translateX(23px);
      }
    </style>
    <label class="switch" id="switch">
      <span class="slider" id="slider" style$="{{_switchStyle}}"></span>
    </label>
    `;
  }
}

customElements.define(SwitchElement.is, SwitchElement);
