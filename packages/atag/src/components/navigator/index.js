import { PolymerElement, html } from '@polymer/polymer';

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

  ready() {
    super.ready();
    this.addEventListener('click', this.handleClick);
    this.addEventListener('touchstart', this.handleTouchStart);
    this.addEventListener('touchend', this.handleTouchEnd);
  }

  handleTouchStart() {
    if (this['hover-style']) {
      this.touchTimer = setTimeout(() => {
        this.prevStyle = this.getAttribute('style') || '';
        this.setAttribute('style', this.prevStyle + this['hover-style']);
      }, this['hover-start-time'] || 200);
    }
  }

  handleTouchEnd() {
    clearTimeout(this.touchTimer);

    if (this['hover-style']) {
      setTimeout(() => {
        this.setAttribute('style', this.prevStyle);
      }, this['hover-stay-time'] || 200);
    }
  }

  handleClick() {
    // default val is navigate
    const openType = this['open-type'] || 'navigate';

    // in miniapp env to trigger navigate event to worker
    this.callWorker({
      type: 'navigate',
      navigateType: openType,
      navigateTo: this.url
    });
  }

  callWorker(args) {
    if (typeof __renderer_to_worker__ === 'function') {
      /* eslint-disable no-undef */
      __renderer_to_worker__(args);
    }
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.handleClick);
    this.removeEventListener('touchstart', this.handleTouchStart);
    this.removeEventListener('touchend', this.handleTouchEnd);
  }

  static get template() {
    return html`
    <span>
      <slot></slot>
    </span>
    `;
  }
}

customElements.define(Navigator.is, Navigator);
