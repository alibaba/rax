/* global __embed_view_manager__ */
import getEnvironmentObject from './getEnvironmentObject';

const IOS_REG = /iPhone|iPod|iPad/i;
const IOS_VER_REG = /iPhone OS (\d+)/;
const isIOS = IOS_REG.test(navigator.userAgent);
const embedViewManager =
  typeof __embed_view_manager__ !== 'undefined' ? __embed_view_manager__ : null;

/**
 * Check whether native view is supported
 * iOS: depend on embedViewManager.shouldDowngrade()
 * Android: inject a boolean flag at __sfc__.isDowngrade
 */
export default function shouldDowngradeNativeView() {
  if (isIOS) {
    /**
     * iOS version <= 8 not support native view render.
     */
    const iOSRegExpMatch = IOS_VER_REG.exec(navigator.userAgent);
    if (iOSRegExpMatch && parseInt(iOSRegExpMatch[1]) <= 8) {
      return true;
    } else {
      return embedViewManager ? embedViewManager.shouldDowngrade() : false;
    }
  } else {
    const env = getEnvironmentObject();
    // `isDowngrade` may be string or boolean, due to version of Apps.
    return env && String(env.isDowngrade) === 'true';
  }
}

