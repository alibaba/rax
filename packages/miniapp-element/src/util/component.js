const componentMap = {
  // 视图容器
  'cover-image': {
    componentName: 'cover-image',
    config: import('../component/cover-image'),
  },
  'cover-view': {
    componentName: 'cover-view',
    config: import('../component/cover-view'),
  },
  'movable-area': {
    componentName: 'movable-area',
    config: import('../component/movable-area'),
  },
  'scroll-view': {
    componentName: 'scroll-view',
    config: import('../component/scroll-view'),
  },
  swiper: {
    componentName: 'swiper',
    config: import('../component/swiper'),
  },
  view: {
    componentName: 'view',
    config: import('../component/view'),
  },
  // 基础内容
  icon: {
    componentName: 'icon',
    config: import('../component/icon'),
  },
  progress: {
    componentName: 'progress',
    config: import('../component/progress'),
  },
  text: {
    componentName: 'text',
    config: import('../component/text'),
  },
  // 表单组件
  button: {
    componentName: 'button',
    config: import('../component/button'),
  },
  editor: {
    componentName: 'editor',
    config: import('../component/editor'),
  },
  form: {
    componentName: 'form',
    config: import('../component/form'),
  },
  INPUT: {
    componentName: 'input',
    config: import('../component/input'),
  },
  picker: {
    componentName: 'picker',
    config: import('../component/picker'),
  },
  'picker-view': {
    componentName: 'picker-view',
    config: import('../component/picker-view'),
  },
  slider: {
    componentName: 'slider',
    config: import('../component/slider'),
  },
  switch: {
    componentName: 'switch',
    config: import('../component/switch'),
  },
  TEXTAREA: {
    componentName: 'textarea',
    config: import('../component/textarea'),
  },
  // 导航
  navigator: {
    componentName: 'navigator',
    config: import('../component/navigator'),
  },
  // 媒体组件
  camera: {
    componentName: 'camera',
    config: import('../component/camera'),
  },
  image: {
    componentName: 'image',
    config: import('../component/image'),
  },
  'live-player': {
    componentName: 'live-player',
    config: import('../component/live-player'),
  },
  'live-pusher': {
    componentName: 'live-pusher',
    config: import('../component/live-pusher'),
  },
  VIDEO: {
    componentName: 'video',
    config: import('../component/video'),
  },
  // 地图
  map: {
    componentName: 'map',
    config: import('../component/map'),
  },
  // 画布
  CANVAS: {
    componentName: 'canvas',
    config: import('../component/canvas'),
  },
  // 开放能力
  ad: {
    componentName: 'ad',
    config: import('../component/ad'),
  },
  'official-account': {
    componentName: 'official-account',
    config: import('../component/official-account'),
  },
  'open-data': {
    componentName: 'open-data',
    config: import('../component/open-data'),
  },
  'web-view': {
    componentName: 'web-view',
    config: import('../component/web-view'),
  },
};

const subComponentMap = {
  'movable-view': import('../component/movable-view'),
  'swiper-item': import('../component/swiper-item'),
  'picker-view-column': import('../component/picker-view-column'),
};

const componentKeys = Object.keys(componentMap);
const componentNameMap = {};
const PROPS = {};
const handles = {};
componentKeys.forEach(key => {
  const {componentName, config} = componentMap[key];

  componentNameMap[key] = componentName;
  PROPS[componentName] = config.PROPS;
  Object.assign(handles, config.handles);
});
Object.keys(subComponentMap).forEach(key => {
  const config = subComponentMap[key];
  Object.assign(handles, config.handles);
});

export default {
  componentNameMap,
  PROPS,
  handles,
  subComponentMap,
};
