import { PolymerElement, html } from '@polymer/polymer';
import autosize from './autosize';
import debounce from '../../shared/debounce';
import UnicodeCharString from './unicodeCharString';

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
      placeholderStyle: {
        type: String,
        value: 'color: #999999;',
        observer: '_changeCustomStyle',
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
        observer: '_observeFocus',
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
        observer: '_changeCustomStyle',
      },
      _valueLength: {
        type: Number,
        computed: '_computedValueLength(_valueUnicodeCharString)',
      },
      countStyle: {
        type: String,
        value: '',
        observer: '_changeCustomStyle',
      },
      _valueUnicodeCharString: {
        type: Object,
        value: new UnicodeCharString(''),
      }
    };
  }

  constructor() {
    super();
    /**
     * If IME is writing, do not response to value change.
     */
    this._isCompositing = false;

    /**
     * In case of calling focus or blur more than once in a moment.
     */
    this._observeFocus = debounce(this._observeFocus);
  }

  ready() {
    super.ready();
    this._initialValue = this.value;
    this.setAttribute('a-label-target', '');

    /**
     * `maxlength` equals -1 means infinite.
     */
    if (this.maxlength === -1) {
      this.$.count.style.display = 'none';
      this.maxlength = Infinity;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('compositionstart', this._handleCompositionStart, true);
    window.addEventListener('compositionend', this._handleCompositionEnd, true);
    window.addEventListener('input', this._handleInput, true);
    window.addEventListener('focus', this._handleFocus, true);
    window.addEventListener('blur', this._handleBlur, true);
    window.addEventListener('_formReset', this._handleReset, true);

    if (this.autoHeight) {
      autosize(this.$.textarea);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('compositionstart', this._handleCompositionStart, true);
    window.removeEventListener('compositionend', this._handleCompositionEnd, true);
    window.removeEventListener('input', this._handleInput, true);
    window.removeEventListener('focus', this._handleFocus, true);
    window.removeEventListener('blur', this._handleBlur, true);
    window.removeEventListener('_formReset', this._handleReset, true);
    autosize.destroy(this.$.textarea);
  }

  attributeChangedCallback(key, oldVal, newVal) {
    super.attributeChangedCallback(key, oldVal, newVal);

    switch (key) {
      case 'show-count': {
        this.showCount = newVal !== 'false';
        break;
      }
      case 'value': {
        this.value = newVal;
        this._valueUnicodeCharString = new UnicodeCharString(newVal, this.maxlength);
        break;
      }
    }
  }

  _observeFocus() {
    const method = this.focus ? 'focus' : 'blur';
    this.$.textarea[method]();
  }

  _handleInput = (evt) => {
    if (!(evt instanceof CustomEvent)) {
      evt.stopPropagation();
      if (!this._isCompositing && event.target === this) {
        this._valueUnicodeCharString = new UnicodeCharString(this.$.textarea.value, this.maxlength);
        const updatedValue = this._valueUnicodeCharString.toString();
        if (this.value !== updatedValue && this.autoHeight) {
          autosize.update(this.$.textarea);
        }
        this.value = this.$.textarea.value = updatedValue;

        this.dispatchEvent(new CustomEvent('input', {
          bubbles: false,
          cancelable: true,
          detail: {
            value: this.$.textarea.value,
            cursor: this.$.textarea.selectionStart,
          },
        }));
      }
    }
  };

  _handleFocus = (evt) => {
    if (!(evt instanceof CustomEvent)) {
      evt.stopPropagation();
      if (evt.target === this) {
        this.dispatchEvent(new CustomEvent('focus', {
          bubbles: false,
          cancelable: true,
          detail: {
            value: this.$.textarea.value,
          },
        }));
      }
    }
  };

  _handleBlur = (evt) => {
    if (!(evt instanceof CustomEvent)) {
      evt.stopPropagation();
      if (evt.target === this) {
        this.dispatchEvent(new CustomEvent('blur', {
          bubbles: false,
          cancelable: true,
          detail: {
            value: this.$.textarea.value,
          },
        }));
      }
    }
  };

  _handleReset = (evt) => {
    let parentElement = this.parentElement;

    while (parentElement) {
      if (parentElement === evt.target) {
        this.$.textarea.value = this._initialValue;
        break;
      }
      parentElement = parentElement.parentElement;
    }
  };

  _handleCompositionStart = () => {
    this._isCompositing = true;
  };

  _handleCompositionEnd = (evt) => {
    this._isCompositing = false;
    this._handleInput(evt);
  };

  _changeCustomStyle() {
    const { placeholderStyle, countStyle, showCount } = this;
    if (!this._placeholderStyleElement) {
      // Unique id for data-id to avoid style pollution
      this._id = `textarea-${++uid}`;
      this._placeholderStyleElement = document.createElement('style');
      this.setAttribute('data-id', this._id);
      const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(this._placeholderStyleElement);
    }

    this._placeholderStyleElement.textContent = `
      :host #textarea {
        padding-bottom: ${showCount ? '18px' : '0'};
      }
      :host #textarea::placeholder {
        ${placeholderStyle}
      }
      a-textarea[data-id=${this._id}] #textarea::-webkit-input-placeholder {
        ${placeholderStyle}
      }
      :host #count {
        display: ${showCount ? 'block' : 'none'};
        ${countStyle}
      }
    `;
  }

  _computedValueLength() {
    return this._valueUnicodeCharString.length;
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
        value$="[[value]]"
        disabled$="[[disabled]]"
        readonly$="[[readonly]]"
        autofocus$="[[focus]]"
        style$="[[inputStyle]]"
        rows$="[[rows]]"
      ></textarea>
      <p id="count">{{_valueLength}}/{{maxlength}}</p>
    `;
  }
}

customElements.define(Textarea.is, Textarea);
