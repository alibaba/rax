/* global VERSION */
function noop() {}

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

const CDN_PREFIX = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9001'
  : 'https://g.alicdn.com/code/npm/atag';
const ENABLE_CDN_COMBO = /alicdn/.test(CDN_PREFIX);

/**
 * Load component.
 * @param name {String} Component name.
 * @param version {String} Atag version.
 */
export function loadComponent(name, version) {
  const url = process.env.NODE_ENV === 'development'
    ? `http://localhost:9001/${name}.js`
    : `${CDN_PREFIX}/${version}/dist/${name}.js`;
  loadScript(url);
}

export function getPrefixedTagName(prefix = 'a-') {
  const prefixReg = new RegExp('^' + prefix, 'i');
  const tags = document.getElementsByTagName('*');
  const tagNames = {};
  for (let i = 0, l = tags.length; i < l; i ++) {
    if (prefixReg.test(tags[i].tagName)) {
      tagNames[tags[i].tagName] = true;
    }
  }
  return Object.keys(tagNames);
}

const documentCreateElement = document.createElement;

function createElement(tagName, options) {
  const _tagName = String(tagName);
  if (_tagName.indexOf(ATAG_PREFIX) === 0 && customElements.get(tagName) === undefined) {
    const componentName = _tagName.slice(ATAG_PREFIX.length).toLowerCase();
    if (IGNORED_TAG.indexOf(componentName) === -1) {
      loadComponent(componentName, VERSION);
    }
  }
  return documentCreateElement.call(document, tagName, options);
}

function hijactCreateElement() {
  document.createElement = createElement;
}


function dynamicLoad() {
  /**
   * Hijact document.createElement to detect newly added tag.
   * @TODO: Use MutaionObserver to observe tag that added by innerHTML or other way. But which is not effient for DOM.
   */
  hijactCreateElement();

  const tagNames = getPrefixedTagName(ATAG_PREFIX);
  let comboUrl = `${CDN_PREFIX}/${VERSION}/dist/??`;
  for (let i = 0, l = tagNames.length; i < l; i++) {
    const componentName = tagNames[i].slice(ATAG_PREFIX.length).toLowerCase();
    if (!customElements.get(ATAG_PREFIX + componentName) && IGNORED_TAG.indexOf(componentName) === -1) {
      if (ENABLE_CDN_COMBO) {
        comboUrl += componentName + '.js';
        if (i < l - 1) comboUrl += ',';
      } else {
        loadComponent(componentName, VERSION);
      }
    }
  }
  if (ENABLE_CDN_COMBO) {
    loadScript(comboUrl);
  }
}

dynamicLoad();
