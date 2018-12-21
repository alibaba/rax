import { PolymerElement, html } from '@polymer/polymer';

export default class Label extends PolymerElement {
  static get is() {
    return 'a-label';
  }

  static get properties() {
    return {
      for: {
        type: String,
        value: ''
      }
    };
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
  }

  _findTarget() {
    let target;
    if (this.for) {
      target = document.querySelector(`#${this.for}`);
    }
    if (target) {
      return target;
    }

    if (this.children) {
      target = this.querySelector('[a-label-target]') || this.firstElementChild;
    }

    return target;
  }

  _handleClick(ev) {
    let forEl = this._findTarget();
    if (!forEl) return;
    const tagName = forEl.tagName.toLowerCase();
    switch (tagName) {
      case 'a-input':
        forEl.$.input.focus();
        break;
      case 'a-textarea':
        forEl.$.textarea.focus();
        break;
      case 'a-checkbox':
        if (!forEl.disabled) {
          forEl.checked = !forEl.checked;
        }
        break;
      case 'a-radio':
        if (!forEl.checked && !forEl.disabled) {
          forEl.checked = !forEl.checked;
          forEl._dispatchChange(forEl.checked);
        }
        break;
      default:
        break;
    }
  }

  static get template() {
    return html`
    <style>
      :host {
        display: inline-block;
      }
    </style>
    <slot></slot>
    `;
  }
}

customElements.define(Label.is, Label);
