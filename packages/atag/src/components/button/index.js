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


  connectedCallback() {
    super.connectedCallback();
    // Check form-type and listen click event, then dispatch event
    this.addEventListener('click', this._handleClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleClick);
  }

  _handleClick = () => {
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
          border-radius: 40px;
          border-radius: var(--button-border-radius, 40px);
          cursor: pointer;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          color: #ff5500;
          color: var(--button-default-text-color, #ff5500);
          background: linear-gradient(to right, #fff, #fff);
          background: linear-gradient(to right, var(--button-default-background-color-from, #fff), var(--button-default-background-color-to, #fff));
        }

        /* primary */
        :host([type="primary"]) {
          color: white;
          color: var(--button-warn-text-color, white);
          background: linear-gradient(to right, #ff8800, #ff5500);
          background: linear-gradient(to right, var(--button-primary-background-color-from, #ff8800), var(--button-primary-background-color-to, #ff5500));
        }

        /* warn */
        :host([type="warn"]) {
          color: white;
          color: var(--button-warn-text-color, white);
          background: linear-gradient(to right, #fbca2f, #fb9025);
          background: linear-gradient(to right, var(--button-warn-background-color-from, #fbca2f), var(--button-warn-background-color-to, #fb9025));
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
          color: #999999;
          border: 1px #999999 solid;
        }

        :host([plain][type="primary"]) {
          background: transparent;
          color: #ff5500;
          color: var(--color-primary, #ff5500);
          border: 1px #ff5500 solid;
          border: 1px var(--color-primary, #ff5500) solid;
        }

        :host([plain][type="warn"]) {
          background: transparent;
          color: #fb9025;
          color: var(--color-warn, #fb9025);
          border: 1px #fb9025 solid;
          border: 1px var(--color-warn, #fb9025) solid;
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
          background-color: #ff5500;
          background-color: var(--color-primary, #ff5500);
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
          background-color: #ff5500;
          background-color: var(--color-primary, #ff5500);
        }

        :host([type="warn"][plain]) .loading-circle .loading-child-before {
          background-color: #fb9025;
          background-color: var(--color-warn, #fb9025);
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
