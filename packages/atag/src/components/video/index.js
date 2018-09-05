import NativeVideo from './nativeVideo';
import WebVideo from './webVideo';

const isWeb = !/AliApp/.test(navigator.userAgent);
const isDowngrade = false; // todo: 门柳 提供降级特征
if (isWeb || isDowngrade) {
  customElements.define(WebVideo.is, WebVideo);
} else {
  customElements.define(NativeVideo.is, NativeVideo);
}
