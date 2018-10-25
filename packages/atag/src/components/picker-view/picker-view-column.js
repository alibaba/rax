import { PolymerElement, html } from '@polymer/polymer';
import * as Gestures from '@polymer/polymer/lib/utils/gestures';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';

const ITEM_HEIGHT = 40;

export default class PickerViewColumn extends PolymerElement {
  static get is() {
    return 'a-picker-view-column';
  }

  static get properties() {
    return {
      selectedIndex: {
        type: Number,
        reflectToAttribute: true,
        value: 0,
        observer: '_selectedIndexChange'
      },
      indicatorStyle: {
        type: String,
        value: ''
      },
      maskStyle: {
        type: String,
        value: ''
      }
    };
  }

  _lastOffset = 0;
  _initOffset = 0;

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
    Gestures.addListener(this, 'track', this.handleTrack);

    requestAnimationFrame(() => {
      const pickerViewHeigth = this.$.mask.offsetHeight;
      const offset = (pickerViewHeigth - ITEM_HEIGHT) / 2;
      this._setTranslateY(offset);
      this._initOffset = this._lastOffset = offset;

      if (this.selectedIndex > 0) {
        this._setSelected(this.selectedIndex);
      }
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    Gestures.removeListener(this, 'track', this.handleTrack);
  }

  _selectedIndexChange(newIndex, oldIndex) {
    if (oldIndex !== undefined) {
      this._setSelected(newIndex);
    }
  }

  _setSelected(index) {
    let itemCount = this.children.length;
    if (index >= 0 && index <= itemCount) {
      this._lastOffset = this._initOffset - index * ITEM_HEIGHT;
      this._setTranslateY(this._lastOffset);
    }
  }

  handleTrack = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();

    const detail = evt.detail;
    const itemCount = this.children.length;
    const maxOffset = (itemCount - 1) * ITEM_HEIGHT;
    const halfItemHeight = ITEM_HEIGHT / 2;
    let offset = this._lastOffset + detail.dy;

    if (offset >= this._initOffset + halfItemHeight) {
      // -1 for not overflow half height then bounce the scroll animation
      offset = this._initOffset + halfItemHeight - 1;
    } else if (offset <= this._initOffset - maxOffset - halfItemHeight) {
      offset = this._initOffset - maxOffset - halfItemHeight - 1;
    }

    this._setTranslateY(offset);

    if (detail.state === 'end') {
      let offsetOver = (offset - this._initOffset) % ITEM_HEIGHT;
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
      this._updateSelectedItem();
    }
  }

  _setTranslateY(y) {
    this.$.content.style.transform = this.$.content.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
  }

  _setTransition(value) {
    this.$.content.style.transition = this.$.content.style.webkitTransition = value;
  }

  _updateSelectedItem() {
    let selectedIndex = (this._initOffset - this._lastOffset) / ITEM_HEIGHT;

    if (this.selectedIndex !== selectedIndex) {
      this.selectedIndex = selectedIndex;
      this._dispatchEvent('_columnChange', selectedIndex);
    }
  }

  _dispatchEvent(name, selectedIndex) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          selectedIndex
        },
        bubbles: true,
        cancelable: false
      })
    );
  }

  static get template() {
    return html`
      <div id="mask" style$="{{maskStyle}}">
        <div id="indicator" style$="{{indicatorStyle}}"></div>
      </div>
      <div id="content">
        <slot></slot>
      </div>
      <style>
        :host {
          -webkit-flex: 1;
          flex: 1;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
  
        #mask {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: -webkit-flex;
          display: flex;
          -webkit-flex-flow: column nowrap;
          flex-flow: column nowrap;
          -webkit-align-items: center;
          align-items: center;
          -webkit-justify-content: center;
          justify-content: center;
          background-image:
            linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)),
            linear-gradient(to top, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
          background-position: top, bottom;
          background-repeat: no-repeat;
          background-size: 100% 45%;
        }
  
        #indicator {
          box-sizing: border-box;
          width: 100%;
          height: 40px;
          border-top: 1px solid #ddd;
          border-bottom: 1px solid #ddd;
        }

        #content {
          -webkit-transition: all 300ms ease;
          transition: all 300ms ease;
        }

        #content ::slotted(a-view) {
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          color: #333;
        }
      </style>
    `;
  }
}

customElements.define(PickerViewColumn.is, PickerViewColumn);
