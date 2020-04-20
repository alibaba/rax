/**
 * Hump to hyphen
 */
function toDash(str) {
  return str.replace(/[A-Z]/g, all => `-${all.toLowerCase()}`);
}

/**
 * Hyphen to hump
 */
function toCamel(str) {
  return str.replace(/-([a-zA-Z])/g, (all, $1) => $1.toUpperCase());
}

/**
 * Get unique id
 */
let seed = +new Date();
function getId() {
  return seed++;
}

/**
 * Gets the route of the miniapp page from the pageId
 */
function getPageRoute(pageId) {
  return pageId.split('-')[2];
}

/**
 * Gets the applet page name from pageRoute
 */
function getPageName(pageRoute) {
  const splitPageRoute = pageRoute.split('/');
  return splitPageRoute[1] === 'pages' ? splitPageRoute[2] : splitPageRoute[1];
}

/**
 * Throttling, which is called only once in a synchronous flow
 */
const waitFuncSet = new Set();
function throttle(func) {
  return () => {
    if (waitFuncSet.has(func)) return;

    waitFuncSet.add(func);

    Promise.resolve().then(() => {
      if (waitFuncSet.has(func)) {
        waitFuncSet.delete(func);
        func();
      }
    }).catch(() => {
      // ignore
    });
  };
}

/**
 * Clear throttling cache
 */
function flushThrottleCache() {
  waitFuncSet.forEach(waitFunc => waitFunc && waitFunc());
  waitFuncSet.clear();
}

/**
 * Encode special character
 */
function decodeContent(content) {
  return content
    .replace(/&nbsp;/g, '\u00A0')
    .replace(/&ensp;/g, '\u2002')
    .replace(/&emsp;/g, '\u2003')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, '\'')
    .replace(/&amp;/g, '&');
}

/**
 * Check tag wheather supported
 */
const NOT_SUPPORT_TAG_NAME_LIST = ['IFRAME', 'A'];
function isTagNameSupport(tagName) {
  return NOT_SUPPORT_TAG_NAME_LIST.indexOf(tagName) === -1;
}

export default {
  toDash,
  toCamel,
  getId,
  getPageRoute,
  getPageName,
  throttle,
  flushThrottleCache,
  decodeContent,
  isTagNameSupport,
};
