const w3cTags = [
  'style',
];

const _w3cTags = {};
for (let i = 0, l = w3cTags.length; i < l; i++) {
  _w3cTags[w3cTags[i]] = true;
}

export function isW3CTag(tagName) {
  return _w3cTags.hasOwnProperty(tagName);
}
