import { PolymerElement, html } from '@polymer/polymer';
import * as Gestures from '@polymer/polymer/lib/utils/gestures';

export default class Slider extends PolymerElement {
  static get is() {
    return 'a-slider';
  }

  static get properties() {
    return {
      min: {
        type: Number,
        value: 0
      },
      max: {
        type: Number,
        value: 100
      },
      step: {
        type: Number,
        value: 1
      },
      value: {
        type: Number,
        reflectToAttribute: true,
        value: 0
      },
      disabled: {
        type: Boolean,
        value: false
      },
      showValue: {
        type: Boolean,
        value: false
      },
      activeColor: {
        type: String,
        value: '#ff5000'
      },
      handleSize: {
        type: Number,
        value: 22
      },
      trackSize: {
        type: Number,
        value: 4
      },
      backgroundColor: {
        type: String,
        value: '#ddd'
      },
      handleColor: {
        type: String,
        value: '#fff'
      },
      _activeStyle: {
        type: String,
        computed: '_computeActiveStyle(value, min, max, activeColor)'
      },
      _valueStyle: {
        type: String,
        computed: '_computeValueStyle(showValue)'
      },
      _handleStyle: {
        type: String,
        computed: '_computeHandleStyle(handleSize, handleColor)'
      },
      _sliderStyle: {
        type: String,
        computed: '_computeSliderStyle(trackSize, backgroundColor)'
      }
    };
  }

  sliderWidth = 0;
  lastValue = 0;

  constructor() {
    super();
  }

  ready() {
    super.ready();
    this.formInitialValue = this.value;
  }

  connectedCallback() {
    super.connectedCallback();

    Gestures.addListener(this.$.handle, 'track', this._handleTrack);

    this.sliderWidth = this.$.slider.offsetWidth;
    window.addEventListener('_formReset', this.handleReset, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    Gestures.removeListener(this.$.handle, 'track', this._handleTrack);
    window.removeEventListener('_formReset', this.handleReset, true);
  }

  _computeActiveStyle(value, min, max, activeColor) {
    let ratio = (value - min) / (max - min);
    let percent = Math.max(Math.min(ratio, 1), 0) * 100;
    return `width: ${percent}%; background-color: ${activeColor};`;
  }

  _computeHandleStyle(handleSize, handleColor) {
    return `width: ${handleSize}px; height: ${handleSize}px; background-color: ${handleColor}`;
  }

  _computeValueStyle(showValue) {
    return showValue ? `` : `display: none;`;
  }

  _computeSliderStyle(trackSize, backgroundColor) {
    return `height: ${trackSize}px; background-color: ${backgroundColor}`;
  }

  _handleTrack = ({detail}) => {

    if (this.disabled) return;

    if (detail.state === 'start') {
      this.lastValue = this.value;
    } else if (detail.state === 'track') {
      let dx = detail.dx;
      let offsetValue = dx / this.sliderWidth * (this.max - this.min);
      let newValue = Math.round((this.lastValue + offsetValue) / this.step) * this.step;
      newValue = Math.max(newValue, this.min);
      newValue = Math.min(newValue, this.max);
      this.value = newValue;

      this.dispatchEvent(this._createEvent('input'));
      this.dispatchEvent(this._createEvent('changing')); // Match micro-msg api  

    } else if (detail.state === 'end') {
      this.dispatchEvent(this._createEvent('change'));
    }
  };

  _createEvent(type) {
    return new CustomEvent(type, {
      detail: {
        value: this.value
      },
      bubbles: true,
      cancelable: false
    });
  }

  handleReset = () => {
    this.value = this.formInitialValue;
  }

  static get template() {
    return html`
      <style>
        :host {
          display: -webkit-flex;
          display: flex;
          -webkit-flex-flow: row nowrap;
          flex-flow: row nowrap;
          -webkit-align-items: center;
          align-items: center;
        }
  
        #slider {
          display: flex;
          display: -webkit-flex;
          -webkit-flex: 1;
          flex: 1;
          -webkit-flex-flow: row nowrap;
          flex-flow: row nowrap;
          -webkit-align-items: center;
          align-items: center;
          height: 4px;
          margin: 7.5px 10px;
          border-radius: 2px;
          background-color: #ccc;
        }

        #active {
          flex: none;
          -webkit-flex: none;
          height: 4px;
          border-radius: 2px;
          overflow: hidden;
        }

        #handle {
          flex: none;
          -webkit-flex: none;
          margin: 0 -9px 0 -9px;
          border-radius: 50%;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, .15);
        }
  
        #value {
          font-size: 14px;
          color: #999;
          -webkit-flex: none;
          flex: none;
          margin-left: 5px;
        }
      </style>
      <div id="slider" style$="[[_sliderStyle]]">
        <div id="active" style$="[[_activeStyle]]"></div>
        <div id="handle" style$="[[_handleStyle]]"></div>
      </div>
      <div id="value" style$=[[_valueStyle]]>[[value]]</div>
    `;
  }
}

customElements.define(Slider.is, Slider);
