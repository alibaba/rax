import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';

export default class ViewElement extends PolymerElement {
  static get is() {
    return 'a-view';
  }

  static get properties() {
    return {
      /**
       * Whether to prevent scrolling pages in the area
       * Boolean, default false
       */
      disableScroll: {
        type: Boolean,
        value: false,
      },
      /**
       * How long after clicking and holding, the click state, in ms
       * Number, default 50
       */
      hoverStartTime: {
        type: Number,
        value: 50,
      },
      /**
       * Hover state retention time after the finger is released, in milliseconds
       * Number, default 400
       */
      hoverStayTime: {
        type: Number,
        value: 400,
      },
      /**
       * Specifies whether to prevent the ancestor node of this node from hovering
       * Boolean, default false
       */
      hoverStopPropagation: {
        type: Boolean,
        value: false,
      },
      hoverStyle: {
        type: String,
        value: '',
      },
      hoverClass: {
        type: String,
        value: '',
      },
    }
  }

  _hoverActiveState = false;

  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, () => {
      this.addEventListener('touchstart', this._handleTouchstart);
      this.addEventListener('touchmove', this._handleTouchmove);
      this.addEventListener('touchend', this._handleTouchend);
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('touchstart', this._handleTouchstart);
    this.removeEventListener('touchmove', this._handleTouchmove);
    this.removeEventListener('touchend', this._handleTouchend);
  }

  _handleTouchstart = (evt) => {
    if (this.hoverStopPropagation) {
      evt.stopPropagation();
    }
    this._activeHoverState();
  };

  _handleTouchmove = (evt) => {
    if (this.disableScroll) {
      evt.preventDefault();
    }
  };

  _handleTouchend = (evt) => {
    if (this.hoverStopPropagation) {
      evt.stopPropagation();
    }
    this._inactiveHoverState();
  };

  /**
   * Add a flag bit in style to specify the hover state
   */
  _setHoverAttrs() {
    let currentHoverStyle = this.hoverStyle;
    if (currentHoverStyle) {
      let originStyle = this.getAttribute('style') || '';
      this.setAttribute(
        'style',
        originStyle + '/*h*/' + currentHoverStyle + '/*h*/'
      );
    }

    const hoverClassList = this._getHoverClassList();
    for (let i = 0, len = hoverClassList.length; i < len; i++) {
      this.classList.add(hoverClassList[i]);
    }
  }

  _removeHoverAttrs() {
    const rawCSSText = this.getAttribute('style') || '';
    const cssText = rawCSSText.replace(/(\/\*h\*\/).*\1/, '');
    rawCSSText !== cssText && this.setAttribute('style', cssText);

    const hoverClassList = this._getHoverClassList();
    for (let i = 0, len = hoverClassList.length; i < len; i++) {
      this.classList.remove(hoverClassList[i]);
    }
  }

  _getHoverClassList() {
    if (this.hoverClass) {
      return this.hoverClass.trim().split(/\s+/);
    } else {
      return [];
    }
  }

  _activeHoverState() {
    const delay = this.hoverStartTime;
    clearTimeout(this.hoverActiveTimer);

    this.hoverActiveTimer = setTimeout(() => {
      this._setHoverAttrs();
      this._hoverActiveState = true;
    }, delay);
  }

  _inactiveHoverState() {
    const delay = this.hoverStayTime;
    clearTimeout(this.hoverActiveTimer);
    clearTimeout(this.hoverInactiveTimer);

    this.hoverInactiveTimer = setTimeout(() => {
      this._hoverActiveState = false;
      this._removeHoverAttrs();
    }, delay);
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          -webkit-user-select: none;
          user-select: none;
          -webkit-overflow-scrolling: touch;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define(ViewElement.is, ViewElement);
