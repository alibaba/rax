// Components
import coverImage from './buildInComponents/cover-image';
import coverView from './buildInComponents/cover-view';
import movableArea from './buildInComponents/movable-area';
import scrollView from './buildInComponents/scroll-view';
import swiper from './buildInComponents/swiper';
import view from './buildInComponents/view';
import icon from './buildInComponents/icon';
import progress from './buildInComponents/progress';
import text from './buildInComponents/text';
import button from './buildInComponents/button';
import editor from './buildInComponents/editor';
import form from './buildInComponents/form';
import input from './buildInComponents/input';
import picker from './buildInComponents/picker';
import pickerView from './buildInComponents/picker-view';
import slider from './buildInComponents/slider';
import switchCom from './buildInComponents/switch';
import textarea from './buildInComponents/textarea';
import navigator from './buildInComponents/navigator';
import camera from './buildInComponents/camera';
import image from './buildInComponents/image';
import livePlayer from './buildInComponents/live-player';
import livePusher from './buildInComponents/live-pusher';
import video from './buildInComponents/video';
import map from './buildInComponents/map';
import canvas from './buildInComponents/canvas';
import ad from './buildInComponents/ad';
import officialAccount from './buildInComponents/official-account';
import openData from './buildInComponents/open-data';
import webView from './buildInComponents/web-view';

// Sub components
import movableView from './buildInComponents/movable-view';
import swiperItem from './buildInComponents/swiper-item';
import pickerViewColumn from './buildInComponents/picker-view-column';

const components = [
  coverImage, coverView, movableArea, scrollView, swiper, view, icon, progress,
  text, button, editor, form, input, picker, pickerView, slider, switchCom, textarea,
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
