import './picker-view-column';
import { PolymerElement, html } from '@polymer/polymer';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';

export default class PickerView extends PolymerElement {
  static get is() {
    return 'a-picker-view';
  }

  static get properties() {
    return {
      value: {
        type: Array,
        value: [],
        observer: '_valueChanged'
      },
      indicatorStyle: {
        type: String,
        value: '',
      }
    };
  }

  static get observers() {
    return ['_pickerViewColumnStyleChange(indicatorStyle, maskStyle)'];
  }

  ready() {
    super.ready();

    this._initialValue = this.value;
  }

  connectedCallback() {
    super.connectedCallback();
    /**
     * However, the observer func is executed earlier than ready,
     * dom hasn't been rendered，
     * so I execute the first _selectedIndexChange func in ready，
     * to ensure that the dom has been rendered
     */
    this._valueChanged(this.value, null);
    this.addEventListener('_columnChange', this._handleChange);
    window.addEventListener('_formReset', this._handleReset, true);

  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener('_columnChange', this._handleChange);
    window.removeEventListener('_formReset', this._handleReset, true);
  }

  _handleChange = (evt) => {
    let { target, detail } = evt;
    if (target.tagName.toLowerCase() !== 'a-picker-view-column') return;
    let columns = this.querySelectorAll('a-picker-view-column');
    let i = Array.prototype.slice.call(columns).indexOf(target);
    if (i < 0) return;
    this.set(`value.${i}`, detail.selectedIndex);
    this._dispatchEvent('change');
  }

  _pickerViewColumnStyleChange(indicatorStyle) {
    afterNextRender(this, () => {
      let columns = [...this.querySelectorAll('a-picker-view-column')];
      columns.forEach(column => {
        column._updateStyleFromParent(indicatorStyle);
      });
    });
  }

  _valueChanged(value, oldVal) {
    if (oldVal !== undefined) {
      let columns = this.children;
      for (let i = 0; i < columns.length; i++) {
        columns[i].setAttribute('selected-index', value[i] || 0);
      }
    }
  }

  _dispatchEvent(name) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail: { value: this.value },
        bubbles: true,
        cancelable: false,
      })
    );
  }

  _handleReset = (evt) => {
    let parentElement = this.parentElement;

    while (parentElement) {
      if (parentElement === evt.target) {
        this.value = this._initialValue;
        break;
      }
      parentElement = parentElement.parentElement;
    }
  };

  static get template() {
    return html`
      <slot></slot>
      <style>
        :host {
          display: -webkit-flex;
          display: flex;
          -webkit-flex-flow: row nowrap;
          flex-flow: row nowrap;
        }
      </style>
    `;
  }
}

customElements.define(PickerView.is, PickerView);
