const ESCAPE_LOOKUP = {
  '&': '&amp;',
  '>': '&gt;',
  '<': '&lt;',
  '"': '&quot;',
  '\'': '&#x27;',
};

const ESCAPE_REGEX = /[&><"']/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

export default function escapeText(text) {
  return String(text).replace(ESCAPE_REGEX, escaper);
}
