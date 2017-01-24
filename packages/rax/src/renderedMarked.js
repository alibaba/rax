
const MARKED_ATTR_NAME = 'data-rendered';

/**
 * add renered marked to element
 */
export function addRenderedMarkedToElement(element, markedValue) {
  if (!element || !element.attributes) {
    return element;
  }

  element.attributes[MARKED_ATTR_NAME] = markedValue;
  return element;
}

/**
 * Determine whether the element has rendered marked
 */
export function hasRenderedMarked(element) {
  let existingMarked = element.getAttribute && element.getAttribute(MARKED_ATTR_NAME);
  return !!existingMarked;
}

