import tool from './utils/tool';
import cache from './utils/cache';
import EventTarget from './event/event-target';
import Event from './event/event';
import createAppConfig from './createConfig/app';
import createPageConfig from './createConfig/page';

export default {
  createAppConfig,

  createPageConfig,

  // For miniprogram-element
  $$adapter: {
    cache,
    EventTarget,
    Event,
    tool
  }
};
