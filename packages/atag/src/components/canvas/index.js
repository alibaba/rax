import { PolymerElement, html } from '@polymer/polymer';

export default class CanvasElement extends PolymerElement {
  static get is() {
    return 'a-canvas';
  }

  static get properties() {
    return {
      /**
       * Width, px, default to 300px.
       */
      width: {
        type: String,
        value: '300'
      },
      /**
       * Height, px, default to 225px.
       */
      height: {
        type: String,
        value: '225'
      },
    };
  }

  getContext(type = '2d') {
    if (type === '2d') {
      return this.context2d || (this.context2d = this.$.canvasEl.getContext('2d'));
    } else {
      return null;
    }
  }

  static get template() {
    return html`<canvas id="canvasEl" width="{{width}}" height="{{height}}"></canvas>`;
  }
}

customElements.define(CanvasElement.is, CanvasElement);
