const CHECKSUM_ATTR_NAME = 'data-rax-checksum';

/**
 * generate checksum by content
 * 
 * @TODO use adler32
 */
function generateChecksum(content) {
  return 'rax-checksum';
}

/**
 * add checksum to element
 */
export function addChecksumToElement(element, markup) {
  let checksum = generateChecksum(markup || '');
  element.attributes[CHECKSUM_ATTR_NAME] = checksum;

  return element;
}

/**
 * Judge markeup canReuse through checksum
 * 
 * @param {DOMElement} element root React element
 * @returns {boolean} whether or not there has checksum
 */
export function canReuseMarkup(element) {
  let existingChecksum = element.getAttribute && element.getAttribute(CHECKSUM_ATTR_NAME);
  return !!existingChecksum;
}

