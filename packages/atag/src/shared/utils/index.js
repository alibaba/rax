import throttle from './throttle';
import easeInOutCubic from './easeInOutCubic';
import handlerSubmit from './formHandler';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

export {
  afterNextRender,
  throttle,
  easeInOutCubic,
  handlerSubmit,
  GestureEventListeners,
  Gestures
};
export { isIOS, isAndroid, isTB } from './device';
