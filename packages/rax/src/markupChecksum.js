const MARKER_ATTR_NAME = 'data-server-render';
const MARKER = true;

/**
  * add checksum to markup
*/
export function addMarkerToMarkup(markup) {
  markup = markup || '';

  // Add checksum (handle both parent tags, comments and self-closing tags)
  return `<div ${MARKER_ATTR_NAME}="${MARKER}">${markup}</div>`;
}

/**
  * @param {DOMElement} element root React element
  * @returns {boolean} whether or not there has checksum
*/

export function canReuseMarkup(element) {
  let existingMarker = element.getAttribute && element.getAttribute(MARKER_ATTR_NAME);
  return !!existingMarker;
}