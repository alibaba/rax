import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import autosize from './autosize';

let uid = 0;

export default class Textarea extends PolymerElement {
  static get is() {
    return 'a-textarea';
  }

  static get properties() {
    return {
      value: {
        type: String,
        value: '',
      },
      placeholder: {
        type: String,
        value: '',
        reflectToAttribute: true,
      },
      placeholderstyle: {
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
        type: String,
        value: 140,
      },
      focus: {
        type: Boolean,
        value: false,
      },
      autoHeight: {
        type: Boolean,
        value: false,
      },
      readonly: {
        type: Boolean,
      },
      inputStyle: {
        type: String,
        value: '',
      },
      rows: {
        type: String,
        value: '2',
      },
      showCount: {
        type: Boolean,
        value: true,
        observer: 'observerShowCount',
      },
      valueLength: {
        type: Number,
        computed: 'computedValueLength(value)',
      },
    };
  }

  ready() {
    super.ready();
    this.textarea = this.$.textarea;
    this.formInitialValue = this.value;

    this.setAttribute('a-label-target', '');

    afterNextRender(this, () => {
      window.addEventListener('input', this.inputListener, true);
      window.addEventListener('focus', this.focusListener, true);
      window.addEventListener('blur', this.blurListener, true);
      window.addEventListener('_formReset', this._handleReset, true);
      if (this.autoHeight) {
        autosize(this.textarea);
      }
    });
  }

  attributeChangedCallback(key, oldVal, newVal) {
    super.attributeChangedCallback(key, oldVal, newVal);

    switch (key) {
      case 'show-count': {
        this.showCount = newVal !== 'false';
        break;
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('input', this.inputListener, true);
    window.removeEventListener('focus', this.focusListener, true);
    window.removeEventListener('blur', this.blurListener, true);
    window.removeEventListener('_formReset', this._handleReset, true);
    autosize.destroy(this.textarea);
  }

  inputListener = event => {
    if (!(event instanceof CustomEvent)) {
      event.stopPropagation();
      if (event.target === this) {
        this.handleInput(event);
      }
    }
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

  _handleReset = () => {
    this.textarea.value = this.formInitialValue;
  };

  handleInput(e) {
    e.stopPropagation();
    if (this.autoHeight) {
      autosize.update(this.textarea);
    }
    this.value = this.textarea.value;
    const event = new CustomEvent('input', {
      bubbles: false,
      cancelable: true,
      detail: {
        value: this.textarea.value,
        cursor: this.textarea.selectionStart,
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
        value: this.textarea.value,
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
        value: this.textarea.value,
      },
    });
    this.dispatchEvent(event);
  }

  changePlaceholderStyle(placeholderStyle) {
    if (!this.styleEl) {
      // Unique id for data-id to avoid style pollution
      this.id = `textarea-${++uid}`;
      this.styleEl = document.createElement('style');
      this.setAttribute('data-id', this.id);
      const shadowRoot =
        this.shadowRoot || this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(this.styleEl);
    }
    this.styleEl.textContent = `
      :host #textarea::placeholder {
        ${placeholderStyle}
      }
      a-textarea[data-id=${
  this.id
}] #textarea::-webkit-input-placeholder {
        ${placeholderStyle}
      }
    `;
  }

  computedValueLength(value) {
    return value.length || 0;
  }

  observerShowCount(newVal, oldVal) {
    const countStyle = this.$.count.style;
    const textareaStyle = this.$.textarea.style;
    if (newVal) {
      countStyle.display = 'block';
      textareaStyle.paddingBottom = '18px';
    } else {
      countStyle.display = 'none';
      textareaStyle.paddingBottom = '0';
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          position: relative;
          min-height: 42px;
          background-color: #fff;
          word-wrap: break-word;
        }
  
        #textarea {
          all: unset;
          /*
           * HACK: webkit placeholder color will 
           * inherit from color, reset here
           */
          -webkit-text-fill-color: initial;
          
          /**
           * User can select to type text
           */
          -webkit-user-select: auto;
          user-select: auto;
          
          display: block;
          outline: none;
          border: none;
          resize: none;
          padding: 0;
          margin: 0;
          width: 100%;
          height: 100%;
          background: transparent;
        }
  
        #count {
          margin: 0;
          position: absolute;
          bottom: 0;
          right: 5px;
          color: #b2b2b2;
          /* Count's font style should not effect by CSS inherit */
          font-size: 14px;
          font-weight: initial;
        }
      </style>
      <textarea 
        id="textarea"
        placeholder="[[placeholder]]"
        value="[[value]]"
        disabled$="[[disabled]]"
        maxlength$="[[maxlength]]"
        readonly$="[[readonly]]"
        autofocus$="[[focus]]"
        style$="[[inputStyle]]"
        rows$="[[rows]]"
      ></textarea>
      <p id="count" style$="[[countStyle]]">{{valueLength}}/{{maxlength}}</p>
    `;
  }
}

customElements.define(Textarea.is, Textarea);
