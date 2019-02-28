import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import * as Gestures from '@polymer/polymer/lib/utils/gestures';

const style = document.createElement('style');
style.innerHTML = `
  a-view {
    display: block;
    -webkit-user-select: none;
    user-select: none;
    -webkit-overflow-scrolling: touch;
  }
`;
document.head.appendChild(style);

export default class ViewElement extends HTMLElement {
  static get is() {
    return 'a-view';
  }

  /**
   * Whether to prevent scrolling pages in the area
   * @type Boolean, default to false
   */
  disableScroll = false;

  /**
   * How long after clicking and holding, the click state, in ms
   * Number, default 50
   */
  hoverStartTime = 50;

  /**
   * Hover state retention time after the finger is released, in milliseconds
   * Number, default 400
   */
  hoverStayTime = 400;

  /**
   * Specifies whether to prevent the ancestor node of this node from hovering
   * Boolean, default false
   */
  hoverStopPropagation = false;

  hoverStyle = '';
  hoverClass = '';

  _hoverActiveState = false;

  static get observedAttributes() {
    return [
      'disable-scroll',
      'hover-start-time',
      'hover-stay-time',
      'hover-stop-propagation',
      'hover-style',
      'hover-class',
    ];
  }

  attributeChangedCallback(prop, oldValue, newValue) {
    switch (prop) {
      case 'disable-scroll':
        this.disableScroll = !!newValue;
        break;

      case 'hover-start-time':
        this.hoverStartTime = Number(newValue) || 50;
        break;

      case 'hover-stay-time':
        this.hoverStartTime = Number(newValue) || 400;
        break;

      case 'hover-stop-propagation':
        this.hoverStopPropagation = !!newValue;
        break;

      case 'hover-style':
        this.hoverStyle = String(newValue);
        break;

      case 'hover-class':
        this.hoverClass = String(newValue);
        break;
    }
  }

  connectedCallback() {
    afterNextRender(this, () => {
      Gestures.addListener(this, 'down', this._handleHoverStart);
      Gestures.addListener(this, 'up', this._handleHoverEnd);
      this.addEventListener('touchmove', this._handleTouchmove);
    });
  }

  disconnectedCallback() {
    Gestures.addListener(this, 'down', this._handleHoverStart);
    Gestures.addListener(this, 'up', this._handleHoverEnd);
    this.removeEventListener('touchmove', this._handleTouchmove);
  }

  _handleHoverStart = (evt) => {
    if (this.hoverStopPropagation) {
      evt.stopPropagation();
    }
    this._activeHoverState();
  };

  _handleHoverEnd = (evt) => {
    if (this.hoverStopPropagation) {
      evt.stopPropagation();
    }
    this._inactiveHoverState();
  };

  _handleTouchmove = (evt) => {
    if (this.disableScroll) {
      evt.preventDefault();
    }
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
}

customElements.define(ViewElement.is, ViewElement);
