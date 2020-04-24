// Components
import coverImage from './builtInComponents/cover-image';
import coverView from './builtInComponents/cover-view';
import movableArea from './builtInComponents/movable-area';
import scrollView from './builtInComponents/scroll-view';
import swiper from './builtInComponents/swiper';
import view from './builtInComponents/view';
import icon from './builtInComponents/icon';
import progress from './builtInComponents/progress';
import text from './builtInComponents/text';
import richText from './builtInComponents/rich-text';
import button from './builtInComponents/button';
import editor from './builtInComponents/editor';
import form from './builtInComponents/form';
import label from './builtInComponents/label';
import input from './builtInComponents/input';
import radioGroup from './builtInComponents/radio-group';
import radio from './builtInComponents/radio';
import checkboxGroup from './builtInComponents/checkbox-group';
import checkbox from './builtInComponents/checkbox';
import picker from './builtInComponents/picker';
import pickerView from './builtInComponents/picker-view';
import slider from './builtInComponents/slider';
import switchCom from './builtInComponents/switch';
import textarea from './builtInComponents/textarea';
import navigator from './builtInComponents/navigator';
import camera from './builtInComponents/camera';
import image from './builtInComponents/image';
import livePlayer from './builtInComponents/live-player';
import livePusher from './builtInComponents/live-pusher';
import video from './builtInComponents/video';
import map from './builtInComponents/map';
import canvas from './builtInComponents/canvas';
import ad from './builtInComponents/ad';
import officialAccount from './builtInComponents/official-account';
import openData from './builtInComponents/open-data';
import webView from './builtInComponents/web-view';

// Sub components
import movableView from './builtInComponents/movable-view';
import swiperItem from './builtInComponents/swiper-item';
import pickerViewColumn from './builtInComponents/picker-view-column';

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
const handlesMap = {};

components.forEach(({ name, props, handles}) => {
  componentNameMap[name] = name;
  propsMap[name] = props;
  Object.assign(handlesMap, handles);
});

subComponents.forEach(({ name, props, handles}) => {
  subComponentNameMap[name] = name;
  propsMap[name] = props;
  Object.assign(handlesMap, handles);
});


export {
  componentNameMap,
  propsMap,
  handlesMap,
  subComponentNameMap,
};
