import { PolymerElement, html } from '@polymer/polymer';

export default class WebView extends PolymerElement {
  static get is() {
    return 'a-web-view';
  }

  static get properties() {
    return {
      src: {
        type: String,
        notify: true
      }
    };
  }

  static get template() {
    return html`
    <style>
      :host {
        display: block;
        overflow: auto;
      }

      :host,
      #iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    </style>
    <iframe id="iframe" src="{{src}}"></iframe>
    `;
  }
}

customElements.define(WebView.is, WebView);
