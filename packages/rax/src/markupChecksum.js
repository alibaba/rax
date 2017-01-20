const MOD = 65521;
const CHECKSUM_ATTR_NAME = 'data-rax-checksum';
const TAG_END = /\/?>/;

// adler32 is not cryptographically strong, and is only used to sanity check that
// markup generated on the server matches the markup generated on the client.
// This implementation (a modified version of the SheetJS version) has been optimized
// for our use case, at the expense of conforming to the adler32 specification
// for non-ascii inputs.
export function adler32(data) {
  let a = 1;
  let b = 0;
  let i = 0;
  let l = data.length;
  let m = l & ~0x3;
  while (i < m) {
    let n = Math.min(i + 4096, m);
    for (; i < n; i += 4) {
      b += (a += data.charCodeAt(i)) + (a += data.charCodeAt(i + 1)) + (a += data.charCodeAt(i + 2)) + (a += data.charCodeAt(i + 3));
    }
    a %= MOD;
    b %= MOD;
  }
  for (; i < l; i++) {
    b += a += data.charCodeAt(i);
  }
  a %= MOD;
  b %= MOD;
  return a | b << 16;
}


/**
  * add checksum to markup
*/
export function addChecksumToMarkup(markup) {
  markup = markup || '';
  let checksum = adler32(markup);

  // Add checksum (handle both parent tags, comments and self-closing tags)
  return markup.replace(TAG_END, ' ' + CHECKSUM_ATTR_NAME + '="' + checksum + '"$&');
}

/**
  * @param {DOMElement} element root React element
  * @returns {boolean} whether or not there has checksum
*/

export function canReuseMarkup(element) {
  let existingChecksum = element.getAttribute && element.getAttribute(CHECKSUM_ATTR_NAME);
  return !!existingChecksum;
}

