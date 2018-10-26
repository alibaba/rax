const customTags = {
  'audio': true,
  'button': true,
  'canvas': true,
  'checkbox': true,
  'checkbox-group': true,
  'icon': true,
  'label': true,
  'picker': true,
  'picker-view': true,
  'picker-view-column': true,
  'radio': true,
  'slider': true,
  'text': true,
  'video': true,
  'image': true,
  'input': true,
  'map': true,
  'radio-group': true,
  'swiper': true,
  'swiper-item': true,
  'textarea': true,
  'view': true,
  'form': true,
  'navigator': true,
  'progress': true,
  'scroll-view': true,
  'switch': true,
  'web-view': true,
};

const w3cTags = {
  'style': true
};

export function isCustomTags(tagName) {
  return customTags.hasOwnProperty(tagName);
}

export function isW3CTag(tagName) {
  return w3cTags.hasOwnProperty(tagName);
}
