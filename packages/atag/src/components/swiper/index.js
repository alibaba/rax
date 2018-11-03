import 'components/swiper/swiper-item';
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
        value: false
      },
      circular: {
        type: Boolean,
        value: false,
      },
      duration: {
        type: Number,
        value: 500,
      },
      autoplay: {
        type: Boolean,
        value: false,
      },
      interval: {
        type: Number,
        value: 5000,
      },
      indicatorDots: {
        type: Boolean,
        value: false,
        observer: '_observerIndicatorDots',
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
    };
  }

  constructor() {
    super();
    this.translateX = 0;
    this.translateY = 0;
    this.startTranslate = 0;
    this.dragging = false;
    this.startPos = null;
    this.transitionDuration = 500;
  }

  get isCircular() {
    // if itemsCount less than 1, circular should not perform
    return this.itemsCount > 1 && this.circular || this.circular === '';
  }

  get isAutoplay() {
    return this.autoplay || this.autoplay === '';
  }

  get itemsCount() {
    return FlattenedNodesObserver.getFlattenedNodes(this).filter(node => node.nodeName === 'A-SWIPER-ITEM').length;
  }

  ready() {
    // Be sure to add super.ready() or you won't get shadowRoot
    super.ready();

    this.childrenObserver = new FlattenedNodesObserver(this, this.handleChildrenChanged);
    this.render();

    Gestures.addListener(this, 'track', this._handleTrack);
    Gestures.setTouchAction(this, 'auto');

    this.isReady = true;
  }

  handleChildrenChanged(info) {
    // Reset number of indicators
    this.indicators = new Array(this.itemsCount);
    // Rerender the current swiper item
    this.render();

    this._resetCircularAssistNode();
    if (this.isCircular) {
      this._createCircularAssistNode();
      if (this.duplicateFirstChild) {
        this._setTranslate(this._getTranslateOfRealItem(this.current + 1), 0);
      }
    }
  }

  render() {
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
    let realCurrent = this.isCircular ? this.current + 1 : this.current;
    this._setTranslate(this._getTranslateOfRealItem(realCurrent), 0);

    if (this.isAutoplay) {
      this._autoplay();
    }
  }

  _computeIndicatorDotStyle(current) {
    return function(index) {
      return current === index ? this.indicatorActiveColor : this.indicatorColor;
    };
  }

  _observerIndicatorDots(newVal, oldVal) {
    this.$.indicator.style.display = newVal ? 'block' : 'none';
  }

  attributeChangedCallback(key, oldVal, newVal) {
    super.attributeChangedCallback(key, oldVal, newVal);

    switch (key) {
      case 'autoplay':
        this.autoplay = newVal === 'true' || newVal === '';
        if (oldVal !== null) {
          if (newVal === 'false') {
            clearTimeout(this.timer);
          } else {
            this._autoplay();
          }
        }
        break;
      case 'indicator-dots':
        this.indicatorDots = newVal === 'true';
        break;
      case 'vertical':
        this.vertical = newVal === 'true';
        break;
      case 'current':
        if (this.isReady && Number(newVal) > -1 && Number(newVal) < this.itemsCount) {
          if (this.timer !== null) {
            clearTimeout(this.timer);
          }
          var realCurrent = this.isCircular ? Number(newVal) + 1 : Number(newVal);
          this._setTranslate(this._getTranslateOfRealItem(realCurrent));

          if (this.isAutoplay) {
            this._autoplay();
          }
        }
        break;
      default:
        break;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Gestures.removeListener(this, 'track', this._handleTrack);
    this.childrenObserver.disconnect();
  }

  getContainerClass() {
    return `swiper ${this.vertical ? 'vertical' : 'horizontal'}`;
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

    this.startTranslate = this._getTranslateOfRealItem(this.isCircular ? this.current + 1 : this.current);
    this.startTime = new Date().getTime();
    this.transitionDuration = 0;

    Gestures.addListener(document.documentElement, 'track', this._handleGlobalTrack);
    /**
     * Avoid to disable document scroll
     */
    Gestures.setTouchAction(document.documentElement, null);
  };

  _handleGlobalTrack = ({detail}) => {
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
      if (!this.isCircular && this.current + 1 === this.itemsCount) {
        this._revert();
      } else {
        this._next();
      }
    } else if (delta > 100 || isQuickAction && delta > 15) {
      if (!this.isCircular && this.current === 0) {
        this._revert();
      } else {
        this._prev();
      }
    } else {
      this._revert();
    }

    if (this.isAutoplay) {
      setTimeout(() => {
        this._autoplay();
      }, this.duration);
    }

    Gestures.removeListener(document.documentElement, 'track', this._handleGlobalTrack);
  };

  _next = () => {
    const itemsCount = this.itemsCount;
    this.current = this.current < 0 ? 0 : this.current > itemsCount - 1 ? itemsCount - 1 : this.current;
    const isCurrentLastItem = this.current === itemsCount - 1;
    const realCurrent = this.isCircular ? this.current + 1 : this.current;
    const nextRealCurrent = isCurrentLastItem ? this.isCircular ? realCurrent + 1 : 0 : realCurrent + 1;

    this.prevAction = 'next';
    this._setRealItem(nextRealCurrent);

    this.prevCurrent = this.current;
    this.current = isCurrentLastItem ? 0 : this.current + 1;
  };

  _prev = () => {
    const isCurrentFirstItem = this.current === 0;
    const realCurrent = this.isCircular ? this.current + 1 : this.current;
    const prevRealCurrent = isCurrentFirstItem ? this.isCircular ? realCurrent - 1 : 0 : realCurrent - 1;

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
    this._setTranslate(this._getTranslateOfRealItem(realCurrent), noAnimation ? 0 : null);
  }

  _onTransitionEnd() {
    const isPrevCurrentLastItem = this.prevAction === 'next' && this.prevCurrent === this.itemsCount - 1;
    const isPrevCurrentFirstItem = this.prevAction === 'prev' && this.prevCurrent === 0;
    if (this.isCircular && (isPrevCurrentLastItem || isPrevCurrentFirstItem)) {
      this._setRealItem(isPrevCurrentLastItem ? 1 : this.itemsCount, this.isCircular);
    }

    this._emitChangeEvent();
  }

  _setTranslate(value, duration) {
    const translateName = this.vertical ? 'translateY' : 'translateX';
    this[translateName] = value;

    const swiperItems = this.$.swiperItems;
    const transitionDuration = duration != null ? duration : this.transitionDuration;

    swiperItems.style.transitionDuration = swiperItems.style.webkitTransitionDuration = `${transitionDuration}ms`;
    swiperItems.style.transform = swiperItems.style.webkitTransform = `translate3d(${this.translateX}px, ${this.translateY}px, 0)`;
  }

  _getTranslate() {
    const translateName = this.vertical ? 'translateY' : 'translateX';
    return this[translateName];
  }

  _getTranslateOfRealItem(realCurrent) {
    const propName = this.vertical ? 'height' : 'width';

    /**
     * `this.$.swiperItems.children` can only get slot element
     * Using this.children to get real childNodes
     */
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

    var translate = 0;
    for (var i = 0; i < realCurrent; i++) {
      var item = childItems[i];
      if (!item) break;
      if (item.__rectCache == null) {
        item.__rectCache = item.getBoundingClientRect()[propName];
      }
      translate -= item.__rectCache;
    }

    return translate;
  }

  _resetCircularAssistNode() {
    if (this.duplicateFirstChild) {
      this.duplicateFirstChild.parentElement.removeChild(this.duplicateFirstChild);
    }
    if (this.duplicateLastChild) {
      this.duplicateLastChild.parentElement.removeChild(this.duplicateLastChild);
    }
  }

  /**
   * Add circular assit node to shadom dom
   */
  _createCircularAssistNode() {
    const childSwiperItems = this.children;
    if (childSwiperItems.length > 1) {
      this.duplicateFirstChild = childSwiperItems[0].cloneNode(true);
      // Marker node type
      this.duplicateFirstChild.setAttribute('data-a-swiper-duplicate-first-child', true);

      this.duplicateLastChild = this.children[childSwiperItems.length - 1].cloneNode(true);
      this.duplicateLastChild.setAttribute('data-a-swiper-duplicate-last-child', true);

      const { swiperItems } = this.$;
      swiperItems.insertBefore(this.duplicateLastChild, swiperItems.children[0]);
      swiperItems.appendChild(this.duplicateFirstChild);
    }
  }

  _emitChangeEvent() {
    const event = new CustomEvent('change', {
      bubbles: false,
      cancelable: true,
      detail: {
        current: this.current < 0 ? 0 : this.current > this.itemsCount - 1 ? this.itemsCount - 1 : this.current,
      },
    });

    this.dispatchEvent(event);
  }

  _autoplay = () => {
    if (this.itemsCount === 1) return;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this._next();
      this._autoplay();
    }, this.interval);
  };

  _handleTrack({detail}) {
    if (detail.state === 'start') {
      const dx = detail.dx;
      const dy = detail.dy;
      const direction = Math.abs(dy) - Math.abs(dx);

      if (!this.vertical && direction < 0 || this.vertical && direction > 0) {
        this._handleTrackStart(detail);
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
      <div on-touchmove="_handleSwiperTouchMove" class$="[[getContainerClass()]]">
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
