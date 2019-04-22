/* global frameworkVersion */
const navigator = window.navigator;
const IOS_VER_REG = /iPhone OS (\d+(_\d+)+)/i;
const ANDROID_REG = /Android (\d+(\.\d+)+); ([^)]+)/i;
const UNKNOWN = 'unknown';

const { platform, brand, system } = (() => {
  if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
    const versionMatch = IOS_VER_REG.exec(navigator.userAgent);
    return {
      platform: 'iOS',
      brand: 'Apple',
      system: versionMatch ? versionMatch[1].replace(/_/g, '.') : UNKNOWN,
    };
  } else if (/Android/i.test(navigator.userAgent)) {
    const match = ANDROID_REG.exec(navigator.userAgent);
    return {
      platform: 'Android',
      brand: match ? match[3] : UNKNOWN,
      system: match ? match[1] : UNKNOWN,
    };
  } else if (/(Mac|Win|Linux)/i.test(navigator.userAgent)) {
    return {
      platform: 'PC',
      brand: UNKNOWN,
      system: UNKNOWN,
    };
  }
})();

/**
 * Expose MiniApp environment for getSystemInfo.
 */
export function getMiniAppEnv() {
  return {
    SDKVersion: frameworkVersion,
    app: 'Browser',
    brand,
    platform,
    system,

    language: navigator.language,
    pixelRatio: global.devicePixelRatio,
    screenWidth: global.screen.width,
    screenHeight: global.screen.height,
    userAgent: navigator.userAgent,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    currentBattery: null, // Can not support.
  };
}
