// Components
import coverImage from './cover-image';
import coverView from './cover-view';
import movableArea from './movable-area';
import scrollView from './scroll-view';
import swiper from './swiper';
import view from './view';
import icon from './icon';
import progress from './progress';
import text from './text';
import richText from './rich-text';
import button from './button';
import editor from './editor';
import form from './form';
import label from './label';
import input from './input';
import radioGroup from './radio-group';
import radio from './radio';
import checkboxGroup from './checkbox-group';
import checkbox from './checkbox';
import picker from './picker';
import pickerView from './picker-view';
import slider from './slider';
import switchCom from './switch';
import textarea from './textarea';
import navigator from './navigator';
import camera from './camera';
import image from './image';
import livePlayer from './live-player';
import livePusher from './live-pusher';
import video from './video';
import map from './map';
import canvas from './canvas';
import ad from './ad';
import officialAccount from './official-account';
import openData from './open-data';
import webView from './web-view';

// Sub components
import movableView from './movable-view';
import swiperItem from './swiper-item';
import pickerViewColumn from './picker-view-column';

const components = [
  coverImage, coverView, movableArea, scrollView, swiper, view, icon, progress,
  text, richText, button, editor, form, label, input, radioGroup, radio, checkboxGroup, checkbox, picker, pickerView, slider, switchCom, textarea,
  navigator, camera, image, livePlayer, livePusher, video, map, canvas, ad, officialAccount,
  openData, webView
];

const subComponents = [movableView, swiperItem, pickerViewColumn];

const componentNameMap = {};
const subComponentNameMap = {};
const propsMap = {};

components.forEach(({ name, props}) => {
  componentNameMap[name] = name;
  propsMap[name] = props;
});

subComponents.forEach(({ name, props, handles}) => {
  subComponentNameMap[name] = name;
  propsMap[name] = props;
});

// Tags below will be mapped to miniapp builtinComponent, others will be mapped to view
const WEB_TAG_MAP = {
  IMG: 'image',
  INPUT: 'input',
  TEXTAREA: 'textarea',
  VIDEO: 'video',
  CANVAS: 'canvas'
};

Object.entries(WEB_TAG_MAP).forEach(([TAG_NAME, builtinTagName]) => {
  propsMap[TAG_NAME] = propsMap[builtinTagName];
})

export {
  componentNameMap,
  propsMap,
  subComponentNameMap,
};
