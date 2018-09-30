import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';

let uid = 0;

export default class Input extends PolymerElement {
  static get is() {
    return 'a-input';
  }

  static get properties() {
    return {
      value: {
        type: String,
        value: '',
      },
      type: {
        type: String,
        value: 'text',
      },
      placeholder: {
        type: String,
        value: '',
        reflectToAttribute: true,
      },
      placeholderStyle: {
        type: String,
        value: 'color: #999999;',
        observer: 'changePlaceholderStyle',
      },
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      maxlength: {
        type: Number,
        value: 140,
      },
      focus: {
        type: Boolean,
        value: false,
      },
    };
  }

  ready() {
    super.ready();
    this.input = this.$.input;
    this.formInitalValue = this.value;
    // label target
    this.setAttribute('a-label-target', '');

    afterNextRender(this, () => {
      window.addEventListener('input', this.inputListener, true);
      window.addEventListener('focus', this.focusListener, true);
      window.addEventListener('blur', this.blurListener, true);
      window.addEventListener('_formReset', this._handlerReset, true);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('input', this.inputListener, true);
    window.removeEventListener('focus', this.focusListener, true);
    window.removeEventListener('blur', this.blurListener, true);
    window.removeEventListener(
      '_formReset',
      this._handlerReset,
      true
    );
  }

  inputListener = event => {
    if (!(event instanceof CustomEvent)) {
      event.stopPropagation();
      if (event.target === this) {
        this.handleInput(event);
      }
    }
  };

  _handlerReset = () => {
    this.input.value = this.value = this.formInitalValue;
  };

  focusListener = event => {
    if (!(event instanceof CustomEvent)) {
      event.stopPropagation();
      if (event.target === this) {
        this.handleFocus(event);
      }
    }
  };

  blurListener = event => {
    if (!(event instanceof CustomEvent)) {
      event.stopPropagation();
      if (event.target === this) {
        this.handleBlur(event);
      }
    }
  };

  handleInput(e) {
    e.stopPropagation();
    this.value = this.input.value;
    const event = new CustomEvent('input', {
      bubbles: false,
      cancelable: true,
      detail: {
        value: this.input.value,
        cursor: this.input.selectionStart,
      },
    });
    this.dispatchEvent(event);
  }

  handleFocus(e) {
    e.stopPropagation();
    const event = new CustomEvent('focus', {
      bubbles: false,
      cancelable: true,
      detail: {
        value: this.input.value,
      },
    });
    this.dispatchEvent(event);
  }

  handleBlur(e) {
    e.stopPropagation();
    const event = new CustomEvent('blur', {
      bubbles: false,
      cancelable: true,
      detail: {
        value: this.input.value,
      },
    });
    this.dispatchEvent(event);
  }

  changePlaceholderStyle(placeholderStyle) {
    if (!this.styleEl) {
      // unique id for data-id to avoid style pollution
      this.id = `input-${++uid}`;
      this.styleEl = document.createElement('style');
      this.setAttribute('data-id', this.id);
      const shadowRoot =
        this.shadowRoot || this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(this.styleEl);
    }
    this.styleEl.textContent = `
      :host #input::placeholder {
        ${placeholderStyle}
      }
      a-input[data-id=${this.id}] #input::-webkit-input-placeholder {
        ${placeholderStyle}
      }
    `;
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
          background-color: #fff;
        }
  
        :host #input {
          all: unset;
          width: 100%;
          height: 100%;
          /*
           * HACK: webkit placeholder color will 
           * inherit from color, reset here
           */
          -webkit-text-fill-color: initial;
        }
  
      </style>
      <input 
        id="input" 
        placeholder="[[placeholder]]" 
        value$="[[value]]" 
        type$="[[type]]" 
        disabled$="[[disabled]]"
        autofocus$="[[focus]]" 
        maxlength$="[[maxlength]]" 
      />
    `;
  }
}

customElements.define(Input.is, Input);
