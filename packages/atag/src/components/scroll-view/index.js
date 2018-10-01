import { PolymerElement, html } from '@polymer/polymer';
import easeInOutCubic from '../../shared/easeInOutCubic';
import supportsPassive from '../../shared/supportsPassive';

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
    };
  }

  static get observedAttributes() {
    return [
      'scroll-x',
      'scroll-y',
      'scroll-top',
      'scroll-left',
      'scroll-into-view',
      'scroll-with-animation',
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);
    this.expireCache(name);

    const scrollX = this.getValue('scroll-x', 'boolean', false);
    const scrollY = this.getValue('scroll-y', 'boolean', false);

    switch (name) {
      case 'scroll-x':
      case 'scroll-y':
        this.style.overflowX = scrollX ? 'auto' : 'hidden';
        this.style.overflowY = scrollY ? 'auto' : 'hidden';
        break;
      case 'scroll-top':
        const scrollTop = this.getValue('scroll-top', 'number', 0);
        this.scrollToY(scrollTop);
        break;
      case 'scroll-left':
        const scrollLeft = this.getValue('scroll-left', 'number', 0);
        this.scrollToX(scrollLeft);
        break;
      case 'scroll-into-view':
        const scrollIntoView = this.getValue(
          'scroll-into-view',
          'string',
          ''
        );
        if (scrollIntoView) {
          const targetNode = this.querySelector(`#${scrollIntoView}`);
          if (targetNode) {
            const containerRect = this.getBoundingClientRect();
            const targetNodeRect = targetNode.getBoundingClientRect();
            if (scrollX) {
              this.scrollToX(
                this.scrollLeft +
                  targetNodeRect.left -
                  containerRect.left
              );
            }
            if (scrollY) {
              this.scrollToY(
                this.scrollTop +
                  targetNodeRect.top -
                  containerRect.top
              );
            }
          }
        }
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
    const scrollWithAnimation = this.getValue(
      'scroll-with-animation',
      'boolean',
      false
    );
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
          this.scrollTop =
            initialValue + process * (value - initialValue);
        }
      }, 16);
    } else {
      this.scrollTop = value;
    }
  }

  scrollToX(value) {
    const scrollWithAnimation = this.getValue(
      'scroll-with-animation',
      'boolean',
      false
    );
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
          this.scrollLeft =
            initialValue + process * (value - initialValue);
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

    const upperThreshold = this.getValue(
      'upper-threshold',
      'number',
      50
    );
    if (
      deltaX < 0 && this.scrollLeft <= upperThreshold ||
      deltaY < 0 && this.scrollTop <= upperThreshold
    ) {
      if (!this.scrolledToUpper) {
        const scrollToUpperEvent = new CustomEvent('scrolltoupper');
        this.dispatchEvent(scrollToUpperEvent);
      }
      this.scrolledToUpper = true;
    } else {
      this.scrolledToUpper = false;
    }

    const lowerThreshold = this.getValue(
      'lower-threshold',
      'number',
      50
    );
    if (
      deltaX > 0 &&
        this.scrollWidth - this.scrollLeft - this.clientWidth <=
          lowerThreshold ||
      deltaY > 0 &&
        this.scrollHeight - this.scrollTop - this.clientHeight <=
          lowerThreshold
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

  getValue(name, type, defaultValue) {
    let value = this.getFromCache(name);
    if (value == null) {
      value = this.getAttribute(name);
      this.saveToCache(name, value);
    }

    switch (type) {
      case 'boolean':
        return value === null
          ? defaultValue
          : value === '' || value === 'true' || value === true;
      case 'string':
        return value === null ? defaultValue : String(value);
      case 'number':
        return value === null ? defaultValue : Number(value);
      default:
        break;
    }
    console.error(`atag scroll-view: unrecognized type of ${type}`);
  }

  valueCache = {};
  saveToCache(key, value) {
    this.valueCache[key] = value;
  }
  getFromCache(key) {
    return this.valueCache[key];
  }
  expireCache(key) {
    delete this.valueCache[key];
  }

  static get template() {
    return html`
      <style>
        :host {
          position: relative;
          display: block;
          box-sizing: border-box;
          
          -webkit-user-select: none;
          user-select: none;
          
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define(ScrollViewElement.is, ScrollViewElement);
