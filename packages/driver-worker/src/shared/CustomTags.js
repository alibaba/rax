const customTags = [
  'audio',
  'button',
  'canvas',
  'checkbox',
  'checkbox-group',
  'icon',
  'label',
  'picker',
  'picker-view',
  'picker-view-column',
  'radio',
  'slider',
  'text',
  'video',
  'image',
  'input',
  'map',
  'radio-group',
  'swiper',
  'swiper-item',
  'textarea',
  'view',
  'form',
  'navigator',
  'progress',
  'scroll-view',
  'switch',
  'web-view',
];

const _customTagsMap = {};
for (let i = 0, l = customTags.length; i < l; i++) {
  _customTagsMap[customTags[i]] = true;
}
export function isCustomTags(tagName) {
  return _customTagsMap.hasOwnProperty(tagName);
}
