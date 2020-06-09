export const ELEMENT_DIFF_KEYS = [
  'nodeId',
  'pageId',
  'tagName',
  'compName',
  'id',
  'className',
  'style',
  'src',
  'mode',
  'lazyLoad',
  'showMenuByLongpress',
  'useTemplate',
  'isImage',
  'isLeaf',
  'isSimple',
  'content',
  'extra',
  'animation',
];
export const TEXT_NODE_DIFF_KEYS = ['nodeId', 'pageId', 'content'];
export const NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT = [
  'movable-view',
  'swiper-item',
  'picker-view-column',
];
export const NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT_PARENT = [
  'swiper',
  'movable-area',
];
export const NOT_SUPPORT = ['IFRAME', 'A'];
// The nodes that class and style need to be separated
export const NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT = [
  'BUILTIN-COMPONENT',
  'CUSTOM-COMPONENT',
];
export const USE_TEMPLATE = [
  'cover-image',
  'movable-area',
  'movable-view',
  'swiper',
  'swiper-item',
  'icon',
  'progress',
  'rich-text',
  'button',
  'editor',
  'form',
  'INPUT',
  'picker',
  'slider',
  'switch',
  'TEXTAREA',
  'navigator',
  'camera',
  'image',
  'live-player',
  'live-pusher',
  'label',
  'radio',
  'radio-group',
  'checkbox',
  'checkbox-group',
  'VIDEO',
  'map',
  'CANVAS',
  'ad',
  'official-account',
  'open-data',
  'web-view',
];
// The nodes that must be render as custom components
export const NEET_RENDER_TO_CUSTOM_ELEMENT = [
  ...NOT_SUPPORT,
  ...NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT,
];

export const IN_COVER = ['cover-view'];
