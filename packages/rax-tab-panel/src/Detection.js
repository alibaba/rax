'use strict';
import {isWeex, isWeb} from 'universal-env';
import assign from 'object-assign';
import Binding from 'weex-bindingx';

let Detection = {};
Detection.isWeex = isWeex;
Detection.isWeb = isWeb;
Detection.isEnableSlider = true;

if (isWeex) {
  const deviceInfo = typeof WXEnvironment !== 'undefined' ? WXEnvironment : {}; // eslint-disable-line
  Detection = assign(Detection, {
    Android: deviceInfo.platform === 'android',
    iOS: deviceInfo.platform === 'iOS',
    isAliApp: true,
    appVersion: deviceInfo.appVersion,
    weexVersion: deviceInfo.weexVersion,
    osVersion: deviceInfo.osVersion
  });
} else {
  const ua = window.navigator.userAgent;
  Detection = assign(Detection, {
    Android: /Android/ig.test(ua),
    iOS: /iPhone|iPad|iPod/ig.test(ua),
    isAliApp: /AliApp\([A-Z-_]+\/[0-9.]+\)/ig.test(ua)
  });
  Detection.getVersion = () => {
    const matched = ua.match(/AliApp\(([A-Z\-]+)\/([\d\.]+)\)/i);
    if (matched) {
      const appname = matched[1];
      if (appname === 'TB' || appname === 'TM') {
        return matched[2];
      }
    }
    return '';
  };
  Detection.appVersion = Detection.getVersion();
}

Detection.checkVersion = (params) => {
  if (!Detection.appVersion) {
    return false;
  }
  let version = Detection.iOS ? params.iosVer : params.andVer;
  let checkVer = params.isCheckOS ? Detection.osVersion : Detection.appVersion;
  if (checkVer === version) {
    return true;
  }
  if (!version) {
    version = '0.0';
  }
  checkVer = checkVer.split('.');
  version = version.split('.');
  for (let i = 0; i < checkVer.length; i++) {
    let len = i + 1;
    for (let j = 0; j < len; j++) {
      let ver1 = +checkVer[j];
      let ver2 = version[j];
      if (ver1 > ver2) {
        return true;
      } else if (ver1 < ver2) {
        return false;
      } else if (ver1 === ver2 && checkVer.length === version.length && j === 3) {
        return true;
      }
    }
  }
  return false;
};

if (isWeex) {
  // judge is support bindingx
  Detection.isEnableSlider = Binding && Binding.isSupportBinding;

  Detection.isEnableSliderIOS = Detection.isEnableSlider && Detection.iOS;

  Detection.isEnableSliderAndroid = Detection.isEnableSlider && Detection.Android;
}

export default Detection;
