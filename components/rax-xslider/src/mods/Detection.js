'use strict';
import {isWeex} from 'universal-env';
import assign from 'object-assign';
import Binding from 'weex-bindingx';

let Detection = {};
Detection.isEnableSlider = true;

if (isWeex) {
  const deviceInfo = typeof WXEnvironment !== 'undefined' ? WXEnvironment : {}; // eslint-disable-line
  Detection = assign(Detection, {
    Android: deviceInfo.platform === 'android',
    iOS: deviceInfo.platform === 'iOS',
    appVersion: deviceInfo.appVersion
  });
} else {
  const ua = window.navigator.userAgent;
  Detection = assign(Detection, {
    Android: /Android/ig.test(ua),
    iOS: /iPhone|iPad|iPod/ig.test(ua)
  });
}

if (isWeex) {
  Detection.isEnableSlider = Binding && Binding.isSupportBinding;
  Detection.isEnableSliderAndroid = Detection.isEnableSlider && Detection.Android;
}

export default Detection;
