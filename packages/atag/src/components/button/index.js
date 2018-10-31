import { PolymerElement, html } from '@polymer/polymer';

export default class Button extends PolymerElement {
  static get is() {
    return 'a-button';
  }

  /**
   * Reflect button properties to attribute
   * for applying CSS effect
   */
  static get properties() {
    return {
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      plain: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },
      formType: {
        type: String,
        value: '',
      },
    };
  }

  ready() {
    super.ready();
    // Check form-type and listen click event, then dispatch event
    if (this.formType) {
      this.addEventListener('click', this._dispatchEvent);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.formType) {
      this.removeEventListener('click', this._dispatchEvent);
    }
  }

  _dispatchEvent() {
    let evt;
    switch (this.formType) {
      case 'submit':
        evt = new CustomEvent('_buttonSubmit', {
          bubbles: true,
          composed: true,
        });
        break;
      case 'reset':
        evt = new CustomEvent('_buttonReset', {
          bubbles: true,
          composed: true,
        });
        break;
    }
    if (evt) {
      this.dispatchEvent(evt);
    }
  }

  static get template() {
    return html`
      <style>
        /* default */
        :host {
          display: block;
          position: relative;
          margin: 0 auto;
          padding: 0 10px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          text-align: center;
          box-sizing: border-box;
          overflow: hidden;
          text-decoration: none;
          border-radius: var(--btn-border-1);
          cursor: pointer;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          color: var(--color-primary-2);
          background: white;
        }

        :host:after {
          content: ' ';
          width: 200%;
          height: 200%;
          position: absolute;
          top: 0;
          left: 0;
          transform: scale(0.5);
          transform-origin: 0 0;
          box-sizing: border-box;
          border-radius: var(--btn-border-2);
        }

        /* primary */
        :host([type="primary"]) {
          color: white;
          background: linear-gradient(to right, var(--color-primary-3), var(--color-primary-2));
        }

        /* warn */
        :host([type="warn"]) {
          color: white;
          background: linear-gradient(to right, var(--color-warning-3), var(--color-warning-2));
        }

        /* mini */
        :host([size="mini"]) {
          display: inline-block;
          min-width: 118px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
        }

        /* plain */

        :host([plain]) {
          background: transparent;
          color: var(--color-text-2);
          border: 1px var(--color-line-2) solid;
        }

        :host([plain][type="primary"]) {
          background: transparent;
          color: var(--color-primary-2);
          border: 1px var(--color-primary-2) solid;
        }

        :host([plain][type="warn"]) {
          background: transparent;
          color: var(--color-warning-2);
          border: 1px var(--color-warning-2) solid;
        }

        /* disabled */
        :host([disabled]) {
          pointer-events: none;
          opacity: 0.5;
        }


        :host([loading]) .loading-circle {
          display: inline-block;
        }

        .loading-circle {
          display: none;
          width: 20px;
          height: 20px;
          position: relative;
          margin-right: 7.5px;
          vertical-align: middle;
        }

        .loading-child {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
        }

        .loading-child-before {
          display: block;
          margin: 0 auto;
          width: 4px;
          height: 4px;
          background-color: var(--color-primary-2);
          border-radius: 4px;
          -webkit-animation: loading-circle-bounce 1.2s infinite ease-in-out both;
                  animation: loading-circle-bounce 1.2s infinite ease-in-out both;
        }

        :host([type="primary"]) .loading-circle .loading-child-before,
        :host([type="warn"]) .loading-circle .loading-child-before {
          background-color: white;
        }

        :host([plain]) .loading-circle .loading-child-before {
          background-color: #999999;
        }

        :host([type="primary"][plain]) .loading-circle .loading-child-before {
          background-color: var(--color-primary-2);
        }

        :host([type="warn"][plain]) .loading-circle .loading-child-before {
          background-color: #fb9025;
        }

        .loading-circle .loading-circle2 {
          -webkit-transform: rotate(45deg);
                  transform: rotate(45deg); }
        .loading-circle .loading-circle3 {
          -webkit-transform: rotate(90deg);
                  transform: rotate(90deg); }
        .loading-circle .loading-circle4 {
          -webkit-transform: rotate(135deg);
                  transform: rotate(135deg); }
        .loading-circle .loading-circle5 {
          -webkit-transform: rotate(180deg);
                  transform: rotate(180deg); }
        .loading-circle .loading-circle6 {
          -webkit-transform: rotate(225deg);
                  transform: rotate(225deg); }
        .loading-circle .loading-circle7 {
          -webkit-transform: rotate(270deg);
                  transform: rotate(270deg); }
        .loading-circle .loading-circle8 {
          -webkit-transform: rotate(315deg);
                  transform: rotate(315deg); }

        .loading-circle .loading-circle2-before {
          -webkit-animation-delay: -0.7s;
                  animation-delay: -0.7s; }
        .loading-circle .loading-circle3-before {
          -webkit-animation-delay: -0.6s;
                  animation-delay: -0.6s; }
        .loading-circle .loading-circle4-before {
          -webkit-animation-delay: -0.5s;
                  animation-delay: -0.5s; }
        .loading-circle .loading-circle5-before {
          -webkit-animation-delay: -0.4s;
                  animation-delay: -0.4s; }
        .loading-circle .loading-circle6-before {
          -webkit-animation-delay: -0.3s;
                  animation-delay: -0.3s; }
        .loading-circle .loading-circle7-before {
          -webkit-animation-delay: -0.2s;
                  animation-delay: -0.2s; }
        .loading-circle .loading-circle8-before {
          -webkit-animation-delay: -0.1s;
                  animation-delay: -0.1s; }

        @-webkit-keyframes loading-circle-bounce {
          0%, 80%, 100% {
            -webkit-transform: scale(0.6);
          } 40% {
            -webkit-transform: scale(1.2);
          }
        }

        @keyframes loading-circle-bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
          } 40% {
            transform: scale(1.2);
          }
        }
      </style>
      <div class="loading-circle">
        <div class="loading-circle1 loading-child">
          <div class="loading-circle1-before loading-child-before"></div>
        </div>
        <div class="loading-circle2 loading-child">
          <div class="loading-circle2-before loading-child-before"></div>
        </div>
        <div class="loading-circle3 loading-child">
          <div class="loading-circle3-before loading-child-before"></div>
        </div>
        <div class="loading-circle4 loading-child">
          <div class="loading-circle4-before loading-child-before"></div>
        </div>
        <div class="loading-circle5 loading-child">
          <div class="loading-circle5-before loading-child-before"></div>
        </div>
        <div class="loading-circle6 loading-child">
          <div class="loading-circle6-before loading-child-before"></div>
        </div>
        <div class="loading-circle7 loading-child">
          <div class="loading-circle7-before loading-child-before"></div>
        </div>
        <div class="loading-circle8 loading-child">
          <div class="loading-circle8-before loading-child-before"></div>
        </div>
      </div>
      <slot></slot>
    `;
  }
}

customElements.define(Button.is, Button);
