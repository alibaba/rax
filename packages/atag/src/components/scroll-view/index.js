import { PolymerElement, html } from '@polymer/polymer';
import easeInOutCubic from '../../shared/easeInOutCubic';
import supportsPassive from '../../shared/supportsPassive';

const supportSmoothScroll = 'webkitScrollBehavior' in document.documentElement.style
  || 'scrollBehavior' in document.documentElement.style;
let uid = 0;

export default class ScrollViewElement extends PolymerElement {
  static get is() {
    return 'a-scroll-view';
  }

  /**
   * Properteies scrollLeft and scrollTop are conflicted with Element prototype,
   * so we should handle them in manual with attribute apis.
   */
  static get properties() {
    return {
      scrollX: {
        type: Boolean,
        value: false,
        computed: '_getBoolPropFromAttr("scroll-x", scrollX)',
        observer: '_observeScrollX',
      },
      scrollY: {
        type: Boolean,
        value: false,
        computed: '_getBoolPropFromAttr("scroll-y", scrollY)',
        observer: '_observeScrollY',
      },
      'scroll-left': Number,
      'scroll-top': Number,
      scrollIntoView: {
        type: String,
        observer: '_observeScrollIntoView',
      },
      scrollWithAnimation: {
        type: Boolean,
        value: false,
      },
      hideScrollBar: {
        type: Boolean,
        value: false,
        observer: '_observeHideScrollBar',
      },
      upperThreshold: {
        type: Number,
        value: 50,
      },
      lowerThreshold: {
        type: Number,
        value: 50,
      },
    };
  }

  _getBoolPropFromAttr(attr, fallbackVal) {
    if (this.hasAttribute(attr)) {
      const value = this.getAttribute(attr);
      return value === 'true';
    } else {
      return fallbackVal;
    }
  }

  constructor() {
    super();

    // The timer ids.
    this.timerX = null;
    this.timerY = null;

    // The event interacting with the upper DSL has a 10ms throttle, which is consistent here.
    this.lastScrollTime = 0;
    this.lastScrollTop = 0;
    this.lastScrollLeft = 0;

    // Add a unique id for element to avoid style pollution.
    this._id = `scroll-view-${++uid}`;
    this.setAttribute('atag-id', this._id);
  }

  get _scrollTop() {
    return this['scroll-top'];
  }
  get _scrollLeft() {
    return this['scroll-left'];
  }

  attributeChangedCallback(key, oldVal, newVal) {
    switch (key) {
      case 'scroll-left':
        if (this.scrollWithAnimation) {
          this._smoothScrollToX(newVal);
        } else {
          this.scrollLeft = newVal;
        }
        break;
      case 'scroll-top':
        if (this.scrollWithAnimation) {
          this._smoothScrollToY(newVal);
        } else {
          this.scrollTop = newVal;
        }
        break;
    }

    super.attributeChangedCallback(key, oldVal, newVal);
  }

  connectedCallback() {
    super.connectedCallback();
    // Improving Scroll Performance with Passive Event Listeners
    window.addEventListener(
      'scroll',
      this._handleScroll,
      supportsPassive
        ? {
          capture: true,
          passive: true,
        }
        : true
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'scroll',
      this._handleScroll,
      supportsPassive
        ? {
          capture: true,
          passive: true,
        }
        : true
    );
  }

  _observeScrollX() {
    this.style.overflowX = this.scrollX ? 'auto' : 'hidden';
  }

  _observeScrollY() {
    this.style.overflowY = this.scrollY ? 'auto' : 'hidden';
  }

  _observeScrollIntoView() {
    if (this.scrollIntoView) {
      const targetNode = this.querySelector(`#${this.scrollIntoView}`);
      if (targetNode) {
        const containerRect = this.getBoundingClientRect();
        const targetNodeRect = targetNode.getBoundingClientRect();

        if (this.scrollX) {
          this._smoothScrollToX(this.scrollLeft + targetNodeRect.left - containerRect.left);
        }

        if (this.scrollY) {
          this._smoothScrollToY(this.scrollTop + targetNodeRect.top - containerRect.top);
        }
      }
    } else {
      this.scrollTop = this.scrollLeft = 0;
    }
  }

  /**
   * If smooth scrolling works, use Element.scrollTop/scrollLeft
   */
  _smoothScrollToX(value) {
    if (!supportSmoothScroll) {
      if (this.timerX) {
        clearInterval(this.timerX);
        this.timerX = 0;
      }
      let startTime = Date.now();
      let duration = 800;
      let initialValue = this.scrollLeft;
      this.timerX = setInterval(() => {
        let deltaTime = Date.now() - startTime;
        if (deltaTime > duration) {
          clearInterval(this.timerX);
          this.timerX = 0;
          this.scrollLeft = value;
        } else {
          const process = easeInOutCubic(deltaTime / duration);
          this.scrollLeft = initialValue + process * (value - initialValue);
        }
      }, 16);
    } else {
      this.scrollLeft = value;
    }
  }

  _smoothScrollToY(value) {
    if (!this.scrollWithAnimation) {
      if (this.timerY) {
        clearInterval(this.timerY);
        this.timerY = 0;
      }
      let startTime = Date.now();
      let duration = 400;
      let initialValue = this._scrollTop;
      this.timerY = setInterval(() => {
        let deltaTime = Date.now() - startTime;
        if (deltaTime > duration) {
          clearInterval(this.timerY);
          this.timerY = 0;
          this.scrollTop = value;
        } else {
          const process = easeInOutCubic(deltaTime / duration);
          this.scrollTop = initialValue + process * (value - initialValue);
        }
      }, 16);
    } else {
      this.scrollTop = value;
    }
  }

  _handleScroll = (evt) => {
    /**
     * Because it is captured on the window, it is necessary to judge
     * whether it is really its own rolling event.
     */
    if (evt.target !== this) {
      return;
    }
    /**
     * Avoid infinite loops
     */
    if (evt instanceof CustomEvent) {
      return;
    }
    /**
     * Terminate the native scroll event
     */
    evt.stopPropagation();

    /**
     *  Send a custom scroll event with detail information added
     */
    const deltaX = this._scrollLeft - this.lastScrollLeft;
    const deltaY = this._scrollTop - this.lastScrollTop;
    const scrollEvent = new CustomEvent('scroll', {
      bubbles: false,
      cancelable: true,
      detail: {
        scrollLeft: this.scrollLeft,
        scrollTop: this.scrollTop,
        scrollHeight: this.scrollHeight,
        scrollWidth: this.scrollWidth,
        deltaX,
        deltaY,
      },
    });
    this.dispatchEvent(scrollEvent);

    this.lastScrollTop = this._scrollTop;
    this.lastScrollLeft = this._scrollLeft;
    if (evt.timeStamp - this.lastScrollTime < 10) {
      return;
    }
    this.lastScrollTime = evt.timeStamp;

    if (
      deltaX < 0 && this._scrollLeft <= this.upperThreshold
      || deltaY < 0 && this._scrollTop <= this.upperThreshold
    ) {
      if (!this.scrolledToUpper) {
        const scrollToUpperEvent = new CustomEvent('scrolltoupper');
        this.dispatchEvent(scrollToUpperEvent);
      }
      this.scrolledToUpper = true;
    } else {
      this.scrolledToUpper = false;
    }

    if (
      deltaX > 0 && this.scrollWidth - this._scrollLeft - this.clientWidth <= this.lowerThreshold ||
      deltaY > 0 && this.scrollHeight - this._scrollTop - this.clientHeight <= this.lowerThreshold
    ) {
      if (!this.scrolledToLower) {
        const scrollToLowerEvent = new CustomEvent('scrolltolower');
        this.dispatchEvent(scrollToLowerEvent);
      }
      this.scrolledToLower = true;
    } else {
      this.scrolledToLower = false;
    }
  };

  _observeHideScrollBar(enableScrollBar) {
    if (enableScrollBar) {
      this._createCustomStyle();
      const hideScrollBarStyle = 'display: none;'
      /**
       * A way to compatible with WebComponents polyfill
       */
      this._customStyle.textContent = `
        :host::-webkit-scrollbar {
          ${hideScrollBarStyle}
        }
        a-scroll-view[atag-id=${this._id}]::-webkit-scrollbar {
          ${hideScrollBarStyle}
        }
      `;
    } else {
      this._customStyle && this.shadowRoot.removeChild(this._customStyle);
    }
  }

  _createCustomStyle() {
    if (this._customStyle) return;
    this._customStyle = document.createElement('style');
    const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this._customStyle);
  }

  static get template() {
    return html`
      <style>
        :host {
          position: relative;
          display: block;
          box-sizing: border-box;
          
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define(ScrollViewElement.is, ScrollViewElement);
