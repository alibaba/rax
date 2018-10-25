import { PolymerElement, html } from '@polymer/polymer';
import * as Gestures from '@polymer/polymer/lib/utils/gestures';

export default class Slider extends PolymerElement {
  static get is() {
    return 'a-slider';
  }

  static get properties() {
    return {
      value: {
        type: Number,
        value: 0,
      },
      min: {
        type: Number,
        value: 0,
      },
      max: {
        type: Number,
        value: 100,
      },
      step: {
        type: Number,
        value: 1,
      },
      disabled: {
        type: Boolean,
        value: false,
      },
      showValue: {
        type: Boolean,
        value: false,
      },
      activeColor: {
        type: String,
        value: '#ff5000',
      },
      handleSize: {
        type: Number,
        value: 22,
      },
      trackSize: {
        type: Number,
        value: 4,
      },
      backgroundColor: {
        type: String,
        value: '#ddd',
      },
      handleColor: {
        type: String,
        value: '#fff',
      },
      _activeStyle: {
        type: String,
        computed: '_computeActiveStyle(value, min, max, activeColor)',
      },
      _valueStyle: {
        type: String,
        computed: '_computeValueStyle(showValue)',
      },
      _handleStyle: {
        type: String,
        computed: '_computeHandleStyle(value, min, max, handleSize, handleColor)',
      },
      _sliderStyle: {
        type: String,
        computed: '_computeSliderStyle(trackSize, backgroundColor)',
      },
    };
  }

  _lastValue = 0;
  _initialValue = 0;

  ready() {
    super.ready();

    if (this.value < this.min || this.value > this.max) {
      this.value = this.min;
    }
    this._initialValue = this.value;
  }

  connectedCallback() {
    super.connectedCallback();

    Gestures.addListener(this.$.handle, 'track', this._handleTrack, true);
    window.addEventListener('_formReset', this.handleReset, true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    Gestures.removeListener(this.$.handle, 'track', this._handleTrack, true);
    window.removeEventListener('_formReset', this.handleReset, true);
  }

  _getCurrentPrecent(value, min, max) {
    let ratio = (value - min) / (max - min);
    return Math.max(Math.min(ratio, 1), 0) * 100;
  }

  _computeActiveStyle(value, min, max, activeColor) {
    let percent = this._getCurrentPrecent(value, min, max);
    return `width: ${percent}%; background-color: ${activeColor};`;
  }

  _computeHandleStyle(value, min, max, handleSize, handleColor) {
    let percent = this._getCurrentPrecent(value, min, max);
    return `left: ${percent}%; width: ${handleSize}px; height: ${handleSize}px; background-color: ${handleColor}`;
  }

  _computeValueStyle(showValue) {
    return showValue ? '' : 'display: none;';
  }

  _computeSliderStyle(trackSize, backgroundColor) {
    return `height: ${trackSize}px; background-color: ${backgroundColor}`;
  }

  _valueChanged(value) {
    return Math.min(Math.max(value, this.min), this.max);
  }

  _handleTrack = (event) => {
    const detail = event.detail;
    if (this.disabled) return;

    event.stopPropagation();

    let getNewValue = (dx) => {
      let sliderWidth = this.$.slider.offsetWidth;
      let offsetValue = dx / sliderWidth * (this.max - this.min);
      let newValue = Math.round((this._lastValue + offsetValue) / this.step) * this.step;
      return this._valueChanged(newValue);
    };

    if (detail.state === 'start') {
      this._lastValue = this.value;
    } else if (detail.state === 'track') {
      let currentValue = getNewValue(detail.dx);
      var precent = this._getCurrentPrecent(currentValue, this.min, this.max);
      this.$.handle.style.left = this.$.active.style.width = `${precent}%`;
      this.$.value.childNodes[0].textContent = currentValue;
      this.dispatchEvent(this._createEvent('changing'), currentValue);
    } else if (detail.state === 'end') {
      this.value = getNewValue(detail.dx);
      this.dispatchEvent(this._createEvent('change'));
    }
  };

  _createEvent(type, value) {
    return new CustomEvent(type, {
      detail: {
        value: value || this.value,
      },
      bubbles: true,
      cancelable: false,
    });
  }

  handleReset = (evt) => {
    let parentElement = this.parentElement;

    while (parentElement) {
      if (parentElement === evt.target) {
        this.value = this._initialValue;
        break;
      }
      parentElement = parentElement.parentElement;
    }
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
          margin: 8px;
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
          border-radius: 2px;
          background-color: #ccc;
          position: relative;
        }

        #active {
          flex: none;
          -webkit-flex: none;
          height: 4px;
          border-radius: 2px;
          overflow: hidden;
        }

        #handle {
          position: absolute;
          border-radius: 50%;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, .15);
          -webkit-transform: translate3d(-50%, 0, 0);
          transform: translate3d(-50%, 0, 0);
        }
  
        #value {
          margin-left: 12px;
          mini-width: 28px;
          font-size: 14px;
          text-align: center;
          color: #999;
          -webkit-flex: none;
          flex: none;
          -webkit-user-select: none;
          user-select: none;
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
