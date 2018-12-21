import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';

export default class CheckboxElement extends PolymerElement {
  static get is() {
    return 'a-checkbox';
  }

  static get properties() {
    return {
      value: {
        type: String,
        notify: true,
      },
      checked: {
        type: Boolean,
        value: false,
        notify: true,
        observer: '_valueChangeHandler',
        reflectToAttribute: true,
      },
      disabled: {
        type: Boolean,
        value: false,
        notify: true,
        reflectToAttribute: true,
      },
      color: {
        type: String,
        notify: true
      },
      _circleCheckedStyle: {
        type: String,
        computed: '_getCircleCheckedStyle(checked, color, disabled)',
      },
      _dotCheckedStyle: {
        type: String,
        computed: '_getDotCheckedStyle(checked, color, disabled)',
      },
    };
  }

  ready() {
    super.ready();
    /**
     * Mark form initial value, while reset the
     * related form, this val will be used.
     */
    this._initialValue = this.checked;
    /**
     * Mark this element is a target of label.
     */
    this.setAttribute('a-label-target', '');
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    window.addEventListener('_formReset', this._handlerReset, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    window.removeEventListener('_formReset', this._handlerReset, true);
  }

  _handlerReset = (event) => {
    let parentElement = this.parentElement;

    while (parentElement) {
      if (parentElement === event.target) {
        this.checked = this._initialValue;
        break;
      }
      parentElement = parentElement.parentElement;
    }
  };

  _handleClick = e => {
    e.stopPropagation();
    if (!this.disabled) {
      this.checked = !this.checked;
    }
  };

  _valueChangeHandler = (newVal) => {
    const event = new CustomEvent('change', {
      bubbles: false,
      cancelable: true,
      detail: {
        value: newVal,
      },
    });
    const innerEvent = new CustomEvent('_checkboxChange', {
      bubbles: true,
      cancelable: true,
      detail: {
        value: this.checked,
      },
    });

    this.dispatchEvent(event);
    this.dispatchEvent(innerEvent);
  };

  _getCircleCheckedStyle(checked, color, disabled) {
    return checked && !disabled && color ? `border: 1px solid ${color};` : '';
  }

  _getDotCheckedStyle(checked, color, disabled) {
    return checked && !disabled && color ? `background-color: ${color};` : '';
  }

  static get template() {
    return html`
      <style>
        :host {
          -webkit-tap-highlight-color: transparent;
          display: inline-block;
        }
        :host .circle {
          display: inline-flex;
          display: -webkit-inline-flex;

          width: 1.25em;
          height: 1.25em;

          justify-content: center;
          -webkit-justify-content: center;
          align-items: center;
          -webkit-align-items: center;

          vertical-align: middle;
          border: 1px solid #999;
          border-radius: 0.2em;
          box-sizing: border-box;
          background-color: #fff;
          cursor: pointer;
        }

        :host([checked]) .circle {
          border: #ff5500;
          border: 1px solid var(--color-primary, #ff5500);
        }

        :host([disabled]) .circle {
          border: 1px solid #c7c7c7;
          background-color: #e7e7e7;
        }

        :host([checked]) .dot {
          width: 60%;
          height: 60%;
          text-align: center;
          -webkit-mask-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMTkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTkuMzYgMTlhMS4xNSAxLjE1IDAgMCAxLS44MTQtLjM0bC04LjIxLTguMzAyYTEuMTcgMS4xNyAwIDAgMSAwLTEuNjQ0IDEuMTQzIDEuMTQzIDAgMCAxIDEuNjI4IDBsNy4zOTYgNy40NzhMMjUuMDM2LjM0MWExLjE0NCAxLjE0NCAwIDAgMSAxLjYyNyAwIDEuMTcgMS4xNyAwIDAgMSAwIDEuNjQ0TDEwLjE3MyAxOC42NmExLjE0NCAxLjE0NCAwIDAgMS0uODEzLjM0MXoiIGZpbGw9IiNGRjUwMDAiLz48L3N2Zz4=);
          -webkit-mask-size: 0.75em 0.5em;
          -webkit-mask-repeat: no-repeat;
          -webkit-mask-position: center;
          cursor: pointer;
          border: 1px solid #ff5500;
          border: 1px solid var(--color-primary, #ff5500);
          background-color: #ff5500;
          background-color: var(--color-primary, #ff5500);
        }

        :host([disabled]) .dot {
          background-color: #bbb;
        }
      </style>
      <div class="circle" style$="[[_circleCheckedStyle]]">
        <div class="dot" style$="[[_dotCheckedStyle]]"></div>
      </div>
    `;
  }
}

customElements.define(CheckboxElement.is, CheckboxElement);
