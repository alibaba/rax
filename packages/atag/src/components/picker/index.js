import '@polymer/polymer/lib/elements/dom-repeat.js';
import { PolymerElement, html } from '@polymer/polymer';
import throttle from '../../shared/throttle';
import afterNextRender from '../../shared/afterNextRender';
import easeInOutCubic from '../../shared/easeInOutCubic';
import * as Gestures from '@polymer/polymer/lib/utils/gestures';

const INIT_OFFSET = 120;
const ITEM_HEIGHT = 30;

export default class Picker extends PolymerElement {
  static get is() {
    return 'a-picker';
  }

  static get properties() {
    return {
      range: {
        type: Array,
        notify: true,
        value: []
      },
      rangeKey: {
        type: String,
        notify: true,
        value: ''
      },
      value: {
        type: Number,
        notify: true,
        value: 0,
        observer: '_selectedIndexChange'
      },
      disabled: {
        type: Boolean,
        notify: true,
        value: false
      },
      _rangeItems: {
        type: Array,
        notify: true,
        computed: '_computedRangeItems(range, rangeKey)'
      },
    };
  }

  _initOffset = INIT_OFFSET;
  _lastOffset = INIT_OFFSET;

  _computedRangeItems(range, rangeKey) {
    if (typeof range[0] === 'object') {
      return range.map(item => item[rangeKey]);
    } else {
      return range;
    }
  }

  ready() {
    super.ready();
    this._initialValue = this.value;
  }

  connectedCallback() {
    super.connectedCallback();

    window.addEventListener('_formReset', this._handleReset, true);
    Gestures.addListener(this.$.body, 'track', this._handleTrack);
    this.$.slot.addEventListener('click', this._handleShow);

    this.$.mask.addEventListener('click', this._handleHide);
    this.$.cancel.addEventListener('click', this._handleHide);
    this.$.confirm.addEventListener('click', this.confirm);

    if (this.value > 0) {
      this._setSelected(this.value);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    window.removeEventListener('_formReset', this._handleReset, true);
    Gestures.removeListener(this.$.body, 'track', this._handleTrack);
    this.$.slot.removeEventListener('click', this._handleShow);

    this.$.mask.removeEventListener('click', this._handleHide);
    this.$.cancel.removeEventListener('click', this._handleHide);
    this.$.confirm.removeEventListener('click', this._handleConfirm);
  }

  _selectedIndexChange(newIndex, oldIndex) {
    if (oldIndex !== undefined) {
      this._setSelected(newIndex);
    }
  }

  _setSelected(index) {
    let itemCount = this.range.length;
    if (index >= 0 && index <= itemCount) {
      this._lastOffset = this._initOffset - index * ITEM_HEIGHT;
      this._setTranslateY(this._lastOffset);
    }
  }

  _handleTrack = ({detail}) => {
    const itemCount = this.range.length;
    const maxOffset = (itemCount - 1) * ITEM_HEIGHT;
    const halfItemHeight = ITEM_HEIGHT / 2;
    let offset = this._lastOffset + detail.dy;

    if (offset >= INIT_OFFSET + halfItemHeight) {
      // -1 for not overflow half height then bounce the scroll animation
      offset = INIT_OFFSET + halfItemHeight - 1;
    } else if (offset <= INIT_OFFSET - maxOffset - halfItemHeight) {
      offset = INIT_OFFSET - maxOffset - halfItemHeight - 1;
    }

    this._setTranslateY(offset);

    if (detail.state === 'end') {
      let offsetOver = (offset - INIT_OFFSET) % ITEM_HEIGHT;
      let autoOffset = 0;
      if (offsetOver !== 0) {
        if (offsetOver > halfItemHeight) {
          autoOffset = ITEM_HEIGHT - offsetOver;
        } else {
          autoOffset = -offsetOver;
        }
      }

      offset = offset + autoOffset;
      this._setTranslateY(offset);

      this._lastOffset = offset;
    }
  };

  _setTranslateY(value, duration) {
    const selector = this.$.selector;

    if (duration) {
      selector.style.transitionDuration = selector.style.webkitTransitionDuration = `${duration}ms`;
    }

    selector.style.transform = selector.style.webkitTransform = `translate3d(0, ${value}px, 0)`;
  }

  _handleShow = () => {
    if (!this.disabled) {
      this.$.mask.style.display = 'block';
      this.$.container.style.display = 'block';
    }
  };

  _handleHide = () => {
    this.$.mask.style.display = 'none';
    this.$.container.style.display = 'none';
  };

  _handleConfirm = () => {
    this.value = (INIT_OFFSET - this._lastOffset) / ITEM_HEIGHT;
    const event = new CustomEvent('change', {
      bubbles: false,
      cancelable: true,
      detail: {
        value: this.value
      }
    });
    this.dispatchEvent(event);
    this._handleHide();
  };

  _handleReset = (event) => {
    let parentElement = this.parentElement;

    while (parentElement) {
      if (parentElement === event.target) {
        this.value = this._initialValue;
        break;
      }
      parentElement = parentElement.parentElement;
    }
  };

  static get template() {
    return html`
    <style>
      #mask {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 320px;
        z-index: 9999;
        background-color: rgba(0, 0, 0, 0.7);
      }

      #container {
        position: fixed;
        width: 100%;
        height: 320px;
        left: 0;
        bottom: 0;
        background-color: white;
        z-index: 9999;
      }

      #content {
        width: 100%;
        height: 100%;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-transition: bottom .3s ease-in-out;
        transition: bottom .3s ease-in-out;
      }

      #header {
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: row;
        flex-direction: row;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        width: 100%;
        height: 50px;
        background-color: #F2F2F2;
      }

      #header button {
        font-size: 16px;
        cursor: pointer;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: transparent;
        background: transparent;
        outline: none;
        border: 0;
      }

      #header #cancel {
        margin-left: 16px;
        color: #999999;
      }

      #header #confirm {
        margin-right: 16px;
        color: #ff5500;
        color: var(--color-primary, #ff5500);
      }

      #body {
        position: relative;
        -webkit-flex: 1;
        flex: 1;
        display: -webkit-flex;
        display: flex;
        -webkit-flex-direction: column;
        flex-direction: column;
        -webkit-align-items: center;
        align-items: center;
        overflow-x: hidden;
        overflow-y: hidden;
        height: 100px;
      }

      #selector {
        position: relative;
        left: 0;
        -webkit-transform:  translate3d(0, 120px, 0);
        transform: translate3d(0, 120px, 0);
        -webkit-transition: all 300ms ease;
        transition: all 300ms ease;
      }

      #selector .item {
        font-size: 14px;
        line-height: 30px;
        vertical-align: middle;
        color: #333333;
        text-align: center;
      }

      #selector-mask-top {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 120px;
        border-bottom: 1px solid #DDDDDD;
        background: linear-gradient(to top, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.93));
        box-sizing: border-box;
      }

      #selector-mask-bottom {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 120px;
        border-top: 1px solid #DDDDDD;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.93));
        box-sizing: border-box;
      }
    </style>
    <div id="mask" style="display: none;"></div>
    <div id="container" style="display: none;">
      <div id="content">
        <div id="header">
          <button id="cancel">取消</button>
          <button id="confirm">确定</button>
        </div>
        <div id="body">
          <div id="selector">
            <template is="dom-repeat" items="{{_rangeItems}}">
              <div class="item">{{item}}</div>
            </template>
          </div>
          <div id="selector-mask-top"></div>
          <div id="selector-mask-bottom"></div>
        </div>
      </div>
    </div>
    <slot id="slot"></slot>
    `;
  }
}

customElements.define(Picker.is, Picker);
