
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
