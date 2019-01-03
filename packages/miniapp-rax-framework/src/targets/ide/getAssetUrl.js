const ASSET_KEY = 'h5Assets';
/**
 * Get the web asset url.
 * @returns {String} url
 */
export default function getAssetUrl(appConfig) {
  if (!appConfig[ASSET_KEY]) {
    throw new Error('Can not load Web Assets.');
  }

  const url = appConfig[ASSET_KEY];
  return /^https?:\/\//.test(url) ? url : normalizeURL(url);
}

/**
 * Normalize reletive url by location
 */
function normalizeURL(url) {
  let h5AssetsAbsoluteUrl = new URL(location.origin);
  h5AssetsAbsoluteUrl.pathname = url;
  return h5AssetsAbsoluteUrl.toString();
}
