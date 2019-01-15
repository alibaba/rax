/* global VERSION */

/**
 * Visual and child tags are listed below.
 */
const IGNORED_TAG = [
  'page',
  'swiper-item',
  'picker-view-column',
];
const ATAG_PREFIX = 'a-';
const SCRIPT_LOAD_STATE = {};
const noop = () => {};

/**
 * Should setup an atag.
 * @param tagName {String} Tag name.
 * @return {boolean}
 */
export function shouldSetupAtag(tagName) {
  if (IGNORED_TAG.indexOf(tagName)) {
    return false;
  } else {
    return customElements.get(ATAG_PREFIX + tagName.toLowerCase()) === undefined;
  }
}

/**
 * Setup atag by remote JS asset.
 * @param tagName {String} Atag name.
 * @param getURL {Function} Pass tagName and version as args, return an cdn url.
 */
export function setupAtag(tagName, getURL) {
  const url = getURL(tagName, VERSION);
  loadScript(url);
}

/**
 * Load js assets in DOM.
 * @param url {URL | String} JS asset url.
 * @param onSuccess {Function} Success callback.
 * @param onFail {Function} Fail callback.
 */
function loadScript(url, onSuccess = noop(), onFail = noop()) {
  /**
   * Perevent from loading a same url.
   */
  if (SCRIPT_LOAD_STATE[url] === 'loading') return;
  const script = document.createElement('script');
  SCRIPT_LOAD_STATE[url] = 'loading';

  script.onload = () => {
    SCRIPT_LOAD_STATE[url] = 'loaded';
    onSuccess();
  };
  script.onerror = () => {
    SCRIPT_LOAD_STATE[url] = 'failed';
    onFail();
  };
  script.src = url;
  document.body.appendChild(script);
}

// Expose global object.
window.__SETUP_ATAG__ = setupAtag;
window.__SHOULD_SETUP_ATAG__ = shouldSetupAtag;
