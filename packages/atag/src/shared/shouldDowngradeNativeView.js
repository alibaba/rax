const embedViewManager =
  typeof __embed_view_manager__ !== "undefined" ? __embed_view_manager__ : null; // eslint-disable-line

/**
 * Check whether native view is supported
 * Android: inject a boolean flag at __sfc__.isDowngrade
 * iOS: depend on embedViewManager.shouldDowngrade()
 */
export default function shouldDowngradeNativeView() {
  if (typeof __sfc__ !== 'undefined' && __sfc__.isDowngrade) { // eslint-disable-line
    return __sfc__.isDowngrade; // eslint-disable-line
  } else {
    return embedViewManager ? embedViewManager.shouldDowngrade() : false;
  }
}
