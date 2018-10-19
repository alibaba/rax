import { PolymerElement, html } from '@polymer/polymer';

const ua = navigator.userAgent;
const isAndroid = /android/i.test(ua);
const isIOS = /(iPhone|iPad|iPod)/.test(ua);
let nativeInstanceCount = 0;

export default class NativeMap extends PolymerElement {

  static get is() {
    return 'a-map';
  }

  static get properties() {
    return {};
  }

  constructor() {
    super();
    this.uniqueId = String(++nativeInstanceCount);
  }

  ready() {
    super.ready();

    // document.addEventListener('WVEmbed.Ready', this._nativeReady);
    /**
     * Assign default style
     */
    this.style.display = 'block';

    this._createLightDOM();
  }

  _createLightDOM() {
    const container = document.createElement('object');
    container.setAttribute('type', 'application/view');
    container.className = 'atag-native-map';

  }
}
