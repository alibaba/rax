const currentPages = [];

/**
 * Api interface of `getCurrentPages()`
 */
export function getCurrentPages() {
  return currentPages;
}

/**
 * Push a page instance reference to stack.
 * @param pageInstance
 */
export function pushPage(pageInstance) {
  currentPages.push(pageInstance);
}

/**
 * Remove page instance from stack.
 * @param pageInstance
 */
export function unlinkPage(pageInstance) {
  for (let i = currentPages.length - 1; i > 0; i--) {
    if (currentPages[i] === pageInstance) {
      currentPages.splice(i, 1);
    }
  }
}

/**
 * Make the page instance popup to latest.
 * @param pageInstance
 */
export function popupPage(pageInstance) {
  unlinkPage(pageInstance);
  pushPage(pageInstance);
}
