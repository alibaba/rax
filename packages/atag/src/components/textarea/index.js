import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import autosize from './autosize';
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

  /**
   * If IME is writing, do not response to value change.
   */
  _isCompositing = false;

  ready() {
    super.ready();
    this._initialValue = this.value;
    this.setAttribute('a-label-target', '');
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('compositionstart', this._handleCompositionStart, true);
    window.addEventListener('compositionend', this._handleCompositionEnd, true);
    window.addEventListener('input', this.inputListener, true);
    window.addEventListener('focus', this.focusListener, true);
    window.addEventListener('blur', this.blurListener, true);
    window.addEventListener('_formReset', this._handleReset, true);
    if (this.autoHeight) {
      autosize(this.$.textarea);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('compositionstart', this._handleCompositionStart, true);
    window.removeEventListener('compositionend', this._handleCompositionEnd, true);
    window.removeEventListener('input', this.inputListener, true);
    window.removeEventListener('focus', this.focusListener, true);
    window.removeEventListener('blur', this.blurListener, true);
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


  inputListener = event => {
    if (!(event instanceof CustomEvent)) {
      event.stopPropagation();
      if (!this._isCompositing && event.target === this) {
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

  _handleReset = (event) => {
    let parentElement = this.parentElement;

    while (parentElement) {
      if (parentElement === event.target) {
        this.$.textarea.value = this._initialValue;
        break;
      }
      parentElement = parentElement.parentElement;
    }
  };

  handleInput(e) {
    e.stopPropagation();
    if (this.autoHeight) {
      autosize.update(this.$.textarea);
    }
    this._valueUnicodeCharString = new UnicodeCharString(this.$.textarea.value, this.maxlength);
    this.value = this.$.textarea.value = this._valueUnicodeCharString.toString();

    const event = new CustomEvent('input', {
      bubbles: false,
      cancelable: true,
      detail: {
        value: this.$.textarea.value,
        cursor: this.$.textarea.selectionStart,
      },
    });

    this.dispatchEvent(event);
  }


  _handleCompositionStart = () => {
    this._isCompositing = true;
  };

  _handleCompositionEnd = (evt) => {
    this._isCompositing = false;
    this.handleInput(evt);
  };

  handleFocus(e) {
    e.stopPropagation();
    const event = new CustomEvent('focus', {
      bubbles: false,
      cancelable: true,
      detail: {
        value: this.$.textarea.value,
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
        value: this.$.textarea.value,
      },
    });
    this.dispatchEvent(event);
  }

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
        value="[[value]]"
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
