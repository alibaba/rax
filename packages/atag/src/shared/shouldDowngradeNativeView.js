/* global __embed_view_manager__ */
import getEnvironmentObject from './getEnvironmentObject';

const IOS8_REG = /iPhone OS 8/;
const isIOS = /iPhone|iPod|iPad/i.test(navigator.userAgent);
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
     * iOS8 not support native view render.
     */
    const isIOS8 = IOS8_REG.test(navigator.userAgent);
    if (isIOS8) {
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

