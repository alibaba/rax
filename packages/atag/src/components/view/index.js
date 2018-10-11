import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';

export default class ViewElement extends PolymerElement {
  static get is() {
    return 'a-view';
  }

  _hoverActiveState = false;

  _listen() {
    /**
     * Best practices for binding events
     * Trigger after first rendering
     */
    afterNextRender(this, () => {
      this.addEventListener('touchstart', this._active);
      this.addEventListener('touchend', this._inactive);
      if (this.disableScroll) {
        this.addEventListener('touchmove', this._disableScroll);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('touchstart', this._active);
    this.removeEventListener('touchend', this._inactive);
    if (this.disableScroll) {
      this.removeEventListener('touchmove', this._disableScroll);
    }
  }

  /**
   * Whether to prevent scrolling pages in the area
   * Boolean, default false
   */
  get disableScroll() {
    return this.getAttribute('disable-scroll') === 'true';
  }

  /**
   * How long after clicking and holding, the click state, in ms
   * Number, default 50
   */
  get hoverStartTime() {
    return parseInt(this.getAttribute('hover-start-time'), 10) || 50;
  }

  /**
   * Hover state retention time after the finger is released, in milliseconds
   * Number, default 400
   */
  get hoverStayTime() {
    return parseInt(this.getAttribute('hover-stay-time'), 10) || 400;
  }

  /**
   * Specifies whether to prevent the ancestor node of this node from hovering
   * Boolean, default false
   */
  get hoverStopPropagation() {
    return this.getAttribute('hover-stop-propagation') === 'true';
  }

  get hoverStyle() {
    return this.getAttribute('hover-style') || '';
  }

  _activeHoverStyle() {
    /**
     * Add a flag bit in style to specify the hover state
     */
    let currentHoverStyle = this.hoverStyle;
    if (currentHoverStyle) {
      let originStyle = this.getAttribute('style') || '';
      this.setAttribute(
        'style',
        originStyle + '/*h*/' + currentHoverStyle + '/*h*/'
      );
    }

    this._hoverActiveState = true;
  }

  _inactiveHoverStyle() {
    if (this._hoverActiveState) {
      this._hoverActiveState = false;

      const rawCSSText = this.getAttribute('style') || '';
      const cssText = rawCSSText.replace(/(\/\*h\*\/).*\1/, '');
      rawCSSText !== cssText && this.setAttribute('style', cssText);
    }
  }

  _active(evt) {
    if (this.hoverStopPropagation) {
      evt.stopPropagation();
    }

    const delay = this.hoverStartTime;
    clearTimeout(this.hoverActiveTimer);

    this.hoverActiveTimer = setTimeout(() => {
      this._activeHoverStyle();
    }, delay);
  }

  _inactive(evt) {
    if (this.hoverStopPropagation) {
      evt.stopPropagation();
    }

    const delay = this.hoverStayTime;
    clearTimeout(this.hoverActiveTimer);
    clearTimeout(this.hoverInactiveTimer);

    this.hoverInactiveTimer = setTimeout(() => {
      this._inactiveHoverStyle();
    }, delay);
  }

  _disableScroll(evt) {
    evt.preventDefault();
  }

  ready() {
    super.ready();
    this._listen();
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
