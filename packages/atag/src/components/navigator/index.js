/* global __renderer_to_worker__ */
import { PolymerElement } from '@polymer/polymer';

class Navigator extends PolymerElement {
  static get is() {
    return 'a-navigator';
  }

  static get properties() {
    return {
      'hover-style': String,
      'hover-start-time': Number,
      'hover-stay-time': Number,
      url: String,
      'open-type': String
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
    this.addEventListener('touchstart', this._handleTouchStart);
    this.addEventListener('touchend', this._handleTouchEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
    this.removeEventListener('touchstart', this._handleTouchStart);
    this.removeEventListener('touchend', this._handleTouchEnd);
  }

  _handleTouchStart = () => {
    if (this['hover-style']) {
      this.touchTimer = setTimeout(() => {
        this.prevStyle = this.getAttribute('style') || '';
        this.setAttribute('style', this.prevStyle + this['hover-style']);
      }, this['hover-start-time'] || 200);
    }
  }

  _handleTouchEnd = () => {
    clearTimeout(this.touchTimer);

    if (this['hover-style']) {
      setTimeout(() => {
        this.setAttribute('style', this.prevStyle);
      }, this['hover-stay-time'] || 200);
    }
  }

  _handleClick = () => {
    // default val is navigate
    const openType = this['open-type'] || 'navigate';

    // in miniapp env to trigger navigate event to worker
    this._callWorker({
      type: 'navigate',
      navigateType: openType,
      navigateTo: this.url
    });
  }

  _callWorker(args) {
    if (typeof __renderer_to_worker__ === 'function') {
      __renderer_to_worker__(args);
    }
  }
}

customElements.define(Navigator.is, Navigator);
