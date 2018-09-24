import shouldDowngradeNativeView from '../../shared/shouldDowngradeNativeView';
import NativeVideo from './video.native';
import WebVideo from './video.web';

const isWeb = !/AliApp/.test(navigator.userAgent);
const isDowngrade = shouldDowngradeNativeView();
if (isWeb || isDowngrade) {
  customElements.define(WebVideo.is, WebVideo);
} else {
  customElements.define(NativeVideo.is, NativeVideo);
}
