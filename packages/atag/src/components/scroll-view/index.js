import { PolymerElement, html } from '@polymer/polymer';
import easeInOutCubic from '../../shared/easeInOutCubic';
import supportsPassive from '../../shared/supportsPassive';

let uid = 0;

export default class ScrollViewElement extends PolymerElement {
  static get is() {
    return 'a-scroll-view';
  }

  static get properties() {
    return {
      scrollIntoView: {
        type: String,
        value: '',
      },
      scrollX: {
        type: Boolean,
        value: false,
        observer: '_observeScrollX',
      },
      scrollY: {
        type: Boolean,
        value: false,
        observer: '_ovserveScrollY',
      },
      scrollTop: {
        type: Number,
        value: 0,
        observer: '_ovserveScrollTop',
      },
      scrollLeft: {
        type: Number,
        value: 0,
        observer: '_ovserveScrollLeft',
      },
      scrollIntoView: {
        type: String,
        observer: '_ovserveScrollIntoView',
      },
      scrollWithAnimation: {
        type: Boolean,
        value: false,
      },
      hideScrollBar: {
        type: Boolean,
        value: false,
      },
    };
  }

  _observeScrollX() {
    this.style.overflowX = this.scrollX ? 'auto' : 'hidden';
  }
  _observeScrollY() {
    this.style.overflowY = this.scrollY ? 'auto' : 'hidden';
  }
  /**
   * If smooth scrolling works, use Node.scrollTop/scrollLeft
   */
  _observeScrollTop() {
    if ('scrollBehavior' in this.style) {
      this.scrollTop = scrollTop;
    } else {
      this._scrollToY(scrollTop);
    }
  }
  _observeScrollLeft() {
    if ('scrollBehavior' in this.style) {
      this.scrollLeft = scrollLeft;
    } else {
      this._scrollToX(scrollLeft);
    }
  }
  _ovserveScrollIntoView() {
    if (this.scrollIntoView) {
      const targetNode = this.querySelector(`#${scrollIntoView}`);
      if (targetNode) {
        const containerRect = this.getBoundingClientRect();
        const targetNodeRect = targetNode.getBoundingClientRect();

        if (this.scrollX) {
          this._scrollToX(this.scrollLeft + targetNodeRect.left - containerRect.left);
        }

        if (this.scrollY) {
          this._scrollToY(this.scrollTop + targetNodeRect.top - containerRect.top);
        }
      }
    } else {
      this.scrollTop = this.scrollLeft = 0;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);


    switch (name) {
      case 'scroll-x':
      case 'scroll-y':

        break;
      case 'scroll-top':
        const scrollTop = this.getValue('scroll-top', 'number', 0);

        break;
      case 'scroll-left':
        const scrollLeft = this.getValue('scroll-left', 'number', 0);

        break;
      case 'scroll-into-view':
        const scrollIntoView = this.getValue('scroll-into-view', 'string', '');

        break;
      default:
        break;
    }
  }

  ready() {
    super.ready();

    // Improving Scroll Performance with Passive Event Listeners
    this.addEventListener(
      'scroll',
      this.handleScroll,
      supportsPassive
        ? {
          capture: true,
          passive: true,
        }
        : true
    );
  }

  scrollingXId = 0;
  scrollingYId = 0;

  scrollToY(value) {
    const scrollWithAnimation = this.getValue('scroll-with-animation', 'boolean', false);
    if (scrollWithAnimation) {
      if (this.scrollingYId) {
        clearInterval(this.scrollingYId);
        this.scrollingYId = 0;
      }
      let startTime = Date.now();
      let duration = 400;
      let initialValue = this.scrollTop;
      this.scrollingYId = setInterval(() => {
        let deltaTime = Date.now() - startTime;
        if (deltaTime > duration) {
          clearInterval(this.scrollingYId);
          this.scrollingYId = 0;
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

  scrollToX(value) {
    const scrollWithAnimation = this.getValue('scroll-with-animation', 'boolean', false);
    if (scrollWithAnimation) {
      if (this.scrollingXId) {
        clearInterval(this.scrollingXId);
        this.scrollingXId = 0;
      }
      let startTime = Date.now();
      let duration = 800;
      let initialValue = this.scrollLeft;
      this.scrollingXId = setInterval(() => {
        let deltaTime = Date.now() - startTime;
        if (deltaTime > duration) {
          clearInterval(this.scrollingXId);
          this.scrollingXId = 0;
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

  // The event interacting with the upper DSL has a 10ms throttle, which is consistent here.
  lastScrollTime = 0;
  lastScrollTop = 0;
  lastScrollLeft = 0;

  handleScroll = e => {
    // Because it is captured on the window, it is necessary to judge whether it is really its own rolling event.
    if (e.target !== this) {
      return;
    }
    // Avoid infinite loops
    if (e instanceof CustomEvent) {
      return;
    }
    // Terminate the native scroll event
    e.stopPropagation();

    // Send a custom scroll event with detail information added
    const deltaX = this.scrollLeft - this.lastScrollLeft;
    const deltaY = this.scrollTop - this.lastScrollTop;
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

    this.lastScrollTop = this.scrollTop;
    this.lastScrollLeft = this.scrollLeft;
    if (e.timeStamp - this.lastScrollTime < 10) {
      return;
    }
    this.lastScrollTime = e.timeStamp;

    const upperThreshold = this.getValue('upper-threshold', 'number', 50);
    if (deltaX < 0 && this.scrollLeft <= upperThreshold || deltaY < 0 && this.scrollTop <= upperThreshold) {
      if (!this.scrolledToUpper) {
        const scrollToUpperEvent = new CustomEvent('scrolltoupper');
        this.dispatchEvent(scrollToUpperEvent);
      }
      this.scrolledToUpper = true;
    } else {
      this.scrolledToUpper = false;
    }

    const lowerThreshold = this.getValue('lower-threshold', 'number', 50);
    if (
      deltaX > 0 && this.scrollWidth - this.scrollLeft - this.clientWidth <= lowerThreshold ||
      deltaY > 0 && this.scrollHeight - this.scrollTop - this.clientHeight <= lowerThreshold
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

  _observeHideScrollBar() {

    if (!this.styleEl) {
      this._initStyleEl();
    }
    if (this.scrollX) {
      const hideScrollBarStyle = 'display: none;';
      this._styleEl.textContent = `
        :host::-webkit-scrollbar {
          ${hideScrollBarStyle}
        }
        a-scroll-view[data-id=${this._id}]::-webkit-scrollbar {
          ${hideScrollBarStyle}
        }
      `;
    }
  }

  _initStyleEl() {
    // unique id for data-id to avoid style pollution
    this._id = `scroll-view-${++uid}`;
    this._styleEl = document.createElement('style');
    this.setAttribute('data-id', this._id);
    const shadowRoot = this.shadowRoot || this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this._styleEl);
  }

  getValue(name, type, defaultValue) {
    let value = this.getFromCache(name);
    if (value == null) {
      value = this.getAttribute(name);
      this.saveToCache(name, value);
    }

    switch (type) {
      case 'boolean':
        return value === null ? defaultValue : value === '' || value === 'true' || value === true;
      case 'string':
        return value === null ? defaultValue : String(value);
      case 'number':
        return value === null ? defaultValue : Number(value);
      default:
        break;
    }
    console.error(`atag scroll-view: unrecognized type of ${type}`);
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
