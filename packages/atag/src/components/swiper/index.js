import './swiper-item';
import { PolymerElement, html } from '@polymer/polymer';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';
import * as Gestures from '@polymer/polymer/lib/utils/gestures';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';

export default class Swiper extends PolymerElement {
  static get is() {
    return 'a-swiper';
  }

  static get properties() {
    return {
      current: {
        type: Number,
        value: 0,
        observer: '_observeCurrent',
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
        observer: '_observeDuration',
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

  /**
   * Mark scrollable element and direction.
   * @private
   */
  _scrollable = true;
  _scrollDirection = 'x';
  _prevent = false;

  constructor() {
    super();
    this._translateX = 0;
    this._translateY = 0;
    this._startTranslate = 0;
    this._dragging = false;
    this._scrolling = false;
    this._startPos = null;
    this._current = 0;
  }

  _observeDuration(duration) {
    this.transitionDuration = duration;
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
    document.addEventListener('scroll', this._handleGlobalScroll);
    document.addEventListener('_scrollviewscroll', this._handleGlobalScroll);
    Gestures.addListener(this, 'track', this._handleTrack);
    this._allowBackwardFaceTouchEvent();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('scroll', this._handleGlobalScroll);
    document.removeEventListener('_scrollviewscroll', this._handleGlobalScroll);
    Gestures.removeListener(this, 'track', this._handleTrack);
    this._childrenObserver.disconnect();
  }

  /**
   * If global scrolling is trigging, add a flag to avoid conflic to swiping.
   */
  _handleGlobalScroll = (event) => {
    this._scrolling = true;
  };

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

  _observeVertical(vertical, oldVertical) {
    // Set init current item
    let realCurrent = this.circular ? this.current + 1 : this.current;
    const offset = this._getOffset(realCurrent);
    this._setRealItem(offset, 0);
    this._scrollDirection = vertical ? 'y' : 'x';
    this._allowBackwardFaceTouchEvent();
  }

  _observeAutoplay(autoplay) {
    clearTimeout(this.timer);
    if (autoplay) {
      this._activeAutoplay();
    }
  }

  _observeCurrent(current) {
    if (this.isReady && current > -1 && current < this.itemsCount) {
      clearTimeout(this.timer);
      const realCurrent = this.circular ? current + 1 : current;
      this._setTranslate(this._getOffset(realCurrent));

      if (this.autoplay) {
        this._activeAutoplay();
      }
    }
  }

  _computeContainerClass(vertical) {
    return `swiper ${vertical ? 'vertical' : 'horizontal'}`;
  }

  _handleSwiperTouchMove = event => {
    // Prevent scrolling in swipper when user is _dragging
    if (this._dragging) {
      event.preventDefault();
    }
  };

  _handleTrackStart = ({ x, y }) => {
    this._dragging = true;

    if (this.timer !== null) {
      clearTimeout(this.timer);
    }

    this._startTranslate = this._getOffset(this.circular ? this.current + 1 : this.current);
    this.startTime = new Date().getTime();
    this.transitionDuration = 0;

    Gestures.addListener(document.documentElement, 'track', this._handleGlobalTrack);
    // Avoid to disable document scroll
    Gestures.setTouchAction(document.documentElement, null);
  };

  /**
   * Find nearnet parent element.
   * @param el {HTMLElement} Base element.
   * @param isTarget {Function} Judge the right element, return true if is target.
   * @private
   */
  _getNearestParentElement(el, isTarget) {
    while (el) {
      el = el.parentElement;
      if (!el || isTarget(el)) return el;
    }
  }

  _handleGlobalTrack = (evt) => {
    const { detail } = evt;

    if (this._prevent) return;

    if (detail.state === 'end') {
      this._handleGlobalEnd(detail);
    } else {
      // Move when start or track state
      this._handleGlobalMove(detail);
    }
  };

  _handleGlobalMove = ({dx, dy}) => {
    if (this._scrolling) return;

    // TODO: add performanceMode desc
    if (!this.performanceMode) {
      this._setTranslate(this._startTranslate + (this.vertical ? dy : dx));
    }
  };

  _handleGlobalEnd = ({dx, dy}) => {
    if (this._prevent) return;

    this._dragging = false;
    this._scrolling = false;

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
      this._translateX = 0;
      this._translateY = offset;
    } else {
      this._translateX = offset;
      this._translateY = 0;
    }

    const { swiperItems } = this.$;
    const transitionDuration = duration != null ? duration : this.transitionDuration;

    swiperItems.style.transitionDuration = swiperItems.style.webkitTransitionDuration = `${transitionDuration}ms`;
    swiperItems.style.transform = swiperItems.style.webkitTransform = `translate3d(${this._translateX}px, ${this._translateY}px, 0)`;
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
    // Early return to improve performance.
    if (detail.state === 'track') return;

    const parentSameDirectionScrollElement = this._getNearestParentElement(
      this,
      (el) => el._scrollable === true && el._scrollDirection === this._scrollDirection
    );

    if (detail.state === 'start') {
      const dx = detail.dx;
      const dy = detail.dy;
      const direction = Math.abs(dy) - Math.abs(dx);

      if (!this.vertical && direction < 0 || this.vertical && direction > 0) {
        this._handleTrackStart(detail);
      }

      // Prevent parent same direction scroll element.
      if (parentSameDirectionScrollElement) {
        parentSameDirectionScrollElement._prevent = true;
      }
    } else if (detail.state === 'end') {
      this._scrolling = false;
      if (parentSameDirectionScrollElement) {
        // @NOTE: After all event handler is done, the render function is done, then set _prevent.
        afterNextRender(this, () => {
          parentSameDirectionScrollElement._prevent = false;
        });
      }
    }
  }

  _allowBackwardFaceTouchEvent() {
    // Allow backward-facing touch events to bubble
    Gestures.setTouchAction(this, this.vertical ? 'pan-x' : 'pan-y');
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
