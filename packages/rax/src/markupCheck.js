const MARKER_ATTR_NAME = 'data-server-render';
const MARKER = true;

/**
 * add marker to markup
 * @param {String} markup
 * @return {String} marked markup
 */
export function addMarkerToMarkup(markup) {
  markup = markup || '';

  // Add marker (handle both parent tags, comments and self-closing tags)
  return `<div ${MARKER_ATTR_NAME}="${MARKER}">${markup}</div>`;
}

/**
 * check whether or not there has marker
 * @param {DOMElement} element root React element
 * @return {Boolean} whether or not there has marker
*/

export function isRenderedByServer(element) {
  let existingMarker = element.getAttribute && element.getAttribute(MARKER_ATTR_NAME);
  return !!existingMarker;
}