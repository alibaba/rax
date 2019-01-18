import './swiper-item';
import { PolymerElement, html } from '@polymer/polymer';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import * as Gestures from '@polymer/polymer/lib/utils/gestures';

export default class Swiper extends PolymerElement {
  static get is() {
    return 'a-swiper';
  }

  static get properties() {
    return {
      current: {
        type: Number,
        value: 0,
      },
      currentItemId: {
        type: String,
      },
      vertical: {
        type: Boolean,
        value: false,
        observer: '_observeVertical',
      },
      circular: {
        type: Boolean,
        value: false,
        observer: '_observeCircular',
        computed: '_computeCircular(circular)',
      },
      duration: {
        type: Number,
        value: 500,
      },
      autoplay: {
        type: Boolean,
        value: false,
        observer: '_observeAutoplay',
      },
      interval: {
        type: Number,
        value: 5000,
      },
      indicatorDots: {
        type: Boolean,
        value: false,
        observer: '_observeIndicatorDots',
      },
      indicatorColor: {
        type: String,
        value: 'rgba(0, 0, 0, .3)',
      },
      indicatorActiveColor: {
        type: String,
        value: 'rgb(0, 0, 0)',
      },
      _indicatorDotStyle: {
        type: String,
        computed: '_computeIndicatorDotStyle(current)',
      },
      _containerClass: {
        type: String,
        computed: '_computeContainerClass(vertical)',
      }
    };
  }

  constructor() {
    super();
    this.translateX = 0;
    this.translateY = 0;
    this.startTranslate = 0;
    this.dragging = false;
    this.startPos = null;
    this._current = 0;
    this.transitionDuration = 500;
  }

  _computeCircular(circular) {
    // If itemsCount less than 1, circular should not perform
    return this.itemsCount > 1 && circular;
  }

  _observeCircular(circular, prevCircular) {
    if (prevCircular !== circular) {
      if (circular) {
        this._createCircularAssistNode();
      } else {
        this._removeCircularAssistNode();
      }
    }
  }

  get itemsCount() {
    return FlattenedNodesObserver.getFlattenedNodes(this)
      .filter(node => node.nodeName === 'A-SWIPER-ITEM' && !node.hasAttribute('a-swiper-helper')).length;
  }

  ready() {
    // Be sure to add super.ready() or you won't get shadowRoot
    super.ready();
    this.isReady = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this._childrenObserver = new FlattenedNodesObserver(this, this._handleChildrenChanged);
    this._render();
    Gestures.addListener(this, 'track', this._handleTrack);
    Gestures.setTouchAction(this, 'auto');

    this.parentScrollView = this._getNearestParentElement(this, (el) => {
      return el && el.tagName.toLowerCase() === 'a-scroll-view';
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Gestures.removeListener(this, 'track', this._handleTrack);
    this._childrenObserver.disconnect();
  }

  _handleChildrenChanged({ addedNodes }) {
    if (addedNodes && addedNodes.every((item) => {
      if (item.nodeType === document.ELEMENT_NODE) {
        return item.hasAttribute('a-swiper-helper');
      }
    })) {
      return;
    }
    // Reset number of indicators
    this.indicators = new Array(this.itemsCount);
    // Rerender the current swiper item
    this._render();

    this._removeCircularAssistNode();
    if (this.circular) {
      this._createCircularAssistNode();
    }
  }

  _render() {
    if (this.currentItemId) {
      const currentItem = this.querySelector(`[item-id=${this.currentItemId}]`);
      for (var i = 0; i < this.children.length; ++i) {
        if (currentItem === this.children[i]) {
          this.current = i;
          break;
        }
      }
    }

    // Set init current item
    let realCurrent = this.circular ? this.current + 1 : this.current;
    this._setTranslate(this._getOffset(realCurrent), 0);

    if (this.isAutoplay) {
      this._activeAutoplay();
    }
  }

  _computeIndicatorDotStyle(current) {
    return function(index) {
      return current === index ? this.indicatorActiveColor : this.indicatorColor;
    };
  }

  _observeIndicatorDots(newVal, oldVal) {
    this.$.indicator.style.display = newVal ? 'block' : 'none';
  }

  _observeVertical(vertical) {
    // Set init current item
    let realCurrent = this.circular ? this.current + 1 : this.current;
    const offset = this._getOffset(realCurrent);
    this._setRealItem(offset, 0);
  }

  _observeAutoplay(autoplay) {
    clearTimeout(this.timer);
    if (autoplay) {
      this._activeAutoplay();
    }
  }

  attributeChangedCallback(key, oldVal, newVal) {
    super.attributeChangedCallback(key, oldVal, newVal);
    switch (key) {
      case 'current': {
        const current = newVal;
        if (this.isReady && current > -1 && current < this.itemsCount) {
          clearTimeout(this.timer);
          const realCurrent = this.circular ? current + 1 : current;
          this._setTranslate(this._getOffset(realCurrent));

          if (this.autoplay) {
            this._activeAutoplay();
          }
        }
      }
    }
  }

  _computeContainerClass(vertical) {
    return `swiper ${vertical ? 'vertical' : 'horizontal'}`;
  }

  _handleSwiperTouchMove = event => {
    // Prevent scrolling in swipper when user is dragging
    if (this.dragging) {
      event.preventDefault();
    }
  };

  _handleTrackStart = ({ x, y }) => {
    this.dragging = true;

    if (this.timer !== null) {
      clearTimeout(this.timer);
    }

    this.startTranslate = this._getOffset(this.circular ? this.current + 1 : this.current);
    this.startTime = new Date().getTime();
    this.transitionDuration = 0;

    Gestures.addListener(document.documentElement, 'track', this._handleGlobalTrack);
    // Avoid to disable document scroll
    Gestures.setTouchAction(document.documentElement, null);
  };

  /**
   * Find nearnet parent swiper element.
   * @param el {HTMLElement} Element.
   * @param isTarget {Function} If is target return true.
   * @private
   */
  _getNearestParentElement(el, isTarget) {
    while (el) {
      if (!el || isTarget(el)) {
        return el;
      }

      el = el.parentElement;
    }
  }

  _handleGlobalTrack = (evt) => {
    const { detail } = evt;

    /**
     * If swiper nested, only handle with nearest parent swiper,
     * in case of all swipers trigger scroll.
     */
    const targetSwiper = this._getNearestParentElement(evt.target, (el) => {
      return el && el.tagName.toLowerCase() === 'a-swiper';
    });
    if (targetSwiper !== this) return;

    if (detail.state === 'end') {
      this._handleGlobalEnd(detail);
    } else {
      // Move when start or track state
      this._handleGlobalMove(detail);
    }
  };

  _handleGlobalMove = ({dx, dy}) => {
    // TODO: add performanceMode desc
    if (!this.performanceMode) {
      this._setTranslate(this.startTranslate + (this.vertical ? dy : dx));
    }
  };

  _handleGlobalEnd = ({dx, dy}) => {
    this.dragging = false;

    this.transitionDuration = this.duration;
    const isQuickAction = new Date().getTime() - this.startTime < 1000;
    const delta = this.vertical ? dy : dx;

    if (delta < -100 || isQuickAction && delta < -15) {
      if (!this.circular && this.current + 1 === this.itemsCount) {
        this._revert();
      } else {
        this._next();
      }
    } else if (delta > 100 || isQuickAction && delta > 15) {
      if (!this.circular && this.current === 0) {
        this._revert();
      } else {
        this._prev();
      }
    } else {
      this._revert();
    }

    if (this.autoplay) {
      setTimeout(() => {
        this._activeAutoplay();
      }, this.duration);
    }

    Gestures.removeListener(document.documentElement, 'track', this._handleGlobalTrack);
  };

  _next = () => {
    const itemsCount = this.itemsCount;
    const current = this.current < 0 ? 0 : this.current > itemsCount - 1 ? itemsCount - 1 : this.current;
    const isCurrentLastItem = current === itemsCount - 1;
    const realCurrent = this.circular ? current + 1 : current;
    const nextRealCurrent = isCurrentLastItem ? this.circular ? realCurrent + 1 : 0 : realCurrent + 1;
    this.prevAction = 'next';
    this._setRealItem(nextRealCurrent);

    this.prevCurrent = this.current;
    this.current = isCurrentLastItem ? 0 : this.current + 1;
  };

  _prev = () => {
    const isCurrentFirstItem = this.current === 0;
    const realCurrent = this.circular ? this.current + 1 : this.current;
    const prevRealCurrent = isCurrentFirstItem ? this.circular ? realCurrent - 1 : 0 : realCurrent - 1;

    this.prevAction = 'prev';
    this._setRealItem(prevRealCurrent);

    this.prevCurrent = this.current;
    this.current = isCurrentFirstItem ? this.itemsCount - 1 : this.current - 1;
  };

  _revert = () => {
    // Only no loop mode will should revert
    this._setRealItem(this.current);
  };

  _setRealItem(realCurrent, noAnimation) {
    if (!noAnimation) {
      this.transitionDuration = this.duration;
    }
    /**
     * Hack: Add timestamp to trigger MutaionObserver of
     * polyfilled IntersectionObserver to make
     * image lazyLoad works
     */
    this.setAttribute('data-timestamp', Date.now());
    this._setTranslate(this._getOffset(realCurrent), noAnimation ? 0 : null);
  }

  _onTransitionEnd() {
    const isPrevCurrentLastItem = this.prevAction === 'next' && this.prevCurrent === this.itemsCount - 1;
    const isPrevCurrentFirstItem = this.prevAction === 'prev' && this.prevCurrent === 0;
    if (this.circular && (isPrevCurrentLastItem || isPrevCurrentFirstItem)) {
      this._setRealItem(isPrevCurrentLastItem ? 1 : this.itemsCount, this.circular);
    }

    this._emitChangeEvent();
  }

  _setTranslate(offset, duration) {
    if (this.vertical) {
      this.translateX = 0;
      this.translateY = offset;
    } else {
      this.translateX = offset;
      this.translateY = 0;
    }

    const { swiperItems } = this.$;
    const transitionDuration = duration != null ? duration : this.transitionDuration;

    swiperItems.style.transitionDuration = swiperItems.style.webkitTransitionDuration = `${transitionDuration}ms`;
    swiperItems.style.transform = swiperItems.style.webkitTransform = `translate3d(${this.translateX}px, ${this.translateY}px, 0)`;
  }

  /**
   * Get the offset pixel.
   * Using this.children to get real childNodes.
   */
  _getOffset(realCurrent) {
    const propName = this.vertical ? 'height' : 'width';
    const childItems = [];
    for (let i = 0, l = this.children.length; i < l; i++) {
      childItems.push(this.children[i]);
    }
    if (this.duplicateFirstChild) {
      childItems.unshift(this.duplicateFirstChild);
    }
    if (this.duplicateLastChild) {
      childItems.push(this.duplicateLastChild);
    }

    let translate = 0;
    for (let i = 0; i < realCurrent; i++) {
      if (childItems[i]) {
        translate -= childItems[i].getBoundingClientRect()[propName];
      }
    }
    return translate;
  }

  /**
   * Add circular assit node to shadom dom
   */
  _createCircularAssistNode() {
    const childSwiperItems = this.children;
    if (childSwiperItems.length > 1) {
      // Marker node type
      this.duplicateFirstChild = childSwiperItems[0].cloneNode(true);
      this.duplicateFirstChild.setAttribute('a-swiper-helper', true);
      this.duplicateLastChild = this.children[childSwiperItems.length - 1].cloneNode(true);
      this.duplicateLastChild.setAttribute('a-swiper-helper', true);

      this.insertBefore(this.duplicateLastChild, this.firstElementChild);
      this.appendChild(this.duplicateFirstChild);
    }
    if (this.duplicateFirstChild) {
      this._setTranslate(this._getOffset(this.current + 1), 0);
    }
  }

  _removeCircularAssistNode() {
    if (this.duplicateFirstChild) {
      this.removeChild(this.duplicateFirstChild);
      this.duplicateFirstChild = null;
    }
    if (this.duplicateLastChild) {
      this.removeChild(this.duplicateLastChild);
      this.duplicateLastChild = null;
    }
    this._setTranslate(this._getOffset(this.current), 0);
  }

  _emitChangeEvent() {
    const event = new CustomEvent('change', {
      bubbles: false,
      cancelable: true,
      detail: {
        current: this.current < 0
          ? 0
          : this.current > this.itemsCount - 1
            ? this.itemsCount - 1
            : this.current,
      },
    });

    this.dispatchEvent(event);
  }

  _activeAutoplay = () => {
    if (this.itemsCount === 1) return;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this._next();
      this._activeAutoplay();
    }, this.interval);
  };

  _handleTrack = (evt) => {
    const { detail } = evt;
    if (detail.state === 'start') {
      const dx = detail.dx;
      const dy = detail.dy;
      const direction = Math.abs(dy) - Math.abs(dx);

      if (!this.vertical && direction < 0 || this.vertical && direction > 0) {
        this._handleTrackStart(detail);
      }

      // Prevent parent scroll view
      if (this.parentScrollView) {
        this.parentScrollView.prevent = true;
      }
    } else if (detail.state === 'end') {
      if (this.parentScrollView) {
        this.parentScrollView.prevent = false;
      }
    }
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          height: 150px;
        }
        .swiper {
          position: relative;
          height: 100%;
          overflow: hidden;
        }
        .swiper .swiper-items {
          display: flex;
          display: -webkit-flex;
          width: 100%;
          height: 100%;
          transition: all 500ms ease;
          -webkit-transition: all 500ms ease;
        }
        .swiper.horizontal .swiper-items {
          flex-direction: row;
          -webkit-flex-direction: row;
        }
        .swiper.vertical .swiper-items {
          flex-direction: column;
          -webkit-flex-direction: column;
        }
        .swiper .swiper-pagination {
          position: absolute;
        }
        .swiper .swiper-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: all 500ms ease;
          -webkit-transition: all 500ms ease;
        }
        .swiper .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #000000;
          transition: all 500ms ease;
          -webkit-transition: all 500ms ease;
        }
        .swiper.vertical .swiper-pagination {
          right: 10px;
          top: 50%;
          transform: translate3d(0, -50%, 0);
          -webkit-transform: translate3d(0, -50%, 0);
        }
        .swiper.vertical .swiper-pagination .swiper-pagination-bullet {
          display: block;
          margin: 6px 0;
        }
        .swiper.horizontal .swiper-pagination {
          line-height: 0;
          bottom: 1.6vw;
          width: 100%;
          text-align: center;
        }
        .swiper.horizontal .swiper-pagination .swiper-pagination-bullet {
          display: inline-block;
          margin: 0 3px;
        }
      </style>
      <div on-touchmove="_handleSwiperTouchMove" class$="[[_containerClass]]">
        <div id="swiperItems" class="swiper-items" on-transitionend="_onTransitionEnd">
          <slot></slot>
        </div>
        <div id="indicator" class="swiper-pagination">
          <template is="dom-repeat" items="{{indicators}}" index-as="index">
            <div class="swiper-pagination-bullet" style$="background-color: {{_indicatorDotStyle(index)}}"></div>
          </template>
        </div>
      </div>
    `;
  }
}

customElements.define(Swiper.is, Swiper);
