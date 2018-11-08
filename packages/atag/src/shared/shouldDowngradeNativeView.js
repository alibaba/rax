/* global __embed_view_manager__ */
import getEnvironmentObject from './getEnvironmentObject';

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
    return embedViewManager ? embedViewManager.shouldDowngrade() : false;
  } else {
    const env = getEnvironmentObject();
    // `isDowngrade` may be string or boolean, due to version of Apps.
    return env && String(env.isDowngrade) === 'true';
  }
}

