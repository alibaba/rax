import { PolymerElement, html } from '@polymer/polymer';

export default class Progress extends PolymerElement {
  static get is() {
    return 'a-progress';
  }

  static get properties() {
    return {
      percent: {
        type: Number,
        value: 0
      },
      showInfo: {
        type: Boolean,
        value: false
      },
      strokeWidth: {
        type: Number,
        value: 6
      },
      backgroundColor: {
        type: String,
        value: '#ccc'
      },
      activeColor: {
        type: String,
      },
      active: {
        type: Boolean,
        value: false
      },
      activeMode: {
        type: Boolean,
        value: 'backwards'
      },
      containerStyle: {
        type: String,
        computed: 'computeContainerStyle(strokeWidth, backgroundColor)'
      },
      activeStyle: {
        type: String,
        computed: 'computeActiveStyle(realPercent, strokeWidth, activeColor)'
      },
      infoStyle: {
        type: String,
        computed: 'computeInfoStyle(showInfo)'
      },
      realPercent: {
        type: Number,
        computed: 'computePercent(active, percent)'
      }
    };
  }

  constructor() {
    super();
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.active) {
      setTimeout(() => {
        this.realPercent = this.percent;
      }, 30);
    } else {
      this.realPercent = this.percent;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  computeContainerStyle(strokeWidth, backgroundColor) {
    return `
        border-radius: ${strokeWidth / 2}px;
        background-color: ${backgroundColor};
      `;
  }

  computeActiveStyle(realPercent, strokeWidth, activeColor) {
    return `
        width: ${realPercent}%;
        height: ${strokeWidth}px;
        border-radius: ${strokeWidth / 2}px;
        background-color: ${activeColor};
      `;
  }

  computeInfoStyle(showInfo) {
    return `display: ${showInfo ? 'block' : 'none'}`;
  }

  computClass() {
    return this.active ? 'active-bar' : '';
  }

  computePercent(active, percent) {
    if (!active) {
      return percent;
    } else {
      return 0;
    }
  }

  static get template() {
    return html`
    <style>
      :host {
        display: flex;
        display: -webkit-flex;
        flex-flow: row nowrap;
        -webkit-flex-flow: row nowrap;
        align-items: center;
        -webkit-align-items: center;
      }

      .container {
        display: flex;
        display: -webkit-flex;
        flex: 1;
        -webkit-flex: 1;
        flex-flow: row nowrap;
        -webkit-flex-flow: row nowrap;
        background-color: #ccc;
        overflow: hidden;
      }

      .active {
        flex: none;
        -webkit-flex: none;
        height: 6px;
        background-color: #ff5500;
        background-color: var(--color-primary, #ff5500);
      }

      .value {
        font-size: 12px;
        color: #999;
        flex: none;
        -webkit-flex: none;
        margin-left: 5px;
      }

      .active-bar {
        transition: all .3s linear 0s;
        -webkit-transition: all .3s linear 0s;
      }
    </style>
    <div id="container" class="container" style$="[[containerStyle]]">
      <div id="active" class$="active {{computClass()}}" style$="[[activeStyle]]"></div>
    </div>
    <div class="value" style$="[[infoStyle]]">[[percent]]%</div>
    `;
  }
}

customElements.define(Progress.is, Progress);
