import injectStyle from './injectStyle';

import { afterNextRender } from '@polymer/polymer/lib/utils/render-status';
import throttle from './throttle';
import easeInOutCubic from './easeInOutCubic';
import handlerSubmit from './formHandler';

export {
  injectStyle,
  afterNextRender,
  throttle,
  easeInOutCubic,
  handlerSubmit
};
export { isIOS, isAndroid, isTB } from './device';
