/* global __sfc__, __embed_view_manager__ */
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
    const env = getSFCEnvironmentObject();
    // `isDowngrade` may be string or boolean, due to version of Apps.
    return env && String(env.isDowngrade) === 'true';
  }
}

/**
 * In general, native both iOS and Android will
 * inject env variable by __sfc__ namespace.
 * HACK for Android webview: in some case, android
 * can not inject an object, but can get object by
 * call __sfc__.getRawJSON() to return a JSON of __sfc__.
 */
function getSFCEnvironmentObject() {
  const isEnvExists = typeof __sfc__ !== 'undefined';
  if (!isEnvExists) {
    return null;
  } else if (typeof __sfc__.getRawJSON !== 'undefined') {
    return JSON.parse(__sfc__.getRawJSON());
  } else {
    return __sfc__;
  }
}
