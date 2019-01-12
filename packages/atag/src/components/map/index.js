import shouldDowngradeNativeView from '../../shared/shouldDowngradeNativeView';
import NativeMap from './map.native';
import WebMap from './map.web';

const isWeb = !/AliApp/.test(navigator.userAgent);
const isDowngrade = shouldDowngradeNativeView();
if (isWeb || isDowngrade) {
  customElements.define(WebMap.is, WebMap);
} else {
  customElements.define(NativeMap.is, NativeMap);
}
