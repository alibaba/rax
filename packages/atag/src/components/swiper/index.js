import './swiper-item';
import { PolymerElement, html } from '@polymer/polymer';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer';

const MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];

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

    this.addEventListener('mousedown', this._handleMouseDown);
    this.addEventListener('touchstart', this._handleTouchStart);
    this.addEventListener('touchmove', this._handleTouchMove);
    this.addEventListener('touchend', this._handleTouchEnd);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('mousedown', this._handleMouseDown);
    this.removeEventListener('touchstart', this._handleTouchStart);
    this.removeEventListener('touchmove', this._handleTouchMove);
    this.removeEventListener('touchend', this._handleTouchEnd);
    this._childrenObserver.disconnect();
  }

  _trackingState = {
    // touch/mouse point position
    x: 0,
    y: 0,
    // start/tracking/end
    state: 'start',
    // touch/mouse points
    moves: [],
  };

  _handleMouseDown = (evt) => {
    if (!hasLeftMouseButton(evt)) {
      return;
    }

    // Stop scroll nested.
    evt.stopPropagation();

    const x = this._trackingState.x = evt.clientX;
    const y = this._trackingState.y = evt.clientY;
    this._trackingState.moves.push({ x, y });
    this._trackingState.state = 'start';

    const tempMouseMoveHandler = (evt) => {
      const x = evt.clientX;
      const y = evt.clientY;
      const dx = x - this._trackingState.x;
      const dy = y - this._trackingState.y;
      this.dragging = true;

      if (this.timer !== null) {
        clearTimeout(this.timer);
      }

      this.startTranslate = this._getOffset(this.circular ? this.current + 1 : this.current);
      this.startTime = new Date().getTime();
      this.transitionDuration = 0;

      // TODO: add performanceMode desc
      if (!this.performanceMode) {
        this._setTranslate(this.startTranslate + (this.vertical ? dy : dx));
        this._trackingState.moves.push({ x, y });
      }
    };
    const tempMouseUpHandler = (evt) => {
      const x = evt.clientX;
      const y = evt.clientY;
      const dx = x - this._trackingState.x;
      const dy = y - this._trackingState.y;
      this._determinMove({ dx, dy });

      document.documentElement.removeEventListener('mousemove', tempMouseMoveHandler, true);
      document.documentElement.removeEventListener('mouseup', tempMouseUpHandler, true);
    };

    document.documentElement.addEventListener('mousemove', tempMouseMoveHandler, true);
    document.documentElement.addEventListener('mouseup', tempMouseUpHandler, true);
  };

  _handleTouchStart = (evt) => {
    const currentTouch = evt.changedTouches[0];
    const x = this._trackingState.x = currentTouch.clientX;
    const y = this._trackingState.y = currentTouch.clientY;
    this._trackingState.moves.push({ x, y });
    this._trackingState.state = 'start';

    // Find parent scroll view, stop its' scroll.
    const parentScrollViews = findParentElements(this, 'a-scroll-view');
    this._trackingState.scrollElements = parentScrollViews;
    if (parentScrollViews.length) {
      parentScrollViews.forEach((el) => {
        // A scroll element protocol, if prevent is true, do not response.
        el.prevent = true;
      });
    }
  };

  _handleTouchMove = (evt) => {
    if (this.prevent) return;

    const currentTouch = evt.changedTouches[0];
    const moves = this._trackingState.moves;
    this._trackingState.state = 'track';

    const x = currentTouch.clientX;
    const y = currentTouch.clientY;

    const dx = x - moves[moves.length - 1].x;
    const dy = y - moves[moves.length - 1].y;
    const direction = Math.abs(dy) - Math.abs(dx);
    // this._trackingState.moves.push({ x, y });

    if (!this.vertical && direction < 0 || this.vertical && direction > 0) {
      this._handleTrackStart({ x, y });
    }

    evt.stopPropagation();
  };

  _handleTouchEnd = (evt) => {
    this._trackingState.state = 'end';
    if (this._trackingState.scrollElements) {
      this._trackingState.scrollElements.forEach((el) => {
        el.prevent = false;
      });
    }
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

  _handleTrackStart = (evt) => {
    this.dragging = true;

    if (this.timer !== null) {
      clearTimeout(this.timer);
    }

    this.startTranslate = this._getOffset(this.circular ? this.current + 1 : this.current);
    this.startTime = new Date().getTime();
    this.transitionDuration = 0;

    document.documentElement.addEventListener('touchmove', this._handleGlobalMove, true);
    document.documentElement.addEventListener('touchend', this._handleGlobalEnd, true);
  };

  _handleGlobalMove = (evt) => {
    const touch = evt.changedTouches[0];
    const dx = touch.clientX - this._trackingState.x;
    const dy = touch.clientY - this._trackingState.y;

    // TODO: add performanceMode desc
    if (!this.performanceMode) {
      this._setTranslate(this.startTranslate + (this.vertical ? dy : dx));
      this._trackingState.moves.push({
        x: touch.clientX,
        y: touch.clientY,
      });
    }
  };

  _handleGlobalEnd = (evt) => {
    const touch = evt.changedTouches[0];
    const dx = touch.clientX - this._trackingState.x;
    const dy = touch.clientY - this._trackingState.y;
    this._determinMove({ dx, dy });

    // To prevent event bubble is stopped.
    document.documentElement.removeEventListener('touchmove', this._handleGlobalMove, true);
    document.documentElement.removeEventListener('touchend', this._handleGlobalEnd, true);
  };

  _determinMove({ dx, dy }) {
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
  }

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

function isMouseEvent(name) {
  return MOUSE_EVENTS.indexOf(name) > -1;
}

function hasLeftMouseButton(ev) {
  let type = ev.type;
  // exit early if the event is not a mouse event
  if (!isMouseEvent(type)) {
    return false;
  }
  // ev.button is not reliable for mousemove (0 is overloaded as both left button and no buttons)
  // instead we use ev.buttons (bitmask of buttons) or fall back to ev.which (deprecated, 0 for no buttons, 1 for left button)
  if (type === 'mousemove') {
    // allow undefined for testing events
    let buttons = ev.buttons === undefined ? 1 : ev.buttons;
    // buttons is a bitmask, check that the left button bit is set (1)
    return Boolean(buttons & 1);
  } else {
    // allow undefined for testing events
    let button = ev.button === undefined ? 0 : ev.button;
    // ev.button is 0 in mousedown/mouseup/click for left button activation
    return button === 0;
  }
}

/**
 * Get special in parent DOM Tree
 * @param element {Element} Base element
 * @param name {String} Lowercased tag name.
 * @return {HTMLElement[]} result.
 */
function findParentElements(element, name) {
  const result = [];

  let parent = element.parentElement;
  while (parent) {
    if (parent.tagName.toLowerCase() === name) {
      result.push(parent);
    }

    parent = parent.parentElement;
  }
  return result;
}

customElements.define(Swiper.is, Swiper);
