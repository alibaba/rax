import injectStyle from './injectStyle';

import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import throttle from './throttle';
import easeInOutCubic from './easeInOutCubic';
import handlerSubmit from './formHandler';

import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import * as Gestures from '@polymer/polymer/lib/utils/gestures.js';

export {
  injectStyle,
  afterNextRender,
  throttle,
  easeInOutCubic,
  handlerSubmit,
  GestureEventListeners,
  Gestures
};
export { isIOS, isAndroid, isTB } from './device';
