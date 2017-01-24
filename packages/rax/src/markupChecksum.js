const CHECKSUM_ATTR_NAME = 'data-rax-checksum';
const TAG_END = /\/?>/;
const CHECKSUM = 'rax-checksum';

/**
  * add checksum to markup
*/
export function addChecksumToMarkup(markup) {
  markup = markup || '';

  // Add checksum (handle both parent tags, comments and self-closing tags)
  return `<div ${CHECKSUM_ATTR_NAME}="${CHECKSUM}">${markup}</div>`;
}

/**
  * @param {DOMElement} element root React element
  * @returns {boolean} whether or not there has checksum
*/

export function canReuseMarkup(element) {
  let existingChecksum = element.getAttribute && element.getAttribute(CHECKSUM_ATTR_NAME);
  return !!existingChecksum;
}