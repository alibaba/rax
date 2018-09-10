import NativeVideo from './nativeVideo';
import WebVideo from './webVideo';

const isWeb = !/AliApp/.test(navigator.userAgent);
const isDowngrade = false;
if (isWeb || isDowngrade) {
  customElements.define(WebVideo.is, WebVideo);
} else {
  customElements.define(NativeVideo.is, NativeVideo);
}
