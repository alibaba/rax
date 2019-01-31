import { PolymerElement } from '@polymer/polymer';

const WORKER_TUNNEL = '__renderer_to_worker__';

class NavigatorElement extends PolymerElement {
  static get is() {
    return 'a-navigator';
  }

  static get properties() {
    return {
      hoverStyle: {
        type: String,
        value: '',
      },
      hoverStartTime: {
        type: Number,
        value: 50,
      },
      hoverStayTime: {
        type: Number,
        value: 600,
      },
      url: {
        type: String,
        value: '',
      },
      openType: {
        type: String,
        value: 'navigate',
      },
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
    if (this.hoverStyle) {
      this.touchTimer = setTimeout(() => {
        this.prevStyle = this.getAttribute('style') || '';
        this.setAttribute('style', this.prevStyle + this.hoverStyle);
      }, this.hoverStartTime);
    }
  }

  _handleTouchEnd = () => {
    clearTimeout(this.touchTimer);

    if (this.hoverStyle) {
      setTimeout(() => {
        this.setAttribute('style', this.prevStyle);
      }, this.hoverStayTime);
    }
  }

  _handleClick = () => {
    // in miniapp env to trigger navigate event to worker
    this._callWorker({
      type: 'navigate',
      navigateType: this.openType,
      navigateTo: this.url
    });
  }

  _callWorker(args) {
    if (typeof window[WORKER_TUNNEL] === 'function') {
      window[WORKER_TUNNEL](args);
    }
  }
}

customElements.define(NavigatorElement.is, NavigatorElement);
