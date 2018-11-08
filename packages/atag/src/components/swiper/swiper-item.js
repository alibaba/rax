import { PolymerElement, html } from '@polymer/polymer';

export default class SwiperItem extends PolymerElement {
  static get is() {
    return 'a-swiper-item';
  }
  constructor() {
    super();
  }

  static get template() {
    return html`
    <style>
      :host {
        overflow: hidden;
        flex-shrink: 0;
        -webkit-flex-shrink: 0;
        width: 100%;
        height: 100%;
      }
    </style>
    <slot></slot>
    `;
  }
}
customElements.define(SwiperItem.is, SwiperItem);
