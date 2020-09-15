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
import video from './video';
import map from './map';
import canvas from './canvas';
import webView from './web-view';

// Sub components
import movableView from './movable-view';
import swiperItem from './swiper-item';
import pickerViewColumn from './picker-view-column';

const components = [
  coverImage,
  coverView,
  movableArea,
  scrollView,
  swiper,
  view,
  icon,
  progress,
  text,
  richText,
  button,
  editor,
  form,
  label,
  input,
  radioGroup,
  radio,
  checkboxGroup,
  checkbox,
  picker,
  pickerView,
  slider,
  switchCom,
  textarea,
  navigator,
  camera,
  image,
  video,
  map,
  canvas,
  webView,
  movableView,
  swiperItem,
  pickerViewColumn,
];

const handlesMap = {
  simpleEvents: [],
  singleEvents: [],
  functionalSingleEvents: [],
  complexEvents: []
};

components.forEach(
  ({
    simpleEvents,
    singleEvents,
    functionalSingleEvents,
    complexEvents,
  }) => {
    if (simpleEvents) {
      handlesMap.simpleEvents = handlesMap.simpleEvents.concat(simpleEvents);
    }
    if (singleEvents) {
      handlesMap.singleEvents = handlesMap.singleEvents.concat(singleEvents);
    }
    if (functionalSingleEvents) {
      handlesMap.functionalSingleEvents = handlesMap.functionalSingleEvents.concat(
        functionalSingleEvents
      );
    }
    if (complexEvents) {
      handlesMap.complexEvents = handlesMap.complexEvents.concat(complexEvents);
    }
  }
);

export { handlesMap };
