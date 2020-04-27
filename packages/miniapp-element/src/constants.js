export const ELEMENT_DIFF_KEYS = ['nodeId', 'pageId', 'tagName', 'compName', 'id',
  'class', 'style', 'src', 'mode', 'lazyLoad', 'showMenuByLongpress',
  'isImage', 'isLeaf', 'isSimple', 'content', 'extra', 'animation'];
export const TEXT_NODE_DIFF_KEYS = ['nodeId', 'pageId', 'content'];
export const NEET_BEHAVIOR_NORMAL_CUSTOM_ELEMENT = ['movable-view', 'swiper-item', 'picker-view-column'];
export const NOT_SUPPORT = ['IFRAME', 'A'];
// The nodes that class and style need to be separated
export const NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT = ['INPUT', 'TEXTAREA', 'VIDEO',
  'CANVAS', 'BUILTIN-COMPONENT', 'CUSTOM-COMPONENT'];
// The nodes that must be render as custom components
export const NEET_RENDER_TO_CUSTOM_ELEMENT = [...NOT_SUPPORT, ...NEET_SPLIT_CLASS_STYLE_FROM_CUSTOM_ELEMENT];
