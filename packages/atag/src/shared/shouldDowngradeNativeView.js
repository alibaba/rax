const embedViewManager =
  typeof __embed_view_manager__ !== "undefined" ? __embed_view_manager__ : null; // eslint-disable-line

/**
 * Check whether native view is supported
 */
export default function shouldDowngradeNativeView() {
  return embedViewManager ? embedViewManager.shouldDowngrade() : false;
}
